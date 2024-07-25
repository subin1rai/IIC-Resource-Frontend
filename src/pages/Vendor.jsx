import "../styles/vendor.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import React, { useEffect, useState } from "react";
import filterIcon from "../assets/filter.svg";
import validVendor from "../assets/user.svg";
import close from "../assets/close.svg";
import axios from "axios";
import VendorTable from "../components/VendorTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const Vendor = () => {
  const [vendor, setVendor] = useState({
    vendor_name: "",
    vat_number: "",
    vendor_contact: "",
    payment_duration: "",
    category: "",
  });

  const [error, setError] = useState("");
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openAddVendorForm = () => {
    setAddFormVisibility(true);
  };

  const closeAddVendorForm = () => {
    setError("");
    setAddFormVisibility(false);
  };

  const handleChange = (e) => {
    setVendor((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8898/api/addVendor",
        vendor,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new vendor to the state
      setVendors((prevVendors) => [...prevVendors, response.data.vendor]);

      toast.success(`${vendor.vendor_name} Added Successfully!`);
      setAddFormVisibility(false);

      // Reset the vendor form
      setVendor({
        vendor_name: "",
        vat_number: "",
        vendor_contact: "",
        payment_duration: "",
        category: "",
      });
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.error || "An error occurred");
    }
  };

  useEffect(() => {
    const getAllVendors = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/vendor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVendors(response.data.vendors || []);
        setFilteredVendors(response.data.vendors || []);
      } catch (error) {
        console.log("Error fetching vendors:", error);
        setVendors([]);
        setFilteredVendors([]);
      }
    };

    getAllVendors();
  }, [token]);

  useEffect(() => {
    let results = vendors;

    if (searchTerm) {
      results = results.filter((vendor) =>
        vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      results = results.filter(
        (vendor) => vendor.category === selectedCategory.value
      );
    }

    setFilteredVendors(results);
  }, [searchTerm, selectedCategory, vendors]);

  const categoryOptions = [
    { value: "Category1", label: "Category1" },
    { value: "Category2", label: "Category2" },
    // Add more categories as needed
  ];

  return (
    <div className="vendor">
      <Sidebar />
      <div className="vendor-main">
        <Topbar />
        <div className="vendor-summary">
          <div className="overall-vendor">
            <h3 className="summary-title">Summary</h3>
            <div className="summary-container">
              <div className="summary">
                <img src={validVendor} alt="" />
                <h4>{vendors.length}</h4>
                <p>Number of Vendors</p>
              </div>
              {/* Add other summary items here */}
            </div>
          </div>
        </div>

        <div className="vendor-container">
          <div className="top">
            <div className="up">
              <p> Vendors </p>
            </div>

            <div className="right">
              <input
                type="text"
                placeholder="Search Vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-slate-300 rounded"
              />
              <button className="category-btn" aria-label="Menu">
                <img src={filterIcon} alt="" />
                Category
              </button>
              <button className="add-button" onClick={openAddVendorForm}>
                Add Vendor
              </button>
            </div>
          </div>

          <VendorTable vendors={filteredVendors} />
        </div>
      </div>
      {addFormVisibility && (
        <form onSubmit={handleSubmit} className="filter">
          <button
            type="button"
            className="discard-button"
            onClick={closeAddVendorForm}
          >
            <img src={close} alt="" />
          </button>
          <p className="vendor_title">Add Vendor</p>
          <div className="vendor_field">
            <label htmlFor="vendor_name">Vendor Name</label>
            <input
              type="text"
              placeholder="Enter vendor name"
              autoFocus
              name="vendor_name"
              id="vendor_name"
              onChange={handleChange}
              value={vendor.vendor_name}
            />
          </div>
          <div className="vendor_field">
            <label htmlFor="vat_number">Vendor Vat</label>
            <input
              type="number"
              name="vat_number"
              placeholder="Vendor VAT number"
              onChange={handleChange}
              value={vendor.vat_number}
            />
          </div>
          <div className="vendor_field">
            <label htmlFor="vendor_contact">Contact</label>
            <input
              type="number"
              placeholder="Enter contact number"
              name="vendor_contact"
              onChange={handleChange}
              value={vendor.vendor_contact}
            />
          </div>
          <div className="vendor_field">
            <label htmlFor="payment_duration">Payment Duration</label>
            <input
              type="number"
              placeholder="Enter payment duration"
              name="payment_duration"
              onChange={handleChange}
              value={vendor.payment_duration}
            />
          </div>

          {error && <span className="text-red-500">{error}</span>}

          <div className="vendor_buttons">
            <button type="submit" className="add-button">
              Add Vendor
            </button>
          </div>
        </form>
      )}
      {addFormVisibility && (
        <div className="overlay-vendor" onClick={closeAddVendorForm}></div>
      )}
      <ToastContainer pauseOnHover theme="light" />
    </div>
  );
};

export default Vendor;
