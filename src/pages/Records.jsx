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
import Select from "react-select";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

const Records = () => {
  const [bill, setBill] = useState({
    bill_no: "",
    bill_date: "",
    invoice_no: "",
    vendor_vat: "",
    vendor_name: "",
    item_name: "",
    unit_price: "",
    quantity: "",
    bill_amount: "",
    TDS: "",
    actual_amount: "",
    paid_amount: "",
  });
  const [date, setDate] = useState("");
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      borderRadius: "4px",
      borderColor: "#ccc",
      boxShadow: "none",
      minHeight: "38px",
      "&:hover": {
        borderColor: "#aaa",
      },
    }),
    menu: (provided) => ({
      ...provided,
      width: "100%",
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#757575",
    }),
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
    }),
  };

  const [error, setError] = useState("");
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [bills, setBills] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);

  const token = localStorage.getItem("token");

  const fetchBills = async () => {
    try {
      const response = await axios.get("http://localhost:8898/api/bill", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBills(response.data.bills || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setBills([]);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, vendorsResponse] = await Promise.all([
          axios.get("http://localhost:8898/api/items", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8898/api/vendor", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setItems(itemsResponse.data.items);
        setVendors(vendorsResponse.data.vendors);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const openAddBillForm = () => {
    setAddFormVisibility(true);
  };

  const closeAddBillForm = () => {
    setError("");
    setAddFormVisibility(false);
    setBill({
      bill_no: "",
      bill_date: "",
      invoice_no: "",
      vendor_vat: "",
      vendor_name: "",
      item_name: "",
      unit_price: "",
      quantity: "",
      bill_amount: "",
      TDS: "",
      actual_amount: "",
      paid_amount: "",
    });
  };

  const handleChange = (e) => {
    setBill((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setBill((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleDateChange = (event) => {
    console.log("Event:", event); // Log the entire event object to the console
    const { bsDate } = event;
    console.log("Selected date:", bsDate); // Log the selected date to the console
    setBill((prev) => ({ ...prev, bill_date: bsDate }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8898/api/addBill",
        bill,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`${bill.bill_no} Added Successfully!`);
      closeAddBillForm();
      setBills((prevBills) => [...prevBills, response.data.bill]);
    } catch (error) {
      console.error("Error adding bill:", error);
      setError(
        error.response?.data?.error || "An error occurred while adding the bill"
      );
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
              <p >Bill Records</p>
            </div>
            <div className=" w-[10vw] flex justify-between gap-2 mr-8">
            <button className="filterbill" aria-label="Menu">
              <img src={filterIcon} alt="filter icon" />
              Filter
            </button>
            <button onClick={openAddBillForm} className="addbillbtn">
              Add Bill
            </button>
            </div>
          </div>
          <RecordsTable bills={bills} />
        </div>
      </div>
      {addFormVisibility && (
        <>
          <div className="overlay" onClick={closeAddBillForm}></div>
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
                  <div className="for">
                    <label htmlFor="bill_no">Bill No:</label>
                    <input
                      type="text"
                      placeholder="Enter bill number"
                      autoFocus="autofocus"
                      name="bill_no"
                      id="bill_no"
                      onChange={handleChange}
                      value={bill.bill_no}
                    />
                  </div>
                  <div className="for">
                    <label htmlFor="bill_date">Bill Date:</label>
                    <NepaliDatePicker
                      inputClassName="form-control"
                      className=""
                      value={date}
                      onChange={handleDateChange}
                      options={{ calenderLocale: "en", valueLocale: "en" }}
                    />
                  </div>
                </div>
                <div className="double">
                  <div className="for">
                    <label htmlFor="invoice_no">Voucher No:</label>
                    <input
                      type="text"
                      placeholder="Enter voucher number"
                      name="invoice_no"
                      id="invoice_no"
                      onChange={handleChange}
                      value={bill.invoice_no}
                    />
                  </div>
                  <div className="for">
                    <label htmlFor="vendor_vat">Vat No:</label>
                    <input
                      type="text"
                      placeholder="Enter vendor vat"
                      name="vendor_vat"
                      id="vendor_vat"
                      onChange={handleChange}
                      value={bill.vendor_vat}
                    />
                  </div>
                </div>
                <div className="single">
                  <div className="for">
                    <label htmlFor="vendor_name">Vendor:</label>
                    <Select
                      options={vendors.map((vendor) => ({
                        value: vendor.vendor_name,
                        label: vendor.vendor_name,
                      }))}
                      onChange={(option) =>
                        handleSelectChange(option, { name: "vendor_name" })
                      }
                      value={
                        vendors.find(
                          (vendor) => vendor.vendor_name === bill.vendor_name
                        ) || null
                      }
                      placeholder="Select Vendor"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="single">
                  <div className="for">
                    <label htmlFor="item_name">Item Name:</label>
                    <Select
                      options={items.map((item) => ({
                        value: item.item_name,
                        label: item.item_name,
                      }))}
                      onChange={(option) =>
                        handleSelectChange(option, { name: "item_name" })
                      }
                      value={
                        items.find(
                          (item) => item.item_name === bill.item_name
                        ) || null
                      }
                      placeholder="Choose Item"
                      styles={customStyles}
                    />
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
                      value={bill.unit_price}
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
                      value={bill.quantity}
                    />
                  </div>
                </div>
                <div className="double">
                  <div className="for">
                    <label htmlFor="bill_amount">Bill Amount:</label>
                    <input
                      type="number"
                      placeholder="Enter bill amount"
                      name="bill_amount"
                      id="bill_amount"
                      onChange={handleChange}
                      value={bill.bill_amount}
                    />
                  </div>
                  <div className="for">
                    <label htmlFor="TDS">Tax Deducted Source (TDS):</label>
                    <select
                      className="tdsselect"
                      id="TDS"
                      name="TDS"
                      onChange={handleChange}
                      value={bill.TDS}
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
                        value={bill.actual_amount}
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
                        value={bill.paid_amount}
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
                  <p>Vendor: {bill.vendor_name}</p>
                  <p>Item Name: {bill.item_name}</p>
                  <p>Unit Price: {bill.unit_price}</p>
                  <p>Quantity: {bill.quantity}</p>
                  <p>Bill Amount: {bill.bill_amount}</p>
                  <p>TDS: {bill.TDS}</p>
                  <p>Actual Amount: {bill.actual_amount}</p>
                  <p>Paid Amount: {bill.paid_amount}</p>
                </div>

                {error && <span className="text-red-500">{error}</span>}

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
      <ToastContainer pauseOnHover theme="light" />
    </div>
  );
};

export default Records;
