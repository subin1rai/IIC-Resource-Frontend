import React, { useEffect, useState } from "react";
import front from "../assets/arrow-right.svg";
import close from "../assets/close.svg";
import "../styles/specificbill.css";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

const SpecificBill = () => {
  const [bill, setBill] = useState({
    bill_no: "",
    bill_date: "",
    voucher_no: "",
    vendor_name: "",
    item_name: "",
    quantity: "",
    unit_price: "",
    tds: "",
    total_amt: "",
    paid_amt: "",
    pending_amt: "",
  });

  const [addFormVisibility, setEditBillDetailsFormVisibility] = useState(false);
  const [billDetails, setBillDetails] = useState({});
  const bill_ID = useParams();
  console.log(bill_ID.bill_id);
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [singleBillResponse, itemsResponse, vendorsResponse] =
          await Promise.all([
            axios.get(
              `http://localhost:8898/api/singleBill/${bill_ID.bill_id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
            axios.get("http://localhost:8898/api/items", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            axios.get("http://localhost:8898/api/vendor", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);
        setBillDetails(singleBillResponse.data.bill);
        setItems(itemsResponse.data.items);
        setVendors(vendorsResponse.data.vendors);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const openEditBillDetailsForm = () => {
    setBill({
      bill_no: billDetails.bill_no || "",
      bill_date: billDetails.bill_date ? formatDate(billDetails.bill_date) : "",
      voucher_no: billDetails.invoice_no || "",
      vendor_name: billDetails.vendors?.vendor_name || "",
      item_name: billDetails.items?.item_name || "",
      quantity: billDetails.quantity || "",
      unit_price: billDetails.unit_price || "",
      tds: billDetails.TDS || "",
      total_amt: billDetails.actual_amount || "",
      paid_amt: billDetails.paid_amount || "",
      pending_amt: billDetails.vendors?.pending_payment || "",
    });
    setEditBillDetailsFormVisibility(true);
  };

  const closeEditBillDetailsForm = () => {
    setEditBillDetailsFormVisibility(false);
  };

  const handleChange = (e) => {
    setBill({ ...bill, [e.target.name]: e.target.value });
  };
  const token = localStorage.getItem("token");
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:8898/api/updateBill/${bill_ID.bill_id}`,
        bill,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      closeEditBillDetailsForm();
      // Refresh bill details

      const updatedBill = await axios.get(
        `http://localhost:8898/api/singleBill/${bill_ID.bill_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBillDetails(updatedBill.data.bill);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  return (
    <div className="billside">
      <Sidebar />
      <div className="billtop">
        <Topbar />
        <div className="billcontainer">
          <div className="billcontent">
            <>
              <div className="title">
                <h3>
                  <Link to={"/records"} className="redeirect">
                    Bill Records
                  </Link>
                </h3>
                <img src={front} alt="" />
                <p>{billDetails.bill_no}</p>
              </div>
              <div className="head">
                <h1># {billDetails.bill_no}</h1>
              </div>
              <hr className="line" />
              <div className="content">
                <div className="left">
                  <p>
                    Bill Date:{" "}
                    {billDetails.bill_date
                      ? formatDate(billDetails.bill_date)
                      : ""}
                  </p>
                  <p>Voucher Number: {billDetails.invoice_no}</p>
                  <p>Vendor: {billDetails.vendors?.vendor_name}</p>
                </div>
                <div className="middle">
                  <p>Item Name: {billDetails.items?.item_name}</p>
                  <p>Quantity: {billDetails.quantity}</p>
                  <p>Unit Price: {billDetails.unit_price}</p>
                </div>
                <div className="right">
                  <p>TDS: {billDetails.TDS}</p>
                  <p>Total Amount: {billDetails.actual_amount}</p>
                  <p>Paid Amount: {billDetails.paid_amount}</p>
                  <p>Pending Amount: {billDetails.vendors?.pending_payment}</p>
                </div>
              </div>
            </>
            <button onClick={openEditBillDetailsForm} className="edit">
              Edit details
            </button>
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
                  <select
                    id="vendor_name"
                    name="vendor_name"
                    onChange={handleChange}
                    value={bill.vendor_name}
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((vendor, index) => (
                      <option key={index} value={vendor.vendor_name}>
                        {vendor.vendor_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="middle">
                <div className="field">
                  <label htmlFor="item_name">Item Name:</label>
                  <select
                    id="item_name"
                    name="item_name"
                    onChange={handleChange}
                    value={bill.item_name}
                  >
                    <option value="">Select Item</option>
                    {items.map((item, index) => (
                      <option key={index} value={item.item_name}>
                        {item.item_name}
                      </option>
                    ))}
                  </select>
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
                    // value={bill.paid_amt}
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
