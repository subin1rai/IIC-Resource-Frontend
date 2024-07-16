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
    return date.toISOString().split("T")[0]; // This will give you YYYY-MM-DD
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
  const token = localStorage.getVendor("token");
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
      await axios.put(`http://localhost:8898/api/blacklist/${vendor_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } 
      );
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
                  <Link to={"/vendors"}>Vendors</Link>
                </h3>
                <img src={front} alt=""></img> <p>{vendor.vendor_name}</p>
              </div>
              <div className="head">
                <h1>{vendor.vendor_name}</h1>
                <p>Contact: {vendor.vendor_contact}</p>
              </div>
              <hr className="line" />
              <div className="content">
                <div className="left">
                  <p>VAT Number: {vendor.vat_number}</p>
                  <p>Purchase Amount: {vendor.purchase_amount}</p>
                  <p>
                    Last Purchase Date: {formatDate(vendor.last_purchase_date)}
                  </p>
                  <p>
                    Recent Purchase Date:{" "}
                    {formatDate(vendor.last_purchase_date)}
                  </p>
                  <p>Last Paid Date: {formatDate(vendor.last_paid_date)}</p>
                  <p>Payment Duration: {vendor.payment_duration}</p>
                </div>
                <div className="right">
                  <p>Total Payment: {vendor.total_payment}</p>
                  <p>Pending Payment: {vendor.pending_payment}</p>
                  <p>
                    Next Payment Date: {formatDate(vendor.next_payment_date)}
                  </p>
                  <p>
                    Payment Status:{" "}
                    {Number(vendor.pending_payment) > 0
                      ? "Pending"
                      : "completed"}
                  </p>
                </div>
              </div>
            </>
            <div className="btn">
              <button onClick={openVendorDetailsForm} className="edit">
                Edit details
              </button>
              <button className="blacklist" onClick={handleBlackList}>
                Add to blacklist
              </button>
            </div>
          </div>
        </div>
      </div>
      {addFormVisibility && (
        <>
          <div className="overlay" onClick={closeVendorDetailsForm}></div>

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
                value={editedVendor.vendor_name}
              />
            </div>
            <div className="field">
              <label htmlFor="vat_no">VAT Number</label>
              <input
                type="text"
                placeholder="Edit VAT Number"
                name="vat_number"
                id="vat_no"
                onChange={handleChange}
                value={editedVendor.vat_number}
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
                value={editedVendor.vendor_contact}
              />
            </div>
            <div className="btn">
              <button type="submit" className="save">
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
