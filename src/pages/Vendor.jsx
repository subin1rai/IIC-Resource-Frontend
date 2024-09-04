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
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { useSelector } from "react-redux";

const CategoryFields = ({ categories, setCategories, itemCategoryOptions }) => {
  const addCategory = () => {
    if (categories.length < 5) {
      setCategories([
        ...categories,
        { item_category_id: "", item_category_name: "" },
      ]);
    }
  };

  const removeCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  const handleCategoryChange = (index, selectedOption) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = {
      item_category_id: selectedOption.value,
      item_category_name: selectedOption.label,
    };
    setCategories(updatedCategories);
  };

  const getFilteredOptions = (index) => {
    const selectedCategoryIds = categories.map(
      (category) => category.item_category_id
    );
    return itemCategoryOptions.filter(
      (option) =>
        !selectedCategoryIds.includes(option.value) ||
        option.value === categories[index].item_category_id
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {categories.map((category, index) => (
        <div key={index} className="flex items-center gap-2">
          <Select
            options={getFilteredOptions(index)}
            onChange={(selectedOption) =>
              handleCategoryChange(index, selectedOption)
            }
            value={itemCategoryOptions.find(
              (option) => option.value === category.item_category_id
            )}
            placeholder="Choose Category"
            className="react-select-container w-[14vw]"
            classNamePrefix="react-select"
          />
          {categories.length > 1 && (
            <button
              type="button"
              onClick={() => removeCategory(index)}
              className="bg-red-500 text-white px-2 py-1 rounded focus: outline-red-800"
            >
              -
            </button>
          )}
          {index === categories.length - 1 && (
            <button
              type="button"
              onClick={addCategory}
              className="bg-blue-500 text-white px-2 py-1 rounded focus:outline-blue-800"
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
  const [contactError, setContactError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({
    item_category_id: "",
    item_category_name: "",
  });
  const [itemCategory, setItemCategory] = useState([]);
  const [blackListCount, setBlackListCount] = useState(0);

  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo.token;

  const [filterOptions, setFilterOptions] = useState({
    amountOption: "",
    durationOption: "",
    purchaseFrom: "",
    purchaseTo: "",
    TDS: "",
    payment_status: "",
  });

  console.log(vendors);

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
    const { name, value } = e.target;
    setVendor((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (name === "contact") {
      validateContact(value);
    }
  };

  const validateContact = (vendor_contact) => {
    const contactNumber = parseInt(vendor_contact);
    if (
      isNaN(contactNumber) ||
      contactNumber < 9700000000 ||
      contactNumber > 9899999999
    ) {
      setContactError(
        "Contact number must be between 9700000000 and 9899999999."
      );
      return false;
    }
    setContactError("");
    return true;
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "100%",
      border: state.isFocused ? "2px solid #94a3b8" : "2px solid #e5e5e5",
      minHeight: "42px",
      "&:hover": {
        border: state.isFocused ? "2px solid #94a3b8" : "2px solid #e5e5e5",
      },
      boxShadow: "none",
    }),
    menu: (provided) => ({
      ...provided,
      width: "100%",
    }),
    container: (provided) => ({
      ...provided,
      width: "250px",
    }),
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

    if (!validateContact(vendor.vendor_contact)) {
      setError("Please correct the contact number.");
      return;
    }
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
    const filterVendors = () => {
      const lowercasedTerm = searchTerm.toLowerCase();
      const newFilteredVendors = vendors.filter((vendor) =>
        vendor.vendor_name.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredVendors(newFilteredVendors);
    };
    filterVendors();
  }, [searchTerm, vendors]);

  // filter functionality
  const applyFilters = () => {
    let filteredResults = [...vendors];

    if (filterOptions.amountOption) {
      filteredResults.sort((a, b) => {
        if (filterOptions.amountOption === "low-to-high") {
          return a.total_amount - b.total_amount;
        } else if (filterOptions.amountOption === "high-to-low") {
          return b.total_amount - a.total_amount;
        }
        return 0;
      });
    }

    if (filterOptions.durationOption) {
      filteredResults.sort((a, b) => {
        if (filterOptions.durationOption === "low-to-high") {
          return a.payment_duration - b.payment_duration;
        } else if (filterOptions.durationOption === "high-to-low") {
          return b.payment_duration - a.payment_duration;
        }
        return 0;
      });
    }

    setFilteredVendors(filteredResults);
    setFilterFormVisibility(false);
  };

  console.log(filteredVendors);

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

      {/* filter form */}
      {filterFormVisibility && (
        <div className="bg-overlay absolute left-0 top-0 z-30 w-screen h-screen flex justify-center items-center">
          <form
            className="rounded-md bg-white z-50 p-8  flex flex-col w-fit h-fit gap-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex justify-between">
              <h2 className="font-semibold text-xl"> Filtering Option</h2>
              <button type="button" className="" onClick={closeFilterForm}>
                <img src={close} alt="" className="cursor-pointer w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {/*div for department and status  */}
              <div className="flex gap-8">
                {/* div for department */}
                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="font-medium">
                    Total Amount:
                  </label>
                  <select
                    name=""
                    id=""
                    className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                    value={filterOptions.amountOption}
                    onChange={(e) =>
                      setFilterOptions((prev) => ({
                        ...prev,
                        amountOption: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select an option</option>
                    <option value="high-to-low">High to low</option>
                    <option value="low-to-high">Low to high</option>
                  </select>
                </div>

                {/* div for request status */}
                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="font-medium">
                    {" "}
                    Payment Duration:{" "}
                  </label>
                  <select
                    name=""
                    id=""
                    className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                    value={filterOptions.durationOption}
                    onChange={(e) =>
                      setFilterOptions((prev) => ({
                        ...prev,
                        durationOption: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select an option</option>
                    <option value="high-to-low">High to low</option>
                    <option value="low-to-high">Low to high</option>
                  </select>
                </div>
              </div>

              {/* filter by requested date */}
              <div className="flex gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="font-medium">
                    Purchase From:
                  </label>

                  <NepaliDatePicker
                    inputClassName="form-control focus:outline-none"
                    className="border-2 border-neutral-300 p-2 w-[250px] pl-3 rounded-md focus:outline-slate-400"
                    // onChange={handleDateChange}
                    options={{ calenderLocale: "en", valueLocale: "en" }}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="font-medium">
                    Purchase To:
                  </label>
                  <NepaliDatePicker
                    inputClassName="form-control focus:outline-none"
                    className="border-2 border-neutral-300 p-2 w-[250px] pl-3 rounded-md focus:outline-slate-400"
                    // onChange={handleDateChange}
                    options={{ calenderLocale: "en", valueLocale: "en" }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-8">
              {/* div for department */}
              <div className="flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  TDS:{" "}
                </label>
                <select
                  name=""
                  id=""
                  className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                >
                  <option value="">Select an option</option>

                  <option value="">High to low</option>
                  <option value="">Low to high</option>
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  Payment Status:{" "}
                </label>
                <select
                  name=""
                  id=""
                  className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                >
                  <option value="">Select an option</option>
                  <option value="">Pending</option>
                  <option value="">Paid</option>
                </select>
              </div>

              {/* div for request status */}
            </div>

            <div className="flex gap-8">
              {/* div for department */}
              <div className="flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  {" "}
                  Status:{" "}
                </label>
                <select
                  name=""
                  id=""
                  className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                >
                  <option value="">Select status</option>
                  <option value="">Blacklisted</option>
                  <option value="">Whitelisted</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  Category:
                </label>
                <Select
                  options={itemCategoryOptions}
                  onChange={(selectedOption) =>
                    handleCategoryChange(selectedOption, { name: "category" })
                  }
                  value={itemCategoryOptions.find(
                    (option) => option.value === vendor.category
                  )}
                  placeholder="Choose Category"
                  styles={{
                    ...customStyles,
                    menuPortal: (provided) => ({
                      ...provided,
                      zIndex: 99,
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      maxHeight: 170, // Adjust this as needed
                      overflowY: "auto", // This ensures only the menu list scrolls
                    }),
                  }}
                  menuPortalTarget={document.body}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
            </div>
            <button
              className="flex bg-blue-600 text-white rounded p-3 items-center justify-center mt-3 text-lg font-medium"
              onClick={applyFilters}
            >
              Filter
            </button>
          </form>
        </div>
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
                  maxLength={9}
                  min="0"
                  max="999999999"
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
                  type="number"
                  placeholder="Enter Contact Number"
                  name="vendor_contact"
                  id="vendor_contact"
                  onChange={handleChange}
                  maxLength={10} // Limit input to 10 characters
                  pattern="[0-9]*"
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
              <button className="bg-blue-600 text-white py-3 px-4 w-full justify-center rounded-md focus: outline-blue-600">
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
