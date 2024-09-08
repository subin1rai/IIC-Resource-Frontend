import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import VendorHistory from "../components/vendorHistory";
import front from "../assets/arrow-right.svg";
import close from "../assets/close.svg";
import CircularProgress from "@mui/material/CircularProgress";
import filter from "../assets/filter.svg";
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
    <div className="flex flex-col gap-3 items-center">
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
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            placeholder="Choose Category"
            className="react-select-container w-[14vw]"
            classNamePrefix="react-select"
          />

          {categories.length > 1 && (
            <button
              type="button"
              onClick={() => removeCategory(index)}
              className="bg-red-500 text-white px-2 py-1 rounded focus:outline-red-800"
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
      {categories.length === 0 && (
        <button
          type="button"
          onClick={addCategory}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Add Category
        </button>
      )}
    </div>
  );
};

const SpecificVendor = () => {
  const [vendor, setVendor] = useState({
    vendor_name: "",
    vat_number: "",
    vendor_contact: "",
    purchase_amount: "",
    last_purchase_date: "",
    last_paid: "",
    payment_duration: "",
    total_payment: "",
    pending_payment: "",
    next_payment_date: "",
    payment_status: "",
    vendorCategory: [],
    bills: [],
  });

  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo.token;
  const role = userInfo.user_role;

  const [loading, setLoading] = useState(false);
  const [editFormVisibility, setEditFormVisibility] = useState(false);
  const [itemCategoryOptions, setItemCategoryOptions] = useState([]);
  const [error, setError] = useState("");
  const [contactError, setContactError] = useState("");

  const [editedVendor, setEditedVendor] = useState({
    vendor_name: "",
    vat_number: "",
    vendor_contact: "",
    payment_duration: "",
    vendor_profile: "",
    vendorCategory: [],
  });

  const { vendor_id } = useParams();

  const nepaliMonthsInEnglish = [
    "Baisakh",
    "Jestha",
    "Ashadh",
    "Shrawan",
    "Bhadra",
    "Ashwin",
    "Kartik",
    "Mangsir",
    "Poush",
    "Magh",
    "Falgun",
    "Chaitra",
  ];

  function getNepaliMonth(dateString) {
    if (!dateString) {
      return "--";
    }
    const [datePart] = dateString?.split("T");
    const [year, month, day] = datePart.split("-");
    const monthIndex = parseInt(month, 10) - 1;
    return `${nepaliMonthsInEnglish[monthIndex]} ${day}, ${year}`;
  }

  const handleShowModal = (vendor_id) => {
    Swal.fire({
      title: "Are you sure you want to blacklist?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, do it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleBlackList(vendor_id);
        Swal.fire(
          "Blacklisted!",
          "This vendor has been blacklisted.",
          "success"
        );
      }
    });
  };

  const openVendorDetailsForm = () => {
    setEditedVendor({
      vendor_name: vendor.vendor_name,
      vat_number: vendor.vat_number,
      vendor_contact: vendor.vendor_contact,
      payment_duration: vendor.payment_duration,
      vendor_profile: vendor.vendor_profile,
      vendorCategory: vendor.vendorCategory || [],
    });
    setEditFormVisibility(true);
  };

  const closeVendorDetailsForm = () => {
    setError("");
    setEditFormVisibility(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedVendor({ ...editedVendor, [e.target.name]: e.target.value });
    if (name === "contact") {
      validateContact(value);
    }
  };

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateContact(editedVendor.vendor_contact)) {
      setError("Please correct the contact number.");
      return;
    }

    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/updateVendor/${vendor_id}`,
        editedVendor,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVendor({ ...vendor, ...response.data });
      closeVendorDetailsForm();
      Swal.fire("Success", "Vendor updated successfully", "success");
    } catch (error) {
      setError("Failed to update vendor. Please try again.");
    }
  };

  const handleBlackList = async () => {
    try {
      await axios.put(`${apiBaseUrl}/api/blacklist/${vendor_id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVendor((prevVendor) => ({
        ...prevVendor,
        black_list: true,
      }));
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to blacklist the vendor. Please try again.",
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchSingleVendor = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${apiBaseUrl}/api/vendor/${vendor_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVendor(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        setLoading(false);
      }
    };

    fetchSingleVendor();
  }, [vendor_id, token]);

  useEffect(() => {
    const fetchItemCategories = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/itemCategory`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const options = response.data.allData.map((category) => ({
          value: category.item_category_id,
          label: category.item_category_name,
        }));
        setItemCategoryOptions(options);
      } catch (error) {
        console.error("Error fetching item categories:", error);
      }
    };

    fetchItemCategories();
  }, [token]);

  const validateContact = (vendor_contact) => {
    const contactNumber = parseInt(vendor_contact);
    if (
      isNaN(contactNumber) ||
      contactNumber < 9700000000 ||
      contactNumber > 9899999999
    ) {
      setContactError(
        "Please enter a valid 10-digit contact number starting with 97 or 98."
      );
      return false;
    }
    setContactError("");
    return true;
  };

  return (
    <div className="flex bg-background justify-center h-screen w-screen relative">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto items-center">
        <Topbar />
        <div className="flex flex-col w-[85.5vw] bg-white rounded pb-9">
          <div className="flex justify-between items-end h-fit">
            <div className="flex flex-col">
              <div className="flex px-8 py-5 items-center gap-2">
                <Link to="/vendors">Vendor</Link>
                <img src={front} alt="" />
                <p className="text-blue-600 text-base">{vendor.vendor_name}</p>
              </div>
              <h3 className="text-2xl pl-8 font-semibold">
                {vendor.vendor_name}
              </h3>
            </div>
            <div className="flex gap-4 pr-10 items-end">
              <button
                className="bg-blue-700 h-fit w-fit p-2 px-4 text-white rounded"
                onClick={openVendorDetailsForm}
              >
                Edit Details
              </button>
              {role === "superadmin" &&
              (vendor.black_list === null || vendor.black_list === false) ? (
                <button
                  className="bg-red-500 h-fit w-fit p-2 px-4 text-white rounded"
                  onClick={() => handleShowModal(vendor_id)}
                >
                  Add to Blacklist
                </button>
              ) : null}
            </div>
          </div>
          <div className="h-1 bg-blue-700 w-[82vw] mt-5 mx-auto"></div>
          {!loading ? (
            <div className="flex justify-between mt-5 w-[75vw] ml-12">
              <div className="flex flex-col gap-5">
                <p className="font-medium">
                  VAT Number:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor.vat_number || "--"}
                  </span>
                </p>
                <p className="font-medium">
                  Payment Duration:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor.payment_duration || "--"}
                  </span>
                </p>
                <p className="font-medium">
                  Paid Amount:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor.bills && vendor.bills.length > 0
                      ? vendor.bills
                          .reduce(
                            (sum, bill) =>
                              sum + (Number(bill.paid_amount) || 0),
                            0
                          )
                          .toFixed(2)
                      : "--"}
                  </span>
                </p>
                <p className="font-medium">
                  Vendor Contact:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor.vendor_contact || "--"}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-5">
                <p className="font-medium">
                  Last Purchase Date:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {getNepaliMonth(vendor?.last_purchase_date) || "--"}
                  </span>
                </p>
                <p className="font-medium">
                  Purchase Amount:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor.total_amount
                      ? Number(vendor.total_amount).toFixed(2)
                      : "--"}
                  </span>
                </p>
                <p className="font-medium">
                  Last Paid Date:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {getNepaliMonth(vendor.last_paid) || "--"}
                  </span>
                </p>
                <p className="font-medium">
                  Payment Status:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor?.pending_payment > 0 ? (
                      <span className="text-yellow-600 bg-yellow-100 p-2 px-4 rounded-md">
                        Pending
                      </span>
                    ) : (
                      (
                        <span className="text-green-600 bg-green-100 p-2 px-4 rounded-md">
                          Clear
                        </span>
                      ) || "--"
                    )}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-5">
                <p className="font-medium">
                  Pending Payment:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor.pending_payment
                      ? Number(vendor?.pending_payment).toFixed(2)
                      : "--"}
                  </span>
                </p>
                <p className="font-medium">
                  Next Payment Date:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {getNepaliMonth(vendor?.next_payment_date) || "--"}
                  </span>
                </p>
                <p className="font-medium">
                  Categories:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor?.vendorCategory
                      .map((category) => category.item_category_name)
                      .join(", ") || "--"}
                  </span>
                </p>
                <p className="font-medium">
                  Profile:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor?.vendor_profile}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center mt-5">
              {" "}
              <CircularProgress />
            </p>
          )}
        </div>
        <div className="bg-white w-[99%] mx-auto flex flex-col p-5 rounded-md">
          <div className="flex justify-between mb-7">
            <h2 className="font-semibold px-4 text-2xl">Purchase History</h2>
            <div className="flex gap-5">
              <input
                type="text"
                placeholder="Search for history"
                className="border-2 border-border py-2 pl-3 rounded-md w-64"
              />
              <button className="bg-white border-border border-2 rounded-md p-1 px-4 py-2 flex justify-between items-center gap-3">
                <img src={filter} alt="filter" /> Filter
              </button>
            </div>
          </div>
          <VendorHistory history={vendor} />
        </div>
      </div>

      {editFormVisibility && (
        <>
          <div className="bg-overlay h-screen w-screen absolute z-10"></div>
          <form
            onSubmit={handleSubmit}
            className="flex absolute z-20 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded"
          >
            <div className="flex justify-between">
              <p className="font-semibold text-lg">Edit Vendor</p>
              <img
                className="rounded-md cursor-pointer h-4 w-4"
                src={close}
                alt="close"
                onClick={closeVendorDetailsForm}
              />
            </div>
            <div className="flex flex-col gap-7">
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
                  value={editedVendor.vendor_name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-6">
                <label htmlFor="vat_number" className="w-40 font-medium">
                  VAT
                </label>
                <input
                  className="border-2 rounded border-neutral-200 w-[14vw] p-2 focus:outline-slate-400"
                  type="text"
                  placeholder="Enter VAT Number"
                  name="vat_number"
                  id="vat_number"
                  value={editedVendor.vat_number}
                  onChange={handleChange}
                  maxLength={9}
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
                  value={editedVendor.vendor_profile}
                  onChange={handleChange}
                >
                  <option value="" disabled>
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
                  categories={editedVendor.vendorCategory}
                  setCategories={(newCategories) =>
                    setEditedVendor({
                      ...editedVendor,
                      vendorCategory: newCategories,
                    })
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
                  type="tel"
                  placeholder="Enter Contact Number"
                  name="vendor_contact"
                  id="vendor_contact"
                  value={editedVendor.vendor_contact}
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
                  value={editedVendor.payment_duration}
                  onChange={handleChange}
                />
              </div>
              {error && <span className="text-red-500">{error}</span>}
              <button
                type="submit"
                className="bg-blue-600 text-white py-3 px-4 w-full justify-center rounded-md focus: outline-blue-600 mb-1 mt-4"
              >
                Save Changes
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SpecificVendor;
