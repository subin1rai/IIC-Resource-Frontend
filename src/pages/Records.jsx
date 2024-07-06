import * as React from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/records.css";
import close from "../assets/close.svg";
import RecordsTable from "../components/RecordsTable";
import filterIcon from "../assets/filter.svg";
import axios from "axios";
import { BsDisplay } from "react-icons/bs";

const Bill = () => {
  const [bill, setBill] = useState({
    bill_no: "",
    bill_date: "",
    vendor_no: "",
    vendor: "",
    item_name: "",
    unit_price: "",
    quantity: "",
    bill_amt: "",
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
    setBill({ ...bill, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8898/api/addBill", bill);
      closeAddBillForm(); // Close the form after successful submission
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
              <img src={filterIcon} alt="filter icon" />
              Filter
            </button>
            <button onClick={openAddBillForm} className="add-btn">
              Add Bill
            </button>
          </div>
          <RecordsTable />
        </div>
      </div>
      {addFormVisibility && (
        <>
          <div className="overlay"></div>
       
          <form onSubmit={handleSubmit} className="addform">
          <div className="forms">
            <div className="left">
            <button type="button" className="closebtn" onClick={closeAddBillForm}>
              <img src={close} alt="close icon" />
            </button>
            <p className="title">Add Bill Details</p>
            <div className="double">
            <div className="for">
              <label htmlFor="bill_no">Bill No:</label>
              <input
                type="text"
                placeholder="Enter bill number"
                name="bill_no"
                id="bill_no"
                onChange={handleChange}
              />
            </div>
            <div className="for">
              <label htmlFor="bill_date">Bill Date:</label>
              <input type="date" placeholder="Enter bill date" name="bill_date" id="bill_date" onChange={handleChange} />
            </div>
            </div>
            <div className="single">
            <div className="for">
              <label htmlFor="voucher_no">Voucher No:</label>
              <input
                type="text"
                placeholder="Enter voucher number"
                name="voucher_no"
                id="voucher_no"
                onChange={handleChange}
              />
            </div>
            </div>
            <div className="single">
            <div className="for">
              <label htmlFor="vendor">Vendor:</label>
              <select id="vendor" name="vendor" onChange={handleChange}>
                <option value="">Select Vendor</option>
                <option value="Lizan Suppliers">Lizan Suppliers</option>
                <option value="Lenisha Suppliers">Lenisha Suppliers</option>
                <option value="Aneer Suppliers">Aneer Suppliers</option>
                <option value="Subin Suppliers">Subin Suppliers</option>
              </select>
              </div>
              </div>
              <div className="single">
              <div className="for">
              <label htmlFor="item_name">Item Name:</label>
              <select id="item_name" name="item_name" onChange={handleChange}>
                <option value="">Select Item</option>
                <option value="pen">Pen</option>
                <option value="bag">Bag</option>
                <option value="copy">Copy</option>
                <option value="chair">Chair</option>
              </select>
              </div>
            </div>
            <div className="double">
            <div className="for">
              <label htmlFor="unit_price">Unit Price:</label>    
              <input type="text" placeholder="Enter unit price" name="unit_price" id="unit_price" onChange={handleChange} />
              </div>
            <div className="for">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="text"
                placeholder="Enter quantity"
                name="quantity"
                id="quantity"
                onChange={handleChange}
              />
            </div>
            </div>
            <div className="double">
            <div className="for">
              <label htmlFor="bill_amt">Bill Amount:</label>
             
              <input type="text" placeholder="Enter bill amount" name="bill_amt" id="bill_amt" onChange={handleChange} />
              </div>
              <div className="for">
              <label htmlFor="tds">Tax Deducted Source (TDS):</label>
          
              <input
                type="text"
                placeholder="Enter TDS"
                name="tds"
                id="tds"
                onChange={handleChange}
              />
            </div>
            </div>
            <div className="line">
              <div className="double">
            <div className="for">
              <label htmlFor="actual_amt">Actual Amount:</label>
          
              <input type="text" placeholder="Enter actual amount" name="actual_amt" id="actual_amt" onChange={handleChange} />
              </div>
              <div className="for">
              <label htmlFor="paid_amt">Paid Amount:</label>
            
              <input
                type="text"
                placeholder="Enter paid amount"
                name="paid_amt"
                id="paid_amt"
                onChange={handleChange}
              />

            </div>
            </div>
            </div>
            </div>
            <div className="summary">
            <div className="right">
              <h2>Summary</h2>
              <p>Bill No: {bill.bill_no}</p>
              <p>Bill Date: {bill.bill_date}</p>
              <p>Vendor: {bill.vendor}</p>
              <p>Item Name: {bill.item_name}</p>
              <p>Unit Price: {bill.unit_price}</p>
              <p>Quantity: {bill.quantity}</p>
              <p>Bill Amount: {bill.bill_amt}</p>
              <p>TDS: {bill.tds}</p>
              <p>Actual Amount: {bill.actual_amt}</p>
              <p>Paid Amount: {bill.paid_amt}</p>
            </div>
            <div className="buttons">
              <button type="submit" className="add-btn">
                Add Item
              </button>
            </div>
            </div>
          </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Bill;
