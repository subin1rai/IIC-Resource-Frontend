import * as React from "react";
import front from "../assets/arrow-right.svg";
import close from "../assets/close.svg";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/specificVendor.css";
import { useEffect, useState } from "react";


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

    return(
        <div className="side">
            <Sidebar />
            <div className="top">
            <Topbar />
            <div className="container">
                <div className="vdetails">
            <>
            <div className="title">
            <h3> Vendors </h3> <img src={front} alt=""></img> <p> Lizan Suppliers</p>
            </div>
            <div className="head">
                    <h1>Lizan Suppliers</h1>
                    <p>Contact: </p>
                </div>
                <hr className="line" />
                <div className="content">
                    <div className="left">
                        <p> VAT Number:  </p>
                        <p> Purchase Amount: </p>
                        <p> Last Purchase Date:</p>
                        <p> Recent Purchase Date:</p>
                        <p> Last Paid Date: </p>
                        <p> Payment Duration: </p>
                        </div>
                        <div className="right">
                        <p> TDS: </p>
                        <p> Total Payment: </p>
                        <p> Pending Payment: </p>
                        <p> Next Payment Date: </p>
                        <p> Payment Status: </p>
                        </div>
                    </div></>
                    <div className="btn">
                            <button  onClick = {openVendorDetailsForm} className= "edit">Edit details</button>
                            <button className="blacklist" > Add to blacklist </button>
                    </div>
        </div>
            </div>
            </div>
            {addFormVisibility && (
                <>
               <div className="overlay"> </div>

            <form onSubmit={handleSubmit} className="vendordetailsform">
            <div className="toptitle">
          <p className="title2">Edit Details</p>
          <button
            type="button"
            className="close"
            onClick={closeVendorDetailsForm}>
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