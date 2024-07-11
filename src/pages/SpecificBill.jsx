import * as React from "react";
import front from "../assets/arrow-right.svg";
import close from "../assets/close.svg";
import "../styles/specificbill.css";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SpecificBill = () => {
  const [bill, setBill] = useState({
    bill_no: "",
    bill_date: "",
    voucher_no: "",
    vendor_name: "",
    item_id: "",
    item_name: "",
    quantity: "",
    unit_price: "",
    tds: "",
    total_amt: "",
    paid_amt: "",
    pending_amt: "",
  });

  const [addFormVisibility, setEditBillDetailsFormVisibility] = useState(false);

  const openEditBillDetailsForm = () => {
    setEditBillDetailsFormVisibility(true);
  };

  const closeEditBillDetailsForm = () => {
    setEditBillDetailsFormVisibility(false);
  };

  const handleChange = (e) => {
    setBill({ ...bill, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8898/api/editBill", bill);
      closeEditBillDetailsForm(); // Close the form after successful submission
    } catch (error) {
      console.log(error);
    }
  };

  const { bill_id } = useParams();

  useEffect(() => {
    const getSingleBill = async () => {
      try {
        const singleBill = await axios.get(
          `http://localhost:8898/api/singleBill/${bill_id}`
        );
        setBill(singleBill.data.bill);
      } catch (error) {
        console.log(error);
      }
    };
    getSingleBill();
  }, [bill_id]);

  console.log(bill);
  return (
    <div className="billside">
      <Sidebar />
      <div className="billtop">
        <Topbar />
        <div className="billcontainer">
          <div className="billcontent">
            <>
              <div className="title">
                <h3> Bill Records</h3>
                <img src={front} alt=""></img>
                <p> {bill.bill_no} </p>
              </div>
              <div className="head">
                <h1># {bill.bill_no}</h1>
              </div>
              <hr className="line" />
              <div className="content">
                <div className="left">
                  <p> Bill Date: {bill.bill_date} </p>
                  <p> Voucher Number: {bill.voucher_no}</p>
                  <p> Vendor: {bill.vendor_name}</p>
                </div>
                <div className="middle">
                  <p> Item ID: {bill.item_id} </p>
                  <p> Item Name: {bill.item_name}</p>
                  <p> Quantity: {bill.quantity}</p>
                  <p> Unit Price: {bill.unit_price}</p>
                </div>
                <div className="right">
                  <p> TDS: {bill.tds}</p>
                  <p> Total Amount: {bill.total_amt}</p>
                  <p> Paid Amount: {bill.paid_amt}</p>
                  <p> Pending Amount: {bill.pending_amt}</p>
                </div>
              </div>
            </>
            <div className="btn">
              <button onClick={openEditBillDetailsForm} className="edit">
                Edit details
              </button>
            </div>
          </div>
        </div>
      </div>
      {addFormVisibility && (
        <>
          <div className="overlay" onClick={closeEditBillDetailsForm}></div>

          <form onSubmit={handleSubmit} className="billdetailsform">
            <div className="toptitle">
              <p className="title2">Edit Details</p>
              <button
                type="button"
                className="close"
                onClick={closeEditBillDetailsForm}
              >
                <img src={close} alt="close icon" />
              </button>
            </div>
            <div className="maindetails">
              <div className="left">
                <div className="field">
                  <label htmlFor="bill_no">Bill Number:</label>
                  <input
                    type="text"
                    placeholder="Edit bill number"
                    name="bill_no"
                    id="bill_no"
                    onChange={handleChange}
                    value={bill.bill_no}
                  />
                </div>
                <div className="field">
                  <label htmlFor="bill_date">Bill Date:</label>
                  <input
                    type="date"
                    placeholder="Edit bill date"
                    name="bill_date"
                    id="bill_date"
                    onChange={handleChange}
                    value={bill.bill_date}
                  />
                </div>
                <div className="field">
                  <label htmlFor="voucher_no">Voucher Number:</label>
                  <input
                    type="text"
                    placeholder="Edit voucher number"
                    name="voucher_no"
                    id="voucher_no"
                    onChange={handleChange}
                    value={bill.voucher_no}
                  />
                </div>
                <div className="field">
                  <label htmlFor="vendor_name">Vendor Name:</label>
                  <input
                    type="text"
                    placeholder="Edit Vendor Name"
                    name="vendor_name"
                    id="vendor_name"
                    onChange={handleChange}
                    value={bill.vendor_name}
                  />
                </div>
              </div>
              <div className="middle">
                <div className="field">
                  <label htmlFor="item_id"> Item ID:</label>
                  <input
                    type="text"
                    placeholder="Edit item Id"
                    name="item_id"
                    id="item_id"
                    onChange={handleChange}
                    value={bill.item_id}
                  />
                </div>
                <div className="field">
                  <label htmlFor="item_name">Item Name:</label>
                  <input
                    type="text"
                    placeholder="Edit item name"
                    name="item_name"
                    id="item_name"
                    onChange={handleChange}
                    value={bill.item_name}
                  />
                </div>
                <div className="field">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="text"
                    placeholder="Edit quantity"
                    name="quantity"
                    id="quantity"
                    onChange={handleChange}
                    value={bill.quantity}
                  />
                </div>
                <div className="field">
                  <label htmlFor="unit_price">Unit Price:</label>
                  <input
                    type="text"
                    placeholder="Edit unit price"
                    name="unit_price"
                    id="unit_price"
                    onChange={handleChange}
                    value={bill.unit_price}
                  />
                </div>
              </div>
              <div className="right">
                <div className="field">
                  <label htmlFor="tds">TDS:</label>
                  <input
                    type="text"
                    placeholder="Edit TDS"
                    name="tds"
                    id="tds"
                    onChange={handleChange}
                    value={bill.tds}
                  />
                </div>
                <div className="field">
                  <label htmlFor="total_amt">Total Amount:</label>
                  <input
                    type="text"
                    placeholder="Edit total amount"
                    name="total_amt"
                    id="total_amt"
                    onChange={handleChange}
                    value={bill.total_amt}
                  />
                </div>
                <div className="field">
                  <label htmlFor="paid_amt">Paid Amount:</label>
                  <input
                    type="text"
                    placeholder="Edit paid amount"
                    name="paid_amt"
                    id="paid_amt"
                    onChange={handleChange}
                    value={bill.paid_amt}
                  />
                </div>
                <div className="field">
                  <label htmlFor="pending_amt">Pending Amount:</label>
                  <input
                    type="text"
                    placeholder="Edit pending amount"
                    name="pending_amt"
                    id="pending_amt"
                    onChange={handleChange}
                    value={bill.pending_amt}
                  />
                </div>
              </div>
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
export default SpecificBill;
