import React, { useEffect, useState } from "react";
import front from "../assets/arrow-right.svg";
import close from "../assets/close.svg";
import "../styles/specificbill.css";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import Select from "react-select";

const SpecificBill = () => {
  const [bill, setBill] = useState({
    bill_no: "",
    bill_date: "",
    voucher_no: "",
    vat_number: "",
    item_name: "",
    quantity: "",
    unit_price: "",
    tds: "",
    total_amt: "",
    paid_amt: "",
    pending_amt: "",
  });

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      borderRadius: "4px",
      borderColor: "grey",
      boxShadow: "none",
      minHeight: "38px",
      color: "black",
      "&:hover": {
        borderColor: "#aaa",
      },
    }),
    menu: (provided) => ({
      ...provided,

      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }),
    input: (provided) => ({
      ...provided,
      width: "45px",
      margin: "0px",
      color: "black",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#757575",
    }),
    container: (provided) => ({
      ...provided,
      width: "100%",
      color: "black",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
      color: "black",
    }),
  };

  const [date, setDate] = useState("");

  const [addFormVisibility, setEditBillDetailsFormVisibility] = useState(false);
  const [billDetails, setBillDetails] = useState({});

  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { bill_id } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const [singleBillResponse, itemsResponse, vendorsResponse] =
          await Promise.all([
            axios.get(`http://localhost:8898/api/singleBill/${bill_id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
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

        console.log(itemsResponse);

        setBillDetails(singleBillResponse.data.bill);
        console.log(billDetails);
        setItems(itemsResponse.data);
        setVendors(vendorsResponse.data.vendors);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error.response?.data?.error || "An error occurred");
        setLoading(false);
      }
    };
    fetchData();
  }, [bill_id, token]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:8898/api/updateBill/${bill_id}`, bill, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      closeEditBillDetailsForm();
      // Refresh bill details
      const updatedBill = await axios.get(
        `http://localhost:8898/api/singleBill/${bill_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBillDetails(updatedBill.data.bill);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="flex bg-background h-screen w-screen ">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto">
        <Topbar />

        <div className="bg-white w-[99%] mx-auto h-50 flex flex-col p-5 rounded-md relative">
          <div className="flex justify-between items-center ml-2">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Link to="/records" className="text-base">
                  Bill Records
                </Link>
                <img src={front} alt="arrow" />
                <h4 className="text-base text-blue-400">
                  {billDetails.bill_no}
                </h4>
              </div>
              <h2 className="font-semibold text-2xl">{billDetails.bill_no}</h2>
            </div>
            <button
              onClick={openEditBillDetailsForm}
              className="flex justify-end bg-blue-600 px-7 py-2 h-fit w-fit rounded text-white mr-5"
            >
              Edit Bill
            </button>
          </div>
          <div className="h-1 w-[99%] bg-blue-700 mx-auto mt-5"></div>
          {!loading ? (
            <div className="flex justify-between w-[75%]">
              <div className="flex flex-col gap-5 mt-7 pl-9">
                <p className="font-semibold">
                  Bill Date:
                  <span className="font-medium pl-4">
                    {formatDate(billDetails.bill_date) || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Voucher No:
                  <span className="font-medium pl-4">
                    {billDetails.invoice_no || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Item Name:
                  <span className="font-medium pl-4">
                    {billDetails?.items?.item_name || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Quantity:
                  <span className="font-medium pl-4">
                    {billDetails.quantity || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Unit Price:
                  <span className="font-medium pl-4">
                    {billDetails.unit_price || "--"}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-5 mt-7 pl-9">
                <p className="font-semibold">
                  TDS:
                  <span className="font-medium pl-4">
                    {billDetails.TDS || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Bill Amount:
                  <span className="font-medium pl-4">
                    {billDetails.bill_amount || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Paid Amount:
                  <span className="font-medium pl-4">
                    {billDetails.paid_amount || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Pending Amount:
                  <span className="font-medium pl-4">
                    {billDetails.left_amount || "--"}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>

      {addFormVisibility && (
        <>
          <div className="h-screen w-screen bg-overlay absolute "></div>

          <form
            onSubmit={handleSubmit}
            className="flex absolute z-30 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded "
          >
            {/* main div */}
            <div className="flex flex-col gap-7">
              {/* heading div */}
              <div className="flex justify-between ">
                <p className="font-semibold text-2xl">Edit Bill Details</p>
                <img
                  src={close}
                  alt="close"
                  className="h-5 w-5 cursor-pointer"
                  onClick={closeEditBillDetailsForm}
                />
              </div>
              {/* form div */}
              <div className="flex gap-20">
                <div className="flex flex-col gap-5">
                  {/* 1st row */}
                  <div className="flex gap-14">
                    <div className="flex flex-col gap-3">
                      <label htmlFor="bill_no" className="font-medium">
                        Bill No.:
                      </label>
                      <input
                        type="text"
                        id="bill_no"
                        name="bill_no"
                        placeholder="Enter Bill Number"
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="bill_date" className="font-medium">
                        Bill Date:
                      </label>
                      <NepaliDatePicker
                        inputClassName="form-control"
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md "
                        value={date}
                        onChange={handleChange}
                        options={{ calenderLocale: "en", valueLocale: "en" }}
                      />
                    </div>
                  </div>
                  {/* 2nd row */}
                  <div className="flex gap-14">
                    <div className="flex flex-col gap-3">
                      <label htmlFor="voucher_no" className="font-medium">
                        Voucher No.:
                      </label>
                      <input
                        type="text"
                        id="voucher_no"
                        name="voucher_no"
                        placeholder="Enter Voucher Number"
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="vat_number" className="font-medium">
                        VAT:
                      </label>
                      <input
                        type="text"
                        id="vat_number"
                        name="vat_number"
                        placeholder="Enter VAT "
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* third row */}
                  <div className="flex flex-col gap-3">
                    <label htmlFor="item_name" className="font-medium">
                      Item Name:
                    </label>
                    <Select
                      options={items.map((item) => ({
                        value: item.item_name,
                        label: item.item_name,
                      }))}
                      onChange={(option) =>
                        handleSelectChange(option, { name: "item_name" })
                      }
                      value={
                        bill.item_name
                          ? { value: bill.item_name, label: bill.item_name }
                          : null
                      }
                      placeholder="Select Item"
                    />
                  </div>
                  {/* 4th row */}
                  <div className="flex gap-14">
                    <div className="flex flex-col gap-3">
                      <label htmlFor="unit_price" className="font-medium">
                        Unit Price:
                      </label>
                      <input
                        type="text"
                        id="unit_price"
                        name="unit_price"
                        placeholder="Enter Unit Price"
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="quantity" className="font-medium">
                        Quantity:
                      </label>
                      <input
                        type="text"
                        id="quantity"
                        name="quantity"
                        placeholder="Enter quantity "
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* 5th row */}
                  <div className="flex gap-14">
                    <div className="flex flex-col gap-3">
                      <label htmlFor="bill_amount" className="font-medium">
                        Bill Amount:
                      </label>
                      <input
                        type="text"
                        id="bill_amount"
                        name="bill_amount"
                        placeholder="Enter Bill Amount"
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="tds" className="font-medium">
                        TDS:
                      </label>
                      <select
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        id="TDS"
                        name="TDS"
                        onChange={handleChange}
                        value={bill.TDS}
                      >
                        <option value="">Select TDS</option>
                        <option value="1.5">1.5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                      </select>
                    </div>
                  </div>

                  {/* 6th row */}
                  <div className="flex gap-14">
                    <div className="flex flex-col gap-3">
                      <label htmlFor="" className="font-medium">
                        Unit Price:
                      </label>
                      <input
                        type="text"
                        id=""
                        name=""
                        placeholder="Enter Actual Amount"
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="quantity" className="font-medium">
                        Paid Amount:
                      </label>
                      <input
                        type="text"
                        id="quantity"
                        name="quantity"
                        placeholder="Enter Paid Amount   "
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-background h-fit p-6 flex gap-3 flex-col w-[350px]">
                  <h2 className="font-semibold text-xl">Summary</h2>
                  <p className="font-medium">Bill No: {bill.bill_no}</p>
                  <p className="font-medium">Bill Date: {bill.bill_date}</p>
                  <p className="font-medium">Vendor Vat: {bill.vat_number}</p>
                  <p className="font-medium">Item Name: {bill.item_name}</p>
                  <p className="font-medium">Unit Price: {bill.unit_price}</p>
                  <p className="font-medium">Quantity: {bill.quantity}</p>
                  <p className="font-medium">Bill Amount: {bill.bill_amount}</p>
                  <p className="font-medium">TDS: {bill.tds}</p>
                  <p className="font-medium">
                    Actual Amount: {bill.actual_amount}
                  </p>
                  <p className="font-medium">Paid Amount: {bill.paid_amount}</p>
                  <button className="bg-button py-2 rounded-md text-white mt-4">
                    Save Changes
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

export default SpecificBill;
