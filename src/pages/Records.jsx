import * as React from "react";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/records.css";
import RecordsTable from "../components/RecordsTable";
import filterIcon from "../assets/filter.svg";
import { Link } from "react-router-dom";
import axios from "axios";

const Bill = () => {
    const [Bill, setBill] = useState({
      bill_no: "",
      bill_date: "",
      vendor_no: "",
      vendor: "",
      item_name: "",
      unit_price: "",
      quantity: "",
      bill_amt : "",
      tds: "",
      actual_amt: "",
      paid_amt: "",
    });
  
    const [addFormVisibility, setAddFormVisibility] = useState(false);
  
    const openAddBillForm = () => {
      setAddFormVisibility(true);
    };
  
    const closeAddBillForm = () => {
      setAddFormVisibility(false);
    };
  
    const handleChange = (e) => {
      setBill((e.target.key = e.target.value));
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await axios.post(
          "http://localhost:8898/api/addBill",
          bill
        );
      } catch (error) {
        console.log(error);
      }
    };

    return(
        <div className="records">
            <Sidebar />
        <div className="records-main">
            <Topbar />  
          <div className="records-container">
            <div className="top">
            <div className="container-title">
              <p>Bill Records</p>
            </div>
              <button className="filter-btn" aria-label="Menu">
                <img src={filterIcon} alt="" />
                Filter
              </button>
              <button className="add-btn">
                Add Bill
              </button>
              </div>
          <RecordsTable />
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
            <p className="title">Add Bill Details</p>
            <div className="field">
              <label htmlFor="bill_no">Bill No</label>
              <input
                type="text"
                placeholder="Enter bill Number"
                name="bill_no"
                id="bill_no"
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="bill_date">Bill Date</label>
              <input type="text" placeholder ="Enter bill date" name="bill_date" onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="voucher_no"> Voucher Name</label>
              <input
                type="text"
                placeholder="Enter Voucher number"
                name="vendor_contact"
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="vendor"> Vendor </label>
              <select id="vendor_category" onChange={handleChange}>
                <option value="">Choose Vendor</option>
                <option value="Lizan Suppliers"> Lizan Suppliers</option>
                <option value="Lenisha Suppliers">Lenisha Suppliers</option>
                <option value="Aneer Suppliers">Aneer Suppliers</option>
                <option value="Subin Suppliers">Subin Suppliers</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="item_name"> Item Name </label>
              <select id="item_name" onChange={handleChange}>
                <option value="">Choose Item</option>
                <option value="pen"> Pen </option>
                <option value=" bag">Bag</option>
                <option value=" copy">Copy</option>
                <option value="chair">Chair</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="unit price">Unit Price</label>
              <input type="text" placeholder ="Enter unit price" name="unit_price" onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="quantity"> Quantity</label>
              <input
                type="text"
                placeholder="Enter quantity"
                name="quantity"
                onChange={handleChange}
            />
            </div>
            <div className="field">
              <label htmlFor="bill_amt">Bill Amount</label>
              <input type="text" placeholder ="Enter bill amount" name="bill_amt" onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="tds"> Tax Deducted Source(TDS)</label>
              <input
                type="text"
                placeholder="Enter TDS"
                name="tds"
                onChange={handleChange}
                />
                </div>
                <div className="field">
              <label htmlFor="actual_amt">Actual Amount</label>
              <input type="text" placeholder ="Enter total bill amount" name="actual_amt" onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="paid_amt"> Paid Amount</label>
              <input
                type="text"
                placeholder="Enter paid amount"
                name="paid_amt"
                onChange={handleChange}
                />
                </div>
                <div className="right">
                <h2> Summary </h2>
            <div className="buttons">
              <button type="submit" className="add-btn">
                Add Item
              </button>
            </div>
            </div>
          </form>
        )}
       </div>
       {addFormVisibility && <div className="overlay"></div>}
       </div>
    );
}
export default Bill;