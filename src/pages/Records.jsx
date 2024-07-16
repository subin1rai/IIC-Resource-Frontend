import * as React from "react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/records.css";
import close from "../assets/close.svg";
import RecordsTable from "../components/RecordsTable";
import filterIcon from "../assets/filter.svg";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsDisplay } from "react-icons/bs";

const Records = () => {
  const [bill, setBill] = useState({
    bill_no: "",
    bill_date: "",
    invoice_no: "",
    vendor: "",
    item_name: "",
    unit_price: "",
    quantity: "",
    bill_amount: "",
    TDS: "",
    actual_amount: "",
    paid_amount: "",
  });

  const [error, setError] = useState("");

  const [addFormVisibility, setAddFormVisibility] = useState(false);

  //  visualizing add bill form
  const openAddBillForm = () => {
    setAddFormVisibility(true);
  };

  //closing add bill form
  const closeAddBillForm = () => {
    setError("");
    setAddFormVisibility(false);
  };

  const handleChange = (e) => {
    setBill((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(bill);
  };
  const token = localStorage.getItem("token");
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8898/api/addBill", bill,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`${bill.bill_id} Added Successfully!`);
      closeAddBillForm(); // Close the form after successful submission
      window.location.reload();

    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };
  const [vendors, setVendors] = useState("");
  const [items, setItems] = useState("");

  useEffect(() => {
    const getAllItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const itemsData = await axios.get("http://localhost:8898/api/items",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          } 
        );

        setItems(itemsData.data.items);
        console.log(items);
        console.log(vendors);

        const vendorsData = await axios.get(
          "http://localhost:8898/api/vendor",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVendors(vendorsData.data.vendors);
      } catch (error) {
        console.log(error);
      }
    };

    getAllItems();
  }, []);

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
            {/* adding filter icon */}
            <button className="filter-btn" aria-label="Menu">
              <img src={filterIcon} alt="filter icon" />
              Filter
            </button>
            <button onClick={openAddBillForm} className="add-btn">
              Add Bill
            </button>
          </div>
          {/* importing records table from components */}
          <RecordsTable />
        </div>
      </div>
      {addFormVisibility && (
        <>
          <div className="overlay" onClick={closeAddBillForm}>
            {" "}
          </div>
          <form onSubmit={handleSubmit} className="addform">
            <div className="forms">
              <div className="left">
                <button
                  type="button"
                  className="closebtn"
                  onClick={closeAddBillForm}
                >
                  <img src={close} alt="close icon" />
                </button>
                <p className="title">Add Bill Details</p>
                <div className="double">
                  {/* details of bill */}
                  <div className="for">
                    <label htmlFor="bill_no">Bill No:</label>
                    <input
                      type="text"
                      placeholder="Enter bill number"
                      autoFocus="autofocus"
                      name="bill_no"
                      id="bill_no"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="for">
                    <label htmlFor="bill_date">Bill Date:</label>
                    <input
                      type="date"
                      placeholder="Enter bill date"
                      name="bill_date"
                      id="bill_date"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="single">
                  <div className="for">
                    <label htmlFor="invoice_no">Voucher No:</label>
                    <input
                      type="text"
                      placeholder="Enter voucher number"
                      name="invoice_no"
                      id="invoice_no"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="single">
                  <div className="for">
                    <label htmlFor="vendor_name">Vendor:</label>
                    <select
                      id="vendor_name"
                      name="vendor_name"
                      onChange={handleChange}
                    >
                      <option value="">Select Vendor</option>
                      {vendors.map((vendor, vendor_id) => (
                        <option key={vendor_id} value={vendor.vendor_name}>
                          {vendor.vendor_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="single">
                  <div className="for">
                    <label htmlFor="item_name">Item Name:</label>
                    <select
                      id="item_name"
                      name="item_name"
                      onChange={handleChange}
                    >
                      <option value="">Select Items</option>
                      {items.map((item, item_id) => (
                        <option key={item_id} value={item.item_name}>
                          {item.item_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="double">
                  <div className="for">
                    <label htmlFor="unit_price">Unit Price:</label>
                    <input
                      type="text"
                      placeholder="Enter unit price"
                      name="unit_price"
                      id="unit_price"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="for">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                      type="number"
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
                    <input
                      type="number"
                      placeholder="Enter bill amount"
                      name="bill_amount"
                      id="bill_amount"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="for">
                    <label htmlFor="tds">Tax Deducted Source (TDS):</label>
                    <select
                      className="tdsselect"
                      id="tds"
                      name="TDS"
                      onChange={handleChange}
                    >
                      <option value="">Select TDS</option>
                      <option value="ten">10</option>
                      <option value="twenty">20</option>
                      <option value="thirty">30</option>
                    </select>
                  </div>
                </div>
                <div className="line">
                  <div className="double">
                    <div className="for">
                      <label htmlFor="actual_amount">Actual Amount:</label>

                      <input
                        type="number"
                        placeholder="Enter actual amount"
                        name="actual_amount"
                        id="actual_amount"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="for">
                      <label htmlFor="paid_amount">Paid Amount:</label>

                      <input
                        type="number"
                        placeholder="Enter paid amount"
                        name="paid_amount"
                        id="paid_amount"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="summary">
                <div className="right" class="mb-2">
                  <h2>Summary</h2>
                  <p>Bill No: {bill.bill_no}</p>
                  <p>Bill Date: {bill.bill_date}</p>
                  <p>Vendor: {bill.vendor_name}</p>
                  <p>Item Name: {bill.item_name}</p>
                  <p>Unit Price: {bill.unit_price}</p>
                  <p>Quantity: {bill.quantity}</p>
                  <p>Bill Amount: {bill.bill_amount}</p>
                  <p>TDS: {bill.TDS}</p>
                  <p>Actual Amount: {bill.actual_amount}</p>
                  <p>Paid Amount: {bill.paid_amount}</p>
                </div>

                {error && <span class="text-red-500">{error}</span>}

                <div className="buttons" class="mt-2">
                  <button type="submit" className="add-btn">
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </form>
        </>
      )}
      <ToastContainer pauseOnHover theme="light" />
    </div>
  );
};

export default Records;
