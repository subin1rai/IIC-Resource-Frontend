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

  const [editedVendor, setEditedVendor] = useState({
    vendor_name: "",
    vat_number: "",
    vendor_contact: "",
  });

  const [addFormVisibility, setVendorDetailsFormVisibility] = useState(false);

  const { vendor_id } = useParams();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const openVendorDetailsForm = () => {
    setEditedVendor({
      vendor_name: vendor.vendor_name,
      vat_number: vendor.vat_number,
      vendor_contact: vendor.vendor_contact,
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
        const response = await axios.get(
          `http://localhost:8898/api/vendor/${vendor_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVendor(response.data.VendorById);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchSingleVendor();
  }, [vendor_id]);

  console.log(vendor);
  return (
    <div className="flex bg-background justify-center h-screen w-screen relative">
      <Sidebar />

      <div className="flex flex-col gap-4 mx-auto  items-center">
        <Topbar />

        <div className="flex flex-col w-[85.5vw]  bg-white rounded pb-9">
          <div className="flex justify-between items-center h-fit ">
            <div className="flex flex-col">
              <div className="flex px-8 py-5 items-center">
                <p>vendor</p>
                <img src={front} alt="" />
                <p className="text-blue-600  text-base">{vendor.vendor_name}</p>
              </div>
              <h3 className="text-2xl pl-8 font-semibold">
                {vendor.vendor_name}
              </h3>
            </div>
            <div className="flex gap-4 pr-7 h-[100%] items-center">
              <button
                className="bg-blue-700 h-fit w-fit p-2 px-4 text-white rounded"
                onClick={openVendorDetailsForm}
              >
                {" "}
                Edit Details
              </button>
              <button
                className="bg-red-500 h-fit w-fit p-2 px-4 text-white rounded"
                onClick={handleBlackList}
              >
                Add to Balcklist
              </button>
            </div>
          </div>
          <div className="h-1 bg-blue-700 w-[82vw] mt-4 mx-auto"></div>

          <div className="flex justify-between px-10 mt-5">
            <div className="flex flex-col gap-5">
              <p className="font-semibold">
                VAT Number:{" "}
                <span className="font-medium pl-3">
                  {vendor.vat_number || "--"}
                </span>
              </p>
              <p className="font-semibold">
                payment Duration:{" "}
                <span className="font-medium pl-3">
                  {vendor.payment_duration || "--"}
                </span>
              </p>
              <p className="font-semibold">
                Paid Amount:{" "}
                <span className="font-medium pl-3">
                  {vendor.paid_amount || "--"}
                </span>
              </p>
              <p className="font-semibold">
                Vendor Contact:{" "}
                <span className="font-medium pl-3">
                  {vendor.vendor_contact || "--"}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <p className="font-semibold">
                Last Purchase Date:{" "}
                <span className="font-medium pl-3">
                  {formatDate(vendor.last_purchase_date) || "--"}
                </span>
              </p>
              <p className="font-semibold">
                Purchase Amount:{" "}
                <span className="font-medium pl-3">
                  {vendor.purchase_amount || "--"}
                </span>
              </p>
              <p className="font-semibold">
                Last Paid Date:{" "}
                <span className="font-medium pl-3">
                  {vendor.last_paid || "--"}
                </span>
              </p>
              <p className="font-semibold">
                Payment Status:{" "}
                <span className="font-medium pl-3">
                  {vendor.payment_status || "--"}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <p className="font-semibold">
                Total Payment:{" "}
                <span className="font-medium pl-3">
                  {vendor.total_payment || "--"}
                </span>
              </p>
              <p className="font-semibold">
                Pending Payment:{" "}
                <span className="font-medium pl-3">
                  {vendor.pending_payment || "--"}
                </span>
              </p>
              <p className="font-semibold">
                Next Payment Data:{" "}
                <span className="font-medium pl-3">
                  {vendor.next_payment_date || "--"}
                </span>
              </p>
            </div>
          </div>
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

      {addFormVisibility && (
        <>
          <div
            className="h-screen  w-screen bg-overlay absolute"
            onClick={closeVendorDetailsForm}
          ></div>

          <form
            onSubmit={handleSubmit}
            className="flex absolute z-30 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded "
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
              <label htmlFor="vendor_name">Vendor Name</label>
              <input
                className="w-72 border-2 rounded border-border pl-2 py-2"
                type="text"
                placeholder="Edit Vendor Name"
                name="vendor_name"
                id="vendor_name"
                onChange={handleChange}
                value={editedVendor.vendor_name}
              />
            </div>
            <div className="flex justify-between gap-10 items-center">
              <label htmlFor="vat_no">VAT Number</label>
              <input
                className="w-72 border-2 rounded border-border pl-2 py-2"
                type="text"
                placeholder="Edit VAT Number"
                name="vat_number"
                id="vat_no"
                onChange={handleChange}
                value={editedVendor.vat_number}
              />
            </div>
            <div className="flex justify-between gap-10 items-center">
              <label htmlFor="contact">Contact Number</label>
              <input
                className="w-72 border-2 rounded border-border pl-2 py-2"
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
                className="bg-blue-700 p-3 rounded text-white"
              >
                Save Changes
              </button>
            </div>
          </form>
        </>
      )}
    </div>

    // <div className="side">
    //   <Sidebar />
    //   <div className="top">
    //     <Topbar />
    //     <div className="container">
    //       <div className="vdetails">
    //         <>
    //           <div className="title">
    //             <h3>
    //               <Link to={"/vendors"}>Vendors</Link>
    //             </h3>
    //             <img src={front} alt=""></img> <p>{vendor.vendor_name}</p>
    //           </div>
    //           <div className="head">
    //             <h1>{vendor.vendor_name}</h1>
    //             <p>Contact: {vendor.vendor_contact}</p>
    //           </div>
    //           <hr className="line" />
    //           <div className="content">
    //             <div className="left">
    //               <p>VAT Number: {vendor.vat_number}</p>
    //               <p>Purchase Amount: {vendor.purchase_amount}</p>
    //               <p>
    //                 Last Purchase Date: {formatDate(vendor.last_purchase_date)}
    //               </p>
    //               <p>
    //                 Recent Purchase Date:{" "}
    //                 {formatDate(vendor.last_purchase_date)}
    //               </p>
    //               <p>Last Paid Date: {formatDate(vendor.last_paid_date)}</p>
    //               <p>Payment Duration: {vendor.payment_duration}</p>
    //             </div>
    //             <div className="right">
    //               <p>Total Payment: {vendor.total_payment}</p>
    //               <p>Pending Payment: {vendor.pending_payment}</p>
    //               <p>
    //                 Next Payment Date: {formatDate(vendor.next_payment_date)}
    //               </p>
    //               <p>
    //                 Payment Status:{" "}
    //                 {Number(vendor.pending_payment) > 0
    //                   ? "Pending"
    //                   : "completed"}
    //               </p>
    //             </div>
    //           </div>
    //         </>
    //         <div className="btn">
    //           <button onClick={openVendorDetailsForm} className="edit">
    //             Edit details
    //           </button>
    //           <button className="blacklist" onClick={handleBlackList}>
    //             Add to blacklist
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   {addFormVisibility && (
    //     <>
    //       <div className="overlay" onClick={closeVendorDetailsForm}></div>

    //       <form onSubmit={handleSubmit} className="vendordetailsform">
    //         <div className="toptitle">
    //           <p className="title2">Edit Details</p>
    //           <button
    //             type="button"
    //             className="close"
    //             onClick={closeVendorDetailsForm}
    //           >
    //             <img src={close} alt="close icon" />
    //           </button>
    //         </div>
    //         <div className="field">
    //           <label htmlFor="vendor_name">Vendor Name</label>
    //           <input
    //             type="text"
    //             placeholder="Edit Vendor Name"
    //             name="vendor_name"
    //             id="vendor_name"
    //             onChange={handleChange}
    //             value={editedVendor.vendor_name}
    //           />
    //         </div>
    //         <div className="field">
    //           <label htmlFor="vat_no">VAT Number</label>
    //           <input
    //             type="text"
    //             placeholder="Edit VAT Number"
    //             name="vat_number"
    //             id="vat_no"
    //             onChange={handleChange}
    //             value={editedVendor.vat_number}
    //           />
    //         </div>
    //         <div className="field">
    //           <label htmlFor="contact">Contact Number</label>
    //           <input
    //             type="text"
    //             placeholder="Edit Contact Number"
    //             name="vendor_contact"
    //             id="vendor_contact"
    //             onChange={handleChange}
    //             value={editedVendor.vendor_contact}
    //           />
    //         </div>
    //         <div className="btn">
    //           <button type="submit" className="save">
    //             Save Changes
    //           </button>
    //         </div>
    //       </form>
    //     </>
    //   )}
    // </div>
  );
};

export default SpecificVendor;
