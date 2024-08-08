import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import React, { useEffect, useState } from "react";
import validVendor from "../assets/user.svg";
import filterIcon from "../assets/filter.svg";
import close from "../assets/close.svg";
import axios from "axios";
import VendorTable from "../components/VendorTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import vendorno from "../assets/vendorcount.png";
import blacklist from "../assets/blacklist.png";
import Select from "react-select";

const Vendor = () => {
  const [vendor, setVendor] = useState({
    vendor_name: "",
    vat_number: "",
    vendor_contact: "",
    payment_duration: "",
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

  const [blackListCount, setBlackListCount] = useState(0);

  const displayFilterForm = () => {
    setFilterFormVisibility(true);
  };

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
      setVendors((prevVendors) => [...prevVendors, response.data.vendorData]);

      toast.success(`${vendor.vendor_name} Added Successfully!`);
      setAddFormVisibility(false);

      // Reset the vendor form
      setVendor({
        vendor_name: "",
        vat_number: "",
        vendor_contact: "",
        payment_duration: "",
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

        setVendors(response.data.vendor || []);

        const count = response.data.vendor.filter(
          (req) => req.black_list
        ).length;

        setBlackListCount(count);
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
    <div className=" bg-background flex justify-between h-screen w-screen relative">
      <Sidebar />
      <div className=" mx-auto flex flex-col gap-4   items-center relative">
        <Topbar />
        <div className="flex flex-wrap w-[87vw]  gap-4 justify-center">
          <div className="flex flex-col w-[85.5vw]  bg-white rounded-lg p-3 gap-3">
            <h1 className="flex text-lg font-bold m-3">Vendor Summary</h1>
            <div className="flex justify-around">
              {/* number of vendor summary */}
              <div className="flex flex-col items-center justify-center gap-1">
                <img
                  src={vendorno}
                  alt="number of vendors"
                  className="h-8 w-8"
                />
                <h4>{vendors.length}</h4>
                <p className="font-medium">Number of Vendors</p>
              </div>
              {/* number of blacklisted vendors */}
              <div className="flex flex-col items-center justify-center gap-1">
                <img
                  src={blacklist}
                  alt="number of vendors"
                  className="h-8 w-8"
                />
                <h4>{blackListCount}</h4>
                <p className="font-medium">Number of Blacklisted Vendors</p>
              </div>
            </div>
          </div>
          {/* second container */}
        </div>
        <div className="flex flex-col bg-white justify-center items-center w-[85.5vw] p-3 rounded-xl">
          <div className="flex w-[85.8vw] justify-between">
            <div className="text-lg m-4">
              <p className="flex text-lg font-bold m-3">Vendors</p>
            </div>
            <div className="flex justify-between gap-5 m-4 mr-10">
              <input
                type="text"
                placeholder="Search Vendors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 px-5 w-80 border-border rounded h-fit py-2"
              />
              <button
                className="flex justify-center items-center w-fit h-fit px-5 py-2 gap-3 bg-white border-neutral-300 border-2 cursor-pointer rounded"
                aria-label="Menu"
                onClick={displayFilterForm}
              >
                <img
                  className="mt-1 justify-center align-center"
                  src={filterIcon}
                  alt=""
                />
                Filter
              </button>
              <button
                className="flex justify-center bg-button text-white rounded border items-center w-fit h-fit px-6 py-2"
                onClick={openAddVendorForm}
              >
                Add Vendor
              </button>
            </div>
          </div>
          <VendorTable vendors={filteredVendors} />
        </div>
      </div>

      {/* Filter form */}
      {filterFormVisibility && (
        <form className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white z-50 p-8 flex flex-col w-fit h-fit gap-4">
          <div className="flex justify-between">
            <h2 className="font-semibold text-xl"> Select Filtering Option</h2>
            <button
              type="button"
              className="discard-btn"
              onClick={closeFilterForm}
            >
              <img src={close} alt="" />
            </button>
          </div>
          <label>Select Category</label>
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
          <label>Select Date:</label>
          <div className="flex gap-6">
            <input
              className="border-2  border-neutral-200 p-1.5 rounded-md w-[14.4vw]"
              type="date"
              placeholder=" from"
            />
            <input
              className="border-2 border-neutral-200 p-1.5 rounded-md w-[14.4vw]"
              type="date"
              placeholder="to"
            />
          </div>
        </form>
      )}

      {addFormVisibility && (
        <>
          <div className="bg-overlay h-screen w-screen absolute z-10"></div>
          <form
            onSubmit={handleSubmit}
            className="flex absolute z-20 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded"
          >
            <div className="flex justify-between">
              <p className="font-semibold text-lg">Add Vendor</p>
              <img
                className="rounded-md cursor-pointer p-3"
                src={close}
                alt="close"
                onClick={closeAddVendorForm}
              />
            </div>
            <div className="flex flex-col gap-10">
              {/* vendor name */}
              <div className="flex items-center gap-6">
                <label htmlFor="vendor_name" className="w-40 font-medium">
                  Name
                </label>
                <input
                  className="border-2 border-border p-1 pl-3 rounded-md"
                  type="text"
                  placeholder="Enter Vendor Name"
                  autoFocus
                  name="vendor_name"
                  id="vendor_name"
                  onChange={handleChange}
                />
              </div>
              {/* Vat number */}
              <div className="flex items-center gap-6">
                <label htmlFor="vat_number" className="w-40 font-medium">
                  VAT
                </label>
                <input
                  className="border-2 border-border p-1 pl-3 rounded-md"
                  type="text"
                  placeholder="Enter VAT Number"
                  name="vat_number"
                  id="vat_number"
                  onChange={handleChange}
                />
              </div>
              {/* Vendor contact number */}
              <div className="flex items-center gap-6">
                <label htmlFor="vendor_contact" className="w-40 font-medium">
                  Contact
                </label>
                <input
                  className="border-2 border-border p-1 pl-3 rounded-md"
                  type="text"
                  placeholder="Enter Contact Number"
                  name="vendor_contact"
                  id="vendor_contact"
                  onChange={handleChange}
                />
              </div>
              {/* Payment Duration */}
              <div className="flex items-center gap-6">
                <label htmlFor="payment_duration" className="w-40 font-medium">
                  Payment Duration
                </label>
                <input
                  className="border-2 border-border p-1 pl-3 rounded-md"
                  type="text"
                  placeholder="Enter Payment Duration"
                  name="payment_duration"
                  id="payment_duration"
                  onChange={handleChange}
                />
              </div>
              {/* Displaying error message */}
              {error && <span className="text-red-500">{error}</span>}

              <button className="bg-blue-600 text-white py-2 px-6 w-fit h-fit rounded-md flex self-end">
                Add vendor
              </button>
            </div>
          </form>
        </>
      )}

      {filterFormVisibility && (
        <form className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white z-50 p-8  flex flex-col w-fit h-fit gap-4">
          <div className="flex justify-between">
            <h2 className="font-semibold text-xl"> Select Filtering Option</h2>
            <button
              type="button"
              className="discard-btn"
              onClick={closeFilterForm}
            >
              <img src={close} alt="" />
            </button>
          </div>
          <label>Select Category</label>
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
          <label>Select Date:</label>
          <div className="flex gap-6">
            <input
              className="border-2  border-neutral-200 p-1.5 rounded-md w-[14.4vw]"
              type="date"
              placeholder=" from"
            />
            <input
              className="border-2 border-neutral-200 p-1.5 rounded-md w-[14.4vw]"
              type="date"
              placeholder="to"
            />
          </div>
        </form>
      )}
      {addFormVisibility && <div className="overlay-vendor"></div>}
      {filterFormVisibility && <div className="overlay-vendor"> </div>}
      <ToastContainer pauseOnHover theme="light" />
    </div>
  );
};

export default Vendor;
