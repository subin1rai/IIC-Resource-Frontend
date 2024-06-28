import "../styles/vendor.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import React, { useEffect, useState } from "react";
import "../styles/table.css";
import filterIcon from "../assets/filter.svg";
import validVendor from "../assets/user.svg";
import close from "../assets/close.svg";
import axios from "axios";
const Vendor = () => {
  const [data, setData] = useState([
    {
      name: "Richard Martin",
      vat: "7687764556",
      contact: "7687764556",
      amount: 20000,
      date: "6/25/2024",
      duration: "15 days",
      status: "Complete",
    },
    {
      name: "Tom Homan",
      vat: "9867545368",
      contact: "9867545368",
      amount: 20000,
      date: "6/25/2024",
      duration: "15 days",
      status: "Complete",
    },
    {
      name: "Veandir",
      vat: "9867545566",
      contact: "9867545566",
      amount: 20000,
      date: "6/25/2024",
      duration: "15 days",
      status: "Complete",
    },
    {
      name: "Charin",
      vat: "9267545457",
      contact: "9267545457",
      amount: 20000,
      date: "6/25/2024",
      duration: "15 days",
      status: "Complete",
    },
    {
      name: "Hoffman",
      vat: "9367546531",
      contact: "9367546531",
      amount: 20000,
      date: "6/25/2024",
      duration: "15 days",
      status: "Complete",
    },
    {
      name: "Fainden Juke",
      vat: "9667545982",
      contact: "9667545982",
      amount: 20000,
      date: "6/25/2024",
      duration: "15 days",
      status: "Pending",
    },
    {
      name: "Martin",
      vat: "9867545457",
      contact: "9867545457",
      amount: 20000,
      date: "6/25/2024",
      duration: "15 days",
      status: "Complete",
    },
    {
      name: "Joe Nike",
      vat: "9567545769",
      contact: "9567545769",
      amount: 20000,
      date: "6/25/2024",
      duration: "15 days",
      status: "Complete",
    },
    {
      name: "Dender Luke",
      vat: "9667545980",
      contact: "9667545980",
      amount: 20000,
      date: "6/25/2024",
      duration: "15 days",
      status: "Pending",
    },
    {
      name: "Martin",
      vat: "9867545457",
      contact: "9867545457",
      amount: 20000,
      date: "6/25/2024",
      duration: "15 days",
      status: "Complete",
    },
  ]);

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
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>VAT No</th>
                <th>Contact Number</th>
                <th>Purchase Amount</th>
                <th>Recent Purchase</th>
                <th>Payment Duration</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((vendor, index) => (
                <tr key={index}>
                  <td>{vendor.name}</td>
                  <td>{vendor.vat}</td>
                  <td>{vendor.contact}</td>
                  <td>{vendor.amount}</td>
                  <td>{vendor.date}</td>
                  <td>{vendor.duration}</td>
                  <td
                    className={
                      vendor.status === "Complete" ? "complete" : "pending"
                    }
                  >
                    {vendor.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="last">
            <div className="previous">
              <button>Previous </button>
            </div>
            <div className="middle">Page 1 of 10</div>
            <div className="next">
              <button> Next </button>
            </div>
          </div>
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
