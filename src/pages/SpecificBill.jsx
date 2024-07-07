import * as React from "react";
import front from "../assets/arrow-right.svg";
import close from "../assets/close.svg";
import "../styles/specificbill.css";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

const SpecificBill = () =>{
    const [bill, setBill] = useState({
        bill_no: "",
        bill_date: "",
        voucher_no: "",
        vendor_name:"",
        item_id: "",
        item_name: "",
        quantity:"",
        unit_price:"",
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
          await axios.post("http://localhost:8898/api/editBillr", bill);
          closeEditBillDetailsForm(); // Close the form after successful submission
        } catch (error) {
          console.log(error);
        }
      };
    return(
        <div className="billside">
            <Sidebar />
            <div className="billtop">
                <Topbar />
                <div className="billcontainer">
                <div className="billcontent">
            <>
            <div className="title">
            <h3> Bill Records</h3> <img src={front} alt=""></img> <p> #423 </p>
            </div>
            <div className="head">
                    <h1>#423</h1>
                </div>
                <hr className="line" />
                <div className="content">
                    <div className="left">
                        <p> Bill Date:  </p>
                        <p> Voucher Number:</p>
                        <p> Vendor:</p>
                        </div>
                        <div className="middle">
                        <p> Item ID: </p>
                        <p> Item Name: </p>
                        <p> Quantity: </p>
                        <p> Unit Price: </p>
                        </div>
                        <div className="right">
                        <p> TDS: </p>
                        <p> Total Amount: </p>
                        <p> Paid Amount: </p>
                        <p> Pending Amount: </p>
                        </div>
                    </div></>
                    <div className="btn">
                            <button onClick = {openEditBillDetailsForm} className= "edit">Edit details</button>
                    </div>
                </div>
                </div>
                </div>
                {addFormVisibility && (
                <>
               <div className="overlay"> </div>

            <form onSubmit={handleSubmit} className="billdetailsform">
            <div className="toptitle">
          <p className="title2">Edit Details</p>
          <button
            type="button"
            className="close"
            onClick={closeEditBillDetailsForm}>
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
              id="bil_no"
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="bill_date">Bill Date:</label>
            <input
              type="date"
              placeholder="Edit bill date"
              name="bill_date"
              id="bil_date"
              onChange={handleChange}
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
            />
          </div>
          <div className="field">
            <label htmlFor="item_name">Item Name:</label>
            <input
              type="text"
              placeholder="Edit item name"
              name="item_name"
              id="item-name"
              onChange={handleChange}
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
            />
          </div>
          <div className="field">
            <label htmlFor="paid_amt">Paid Amount:</label>
            <input
              type="text"
              placeholder="Edit paid amount"
              name="paid_amt"
              id="paid-amt"
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="pending_amt">Pending Amount</label>
            <input
              type="text"
              placeholder="Edit pending amount"
              name="pending_amt"
              id="pending_amt"
              onChange={handleChange}
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
}
export default SpecificBill;