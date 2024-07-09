import * as React from "react";
import front from "../assets/arrow-right.svg";
import close from "../assets/close.svg";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/specificVendor.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const SpecificVendor = () => {
  const [vendor, setVendor] = useState({
    vendor_name: "",
    vendor_vat: "",
    vendor_contact: "",
  });

  const [addFormVisibility, setVendorDetailsFormVisibility] = useState(false);

  const openVendorDetailsForm = () => {
    setVendorDetailsFormVisibility(true);
  };

  const closeVendorDetailsForm = () => {
    setVendorDetailsFormVisibility(false);
  };

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8898/api/editVendor", vendor);
      closeVendorDetailsForm(); // Close the form after successful submission
    } catch (error) {
      console.log(error);
    }
  };

  const { vendor_id } = useParams();

  useEffect(() => {
    const fetchSingleVendor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8898/api/vendor/${vendor_id}`
        );
        setVendor(response.data.VendorById);
        console.log(vendor);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchSingleVendor();
  }, [vendor_id]);

  return (
    <div className="side">
      <Sidebar />
      <div className="top">
        <Topbar />
        <div className="container">
          <div className="vdetails">
            <>
              <div className="title">
                <h3>
                  {" "}
                  <Link to={"/vendors"}>Vendors</Link>{" "}
                </h3>{" "}
                <img src={front} alt=""></img> <p>{vendor.vendor_name}</p>
              </div>
              <div className="head">
                <h1>{vendor.vendor_name}</h1>
                <p>Contact:{vendor.vendor_contact} </p>
              </div>
              <hr className="line" />
              <div className="content">
                <div className="left">
                  <p> VAT Number: {vendor.vat_number}</p>
                  <p> Purchase Amount: {vendor.purchase_amount}</p>
                  <p> Last Purchase Date: {vendor.last_purchase_date}</p>
                  <p> Recent Purchase Date:{vendor.last_purchase_date} </p>
                  <p> Last Paid Date: {vendor.last_paid} </p>
                  <p> Payment Duration: {vendor.payment_duration}</p>
                </div>
                <div className="right">
                  <p> Total Payment: {vendor.total_payment} </p>
                  <p> Pending Payment: {vendor.pending_payment} </p>
                  <p> Next Payment Date: {vendor.next_payment_date}</p>
                  <p> Payment Status: </p>
                </div>
              </div>
            </>
            <div className="btn">
              <button onClick={openVendorDetailsForm} className="edit">
                Edit details
              </button>
              <button className="blacklist"> Add to blacklist </button>
            </div>
          </div>
        </div>
      </div>
      {addFormVisibility && (
        <>
          <div className="overlay" onClick={closeVendorDetailsForm}>
            {" "}
          </div>

          <form onSubmit={handleSubmit} className="vendordetailsform">
            <div className="toptitle">
              <p className="title2">Edit Details</p>
              <button
                type="button"
                className="close"
                onClick={closeVendorDetailsForm}
              >
                <img src={close} alt="close icon" />
              </button>
            </div>
            <div className="field">
              <label htmlFor="vendor_name">Vendor Name</label>
              <input
                type="text"
                placeholder="Edit Vendor Name"
                name="vendor_name"
                id="vendor_name"
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="vat_no"> VAT Number</label>
              <input
                type="text"
                placeholder="Edit VAT Number"
                name="vat_no"
                id="vat_no"
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="contact">Contact Number</label>
              <input
                type="text"
                placeholder="Edit Contact Number"
                name="vendor_contact"
                id="vendor_contact"
                onChange={handleChange}
              />
            </div>
            <div className="btn">
              <button type="submit" className="save">
                Save Edit
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
export default SpecificVendor;
