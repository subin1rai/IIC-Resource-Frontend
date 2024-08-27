import * as React from "react";
import front from "../assets/arrow-right.svg";
import close from "../assets/close.svg";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import filter from "../assets/filter.svg";
import VendorHistory from "../components/vendorHistory";
import Swal from "sweetalert2";

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
  });

  const role = localStorage.getItem("role");

  const [loading, setLoading] = useState(false);
  const [dialogboxVisibilty, setDialogboxVisibility] = useState(false);
  const [itemCategory, setItemCategory] = useState([]);
  const [itemCategoryOptions, setItemCategoryOptions] = useState([]);



  const [editedVendor, setEditedVendor] = useState({
    vendor_name: "",
    vat_number: "",
    vendor_contact: "",
    payment_duration: "",
    vendor_profile: "",
  });

  const [addFormVisibility, setVendorDetailsFormVisibility] = useState(false);

  const { vendor_id } = useParams();

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
    });
    setVendorDetailsFormVisibility(true);
  };

  const closeVendorDetailsForm = () => {
    setVendorDetailsFormVisibility(false);
  };

  const handleChange = (e) => {
    setEditedVendor({ ...editedVendor, [e.target.name]: e.target.value });
  };
  const token = localStorage.getItem("token");
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:8898/api/updateVendor/${vendor_id}`,
        editedVendor,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVendor({ ...vendor, ...editedVendor });
      closeVendorDetailsForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlackList = async () => {
    try {
      await axios.put(`http://localhost:8898/api/blacklist/${vendor_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // You might want to update the vendor state or show a message here
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchSingleVendor = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8898/api/vendor/${vendor_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setVendor(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchSingleVendor();
  }, [vendor_id]);

  return (
    <div className="flex bg-background justify-center h-screen w-screen relative">
      <Sidebar />

      <div className="flex flex-col gap-4 mx-auto  items-center">
        <Topbar />

        <div className="flex flex-col w-[85.5vw]  bg-white rounded pb-9">
          <div className="flex justify-between items-end h-fit ">
            <div className="flex flex-col">
              <div className="flex px-8 py-5 items-center gap-2">
                <Link to="/vendors">Vendor</Link>
                <img src={front} alt="" />
                <p className="text-blue-600  text-base">{vendor.vendor_name}</p>
              </div>
              <h3 className="text-2xl pl-8 font-semibold">
                {vendor.vendor_name}
              </h3>
            </div>
            <div className="flex gap-4 pr-10 items-end  ">
              <button
                className="bg-blue-700 h-fit w-fit p-2 px-4 text-white rounded"
                onClick={openVendorDetailsForm}
              >
                Edit Details
              </button>
              {role === "superadmin" ? (
                <button
                  className="bg-red-500 h-fit w-fit p-2 px-4 text-white rounded"
                  onClick={() => handleShowModal(vendor_id)}
                >
                  Add to Blacklist
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="h-1 bg-blue-700 w-[82vw] mt-5 mx-auto"></div>
          {!loading ? (
            <div className="flex justify-between mt-5 w-[75vw] ml-12">
              <div className="flex flex-col gap-5">
                <p className="font-medium ">
                  VAT Number:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor.vat_number || "--"}
                  </span>
                </p>
                <p className="font-medium ">
                  Payment Duration:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor.payment_duration || "--"}
                  </span>
                </p>
                <p className="font-medium ">
                  Paid Amount:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {Array.isArray(vendor?.bills) && vendor.bills.length > 0
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
                <p className="font-medium ">
                  Vendor Contact:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor.vendor_contact || "--"}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-5">
                <p className="font-medium ">
                  Last Purchase Date:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {formatDate(vendor.last_purchase_date)}
                  </span>
                </p>
                <p className="font-medium ">
                  Purchase Amount:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor.total_amount
                      ? Number(vendor.total_amount).toFixed(2)
                      : "--"}
                  </span>
                </p>
                <p className="font-medium ">
                  Last Paid Date:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {formatDate(vendor.last_paid)}
                  </span>
                </p>
                <p className="font-medium ">
                  Payment Status:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor.pending_payment > 0 ? "Pending" : "Clear"}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-5">
                <p className="font-medium ">
                  Pending Payment:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {vendor.pending_payment
                      ? Number(vendor.pending_payment).toFixed(2)
                      : "--"}
                  </span>
                </p>
                <p className="font-medium ">
                  Next Payment Date:{" "}
                  <span className="font-medium pl-3 text-[#6D6E70]">
                    {formatDate(vendor.next_payment_date)}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            "loading..."
          )}
        </div>
        <div className="bg-white w-[99%] mx-auto flex flex-col p-5 rounded-md ">
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

      {dialogboxVisibilty && (
        <>
          <div
            className="h-screen w-screen bg-overlay absolute z-20"
            onClick={() => setDialogboxVisibility(false)}
          >
            <div className="bg-white flex absolute top-1/2  left-1/2 items-center transform -translate-x-1/2 -translate-y-1/2 p-9 rounded">
              <p></p>
            </div>
          </div>
        </>
      )}
      {addFormVisibility && (
        <>
          <div
            className="h-screen  w-screen bg-overlay absolute z-20"
            onClick={closeVendorDetailsForm}
          ></div>

          <form
            onSubmit={handleSubmit}
            className="flex absolute z-30 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7  rounded "
          >
            <div className="flex justify-between">
              <p className="font-semibold text-2xl">Edit Details</p>
              <button
                type="button"
                className="w-8 h-8"
                onClick={closeVendorDetailsForm}
              >
                <img src={close} alt="close icon" className="w-4 h-4 " />
              </button>
            </div>
            <div className="flex justify-between gap-10 items-center">
              <label htmlFor="vendor_name" className="font-medium">
                Vendor Name
              </label>
              <input
                className="w-72 border-2 rounded border-border pl-2 h-fit py-2 focus:outline-slate-400"
                type="text"
                placeholder="Edit Vendor Name"
                name="vendor_name"
                id="vendor_name"
                onChange={handleChange}
                value={editedVendor.vendor_name}
              />
            </div>
            <div className="flex justify-between gap-10 items-center">
              <label htmlFor="vat_no" className="font-medium">
                VAT Number
              </label>
              <input
                className="w-72 border-2 rounded border-border pl-2 h-fit py-2 focus:outline-slate-400"
                type="text"
                placeholder="Edit VAT Number"
                name="vat_number"
                id="vat_no"
                onChange={handleChange}
                value={editedVendor.vat_number}
              />
            </div>
            {/* vendor profile */}
            <div className="flex items-center gap-6">
              <label htmlFor="vendor_profile" className="w-40 font-medium">
                Vendor Profile
              </label>
              <select
                className="border-2 rounded border-border w-72 p-2 focus:outline-slate-400"
                name="vendor_profile"
                id="vendor_profile"
                value={editedVendor.vendor_profile}
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
            {/* payment duration */}
            <div className="flex items-center gap-6">
              <label htmlFor="payment_duration" className="w-40 font-medium">
                Payment Duration
              </label>
              <input
                className="border-2 rounded border-neutral-200 w-72 p-2 focus:outline-slate-400"
                type="text"
                placeholder="Enter Payment Duration"
                name="payment_duration"
                id="payment_duration"
                onChange={handleChange}
                value={editedVendor.payment_duration}
              />
            </div>
            {/* Contact Number */}
            <div className="flex justify-between gap-10 items-center">
              <label htmlFor="contact" className="font-medium">
                Contact Number
              </label>
              <input
                className="w-72 border-2 rounded border-border pl-2 h-fit py-2 focus:outline-slate-400"
                type="text"
                placeholder="Edit Contact Number"
                name="vendor_contact"
                id="vendor_contact"
                onChange={handleChange}
                value={editedVendor.vendor_contact}
              />
            </div>
            <div className="flex justify-end  ">
              <button
                type="submit"
                className="bg-blue-700 p-2 px-5 rounded text-white"
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
