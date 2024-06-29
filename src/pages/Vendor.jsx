import "../styles/vendor.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import React, { useEffect, useState } from "react";
import "../styles/table.css";
import filterIcon from "../assets/filter.svg";
import validVendor from "../assets/user.svg";
import close from "../assets/close.svg";
import axios from "axios";
import VendorTable from "../components/VendorTable";
const Vendor = () => {
  const [vendor, setVendor] = useState({
    vendor_name: "",
    vendor_vat: "",
    vendor_contact: "",
    category: "",
  });

  const [addFormVisibility, setAddFormVisibility] = useState(false);

  const openAddVendorForm = () => {
    setAddFormVisibility(true);
  };

  const closeAddVendorForm = () => {
    setAddFormVisibility(false);
  };

  const handleChange = (e) => {
    setVendor((e.target.key = e.target.value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8898/api/addVendor",
        vendor
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="vendor">
      <Sidebar />
      <div className="vendor-main">
        <Topbar />
        <div className=" vendor-Summary">
          <h3 className="summary-title">Summary</h3>
          <div className="summary-container">
            <div className="summary">
              <img src={validVendor} alt="" />
              <h4>31</h4>
              <p>Number of Vendors</p>
            </div>
            <div className="summary">
              <img src={validVendor} alt="" />
              <h4>31</h4>
              <p>Whitelisted Vendors</p>
            </div>
            <div className="summary">
              <img src={validVendor} alt="" />
              <h4>31</h4>
              <p>Blacklisted Vendors</p>
            </div>
            <div className="summary">
              <img src={validVendor} alt="" />
              <h4>31</h4>
              <p>Payment Remaining</p>
            </div>
          </div>
        </div>

        <div className="up">
          <div className="top">
            <h3> Vendors </h3>
            <div className="right">
              <input type="text" placeholder="Search Items..." />
              <div className="category">
                <button>
                  {" "}
                  <img src={filterIcon} alt="" />
                  Category{" "}
                </button>
              </div>
              <div className="add">
                <button onClick={openAddVendorForm}> Add Vendor </button>
              </div>
            </div>
          </div>
          <VendorTable />
          {/* <div className="last">
            <div className="previous">
              <button>Previous </button>
            </div>
            <div className="middle">Page 1 of 10</div>
            <div className="next">
              <button> Next </button>
            </div>
          </div> */}
        </div>

        {addFormVisibility && (
          <form action="" onSubmit={handleSubmit} className="filter-form">
            <button
              type="button"
              className="discard-btn"
              onClick={closeAddVendorForm}
            >
              <img src={close} alt="" />
            </button>
            <p className="title">Add Item</p>
            <div className="field">
              <label htmlFor="item_name">Item Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                name="vendor_name"
                id="item_name"
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="category">Vendor Vat</label>
              <input type="text" name="vendor_vat" onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="measuring_unit">Contact</label>
              <input
                type="text"
                placeholder="Enter measuring unit"
                name="vendor_contact"
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="category"> Category</label>
              <select id="category" onChange={handleChange}>
                <option value="">Contact</option>
                <option value="Gadgets">Gadgets</option>
                <option value="Appliances">Appliances</option>
              </select>
            </div>
            <div className="buttons">
              <button type="submit" className="add-btn">
                Add Item
              </button>
            </div>
          </form>
        )}
      </div>

      {addFormVisibility && <div className="overlay"></div>}
    </div>
  );
};
export default Vendor;
