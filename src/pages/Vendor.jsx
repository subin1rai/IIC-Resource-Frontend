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
  const [filterFormVisibility, setFilterFormVisibility] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openAddVendorForm = () => {
    setAddFormVisibility(true);
  };

  const displayFilterForm = () =>  {
    setFilterFormVisibility(true);
}


  const closeAddVendorForm = () => {
    setError("");
    setAddFormVisibility(false);
  };

  const closeFilterForm = () => {
    setFilterFormVisibility(false);
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
              <button className="category-btn" aria-label="Menu" onClick={displayFilterForm}>
                <img src={filterIcon} alt="" />
                Filter
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
       {filterFormVisibility && (
            <form className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white z-50 p-8 flex flex-col w-fit h-fit gap-4">
              <div className="flex justify-between">
               <h2 className="font-semibold text-xl"> Select Filtering Option</h2><button
              type="button"
              className="discard-btn"
              onClick={closeFilterForm}
            >
              <img src={close} alt="" />
            </button>
            </div>
             <label>
            Select Category
             </label>
             <div className="flex gap-6">
             <Select
                  // options={categoryOptions}
                  // onChange={(selectedOption) =>
                  //   handleSelectChange(selectedOption, { name: "feature" })
                  // }
                  // value={categoryOptions.find(
                  //   (option) => option.value === itemData.category
                  // )}
                  // placeholder="Choose Category"
                  // styles={customStyles}
                  // className="react-select-container"
                  // classNamePrefix="react-select"
                />
             <Select
                  // options={itemCategoryOptions}
                  // onChange={(selectedOption) =>
                  //   handleSelectChange(selectedOption, { name: "itemCategory" })
                  // }
                  // value={itemCategoryOptions.find(
                  //   (option) => option.value === itemData.itemCategory
                  // )}
                  // placeholder="Choose Item Category"
                  // styles={customStyles}
                  // className="react-select-container"
                  // classNamePrefix="react-select"
                />
                 <Select
                  // options={productCategoryOptions}
                  // onChange={(selectedOption) =>
                  //   handleSelectChange(selectedOption, { name: "productCategory" })
                  // }
                  // value={productCategoryOptions.find(
                  //   (option) => option.value === itemData.productCategory
                  // )}
                  // placeholder="Choose Product Category"
                  // styles={customStyles}
                  // className="react-select-container"
                  // classNamePrefix="react-select"
                />
               </div>
            <label>
              Select Date:
            </label>
            <div className="flex gap-6">
            <input className="border-2  border-neutral-200 p-1.5 rounded-md w-[14.4vw]" type = "date" placeholder=" from"/>
            <input className="border-2 border-neutral-200 p-1.5 rounded-md w-[14.4vw]" type = "date" placeholder="to"/>
            </div>
            </form>
          )}
      {addFormVisibility && (
        <div className="overlay-vendor" onClick={closeAddVendorForm}></div>
      )}
       {filterFormVisibility && (
          <div className ="overlay-vendor" onCick={closeFilterForm}> </div>
        )}
      <ToastContainer pauseOnHover theme="light" />
    </div>
  );
};

export default Vendor;
