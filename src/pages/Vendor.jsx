import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import React, { useEffect, useState } from "react";
import validVendor from "../assets/user.svg";
import filterIcon from "../assets/filter.svg";
import close from "../assets/close.svg";
import axios from "axios";
import VendorTable from "../components/VendorTable";
import { ToastContainer, toast } from "react-toastify";
import vendorno from "../assets/vendorcount.png";
import blacklist from "../assets/blacklist.png";
import exportIcon from "../assets/export.svg";

import Select from "react-select";

const CategoryFields = ({ categories, setCategories, itemCategoryOptions }) => {
  const addCategory = () => {
    if (categories.length < 5) {
      setCategories([...categories, ""]);
    }
  };

  const removeCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  const handleCategoryChange = (index, selectedOption) => {
    const newCategories = [...categories];
    newCategories[index] = selectedOption.value;
    setCategories(newCategories);
  };

  return (
    <div className="flex flex-col gap-3">
      {categories.map((category, index) => (
        <div key={index} className="flex items-center gap-2">
          <Select
            options={itemCategoryOptions}
            onChange={(selectedOption) =>
              handleCategoryChange(index, selectedOption)
            }
            value={itemCategoryOptions.find(
              (option) => option.value === category
            )}
            placeholder="Choose Category"
            className="react-select-container w-[14vw] "
            classNamePrefix="react-select"
          />
          {categories.length > 1 && (
            <button
              type="button"
              onClick={() => removeCategory(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              -
            </button>
          )}
          {index === categories.length - 1 && (
            <button
              type="button"
              onClick={addCategory}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              +
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const Vendor = () => {
  const [vendor, setVendor] = useState({
    vendor_name: "",
    vat_number: "",
    vendor_contact: "",
    vendor_profile: "",
    payment_duration: "",
    categories: [""],
  });

  const [error, setError] = useState("");
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [filterFormVisibility, setFilterFormVisibility] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [itemCategory, setItemCategory] = useState([]);
  const [blackListCount, setBlackListCount] = useState(0);

  const token = localStorage.getItem("token");

  const openAddVendorForm = () => {
    setAddFormVisibility(true);
  };

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

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const response = await axios.get(
          "http://localhost:8898/api/itemCategory",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Item Category Data:", response.data);
        setItemCategory(response.data.allData || []);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request Canceled", error.message);
          return;
        }
        console.error("Error fetching item categories:", error);
      }
    })();
    return () => {
      controller.abort();
    };
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const vendorData = {
        ...vendor,
        categories: JSON.stringify(vendor.categories),
      };
      const response = await axios.post(
        "http://localhost:8898/api/addVendor",
        vendorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVendors((prevVendors) => [...prevVendors, response.data.vendorData]);
      toast.success(`${vendor.vendor_name} Added Successfully!`);
      setAddFormVisibility(false);
      setVendor({
        vendor_name: "",
        vat_number: "",
        vendor_contact: "",
        payment_duration: "",
        vendor_profile: "",
        categories: [""],
      });
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.error || "An error occurred");
    }
  };

  const handleBillChange = (event) => {
    const value = event.target.value;
    console.log("Selected option:", value);
    setSelectedOption(value);
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8898/api/bill/exportVendor",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "Vendor.xlsx";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      console.log("File saved successfully!");
    } catch (error) {
      console.error("Error downloading the file:", error.message);
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

  const itemCategoryOptions = itemCategory.map((cat) => ({
    value: cat._id || cat.item_category_id,
    label: cat.name || cat.item_category_name,
  }));

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  return (
    <div className="bg-background flex justify-between h-screen w-screen relative">
      <Sidebar />
      <div className="mx-auto flex flex-col gap-4 items-center relative">
        <Topbar />
        <div className="flex flex-wrap w-[87vw] gap-4 justify-center">
          <div className="flex flex-col w-[85.5vw] bg-white rounded-lg p-3 gap-3">
            <h1 className="flex text-lg font-bold m-3">Vendor Summary</h1>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center gap-1">
                <img
                  src={vendorno}
                  alt="number of vendors"
                  className="h-8 w-8"
                />
                <h4>{vendors.length}</h4>
                <p className="font-medium">Number of Vendors</p>
              </div>
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
                className="border-2 px-3 w-80 border-border rounded h-fit py-2 focus:outline-slate-400"
              />
              {/* Filter */}
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

              {/* Export button */}
              <button
                className="flex border-2 h-fit py-2 border-green-300 px-6 font-regular text-green-500  w-fit justify-center items-center rounded gap-2"
                aria-label="Menu"
                onClick={handleExport}
              >
                <img src={exportIcon} alt="export icon" className="h-6 w-6 " />
                Export
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

      {filterFormVisibility && (
        <form className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white z-50 p-8 flex flex-col w-fit h-fit gap-4">
          <div className="flex justify-between">
            <h2 className="font-semibold text-xl">Select Filtering Option</h2>
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
              options={itemCategoryOptions}
              onChange={handleCategoryChange}
              value={selectedCategory}
              placeholder="Choose Item Category"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <label>Select Date:</label>
          <div className="flex gap-6">
            <input
              className="border-2 border-neutral-200 p-1.5 rounded-md w-[14.4vw]"
              type="date"
              placeholder="from"
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
                className="rounded-md cursor-pointer h-4 w-4 "
                src={close}
                alt="close"
                onClick={closeAddVendorForm}
              />
            </div>
            <div className="flex flex-col gap-10">
              <div className="flex items-center gap-6">
                <label htmlFor="vendor_name" className="w-40 font-medium">
                  Name
                </label>
                <input
                  className="border-2 rounded border-neutral-200 w-[14vw] p-2 focus:outline-slate-400"
                  type="text"
                  placeholder="Enter Vendor Name"
                  autoFocus
                  name="vendor_name"
                  id="vendor_name"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-6">
                <label htmlFor="vat_number" className="w-40 font-medium">
                  VAT
                </label>
                <input
                  className="border-2 rounded border-neutral-200 w-[14vw] p-2 focus:outline-slate-400 "
                  type="text"
                  placeholder="Enter VAT Number"
                  name="vat_number"
                  id="vat_number"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-6">
                <label htmlFor="vendor_profile" className="w-40 font-medium">
                  Vendor Profile
                </label>
                <select
                  className="border-2 rounded border-neutral-200 w-[14vw] p-2 focus:outline-slate-400"
                  name="vendor_profile"
                  id="vendor_profile"
                  onChange={handleChange}
                >
                  <option value="" disabled selected>
                    Select Vendor Profile
                  </option>
                  <option value="big">Big</option>
                  <option value="medium">Medium</option>
                  <option value="small">Small</option>
                </select>
              </div>
              <div className="flex items-center gap-6">
                <label className="w-40 font-medium self-start">
                  Categories
                </label>
                <CategoryFields
                  categories={vendor.categories}
                  setCategories={(newCategories) =>
                    setVendor({ ...vendor, categories: newCategories })
                  }
                  itemCategoryOptions={itemCategoryOptions}
                />
              </div>
              <div className="flex items-center gap-6">
                <label htmlFor="vendor_contact" className="w-40 font-medium">
                  Contact
                </label>
                <input
                  className="border-2 rounded border-neutral-200 w-[14vw] p-2 focus:outline-slate-400"
                  type="text"
                  placeholder="Enter Contact Number"
                  name="vendor_contact"
                  id="vendor_contact"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-6">
                <label htmlFor="payment_duration" className="w-40 font-medium">
                  Payment Duration
                </label>
                <input
                  className="border-2 rounded border-neutral-200 w-[14vw] p-2 focus:outline-slate-400"
                  type="text"
                  placeholder="Enter Payment Duration"
                  name="payment_duration"
                  id="payment_duration"
                  onChange={handleChange}
                />
              </div>
              {error && <span className="text-red-500">{error}</span>}
              <button className="bg-blue-600 text-white py-2 px-6 w-fit h-fit rounded-md flex self-end">
                Add vendor
              </button>
            </div>
          </form>
        </>
      )}

      {(addFormVisibility || filterFormVisibility) && (
        <div className="overlay-vendor"></div>
      )}
      <ToastContainer pauseOnHover theme="light" />
    </div>
  );
};

export default Vendor;
