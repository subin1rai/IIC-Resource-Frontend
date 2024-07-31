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
  const { bill_id } = useParams();
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
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

        setBillDetails(singleBillResponse.data.bill);
        setItems(itemsResponse.data.items);
        setVendors(vendorsResponse.data.vendors);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error.response?.data?.error || "An error occurred");
        setLoading(false);
      }
    };
    fetchData();
  }, [bill_id]);

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
      const token = localStorage.getItem("token");
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
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // This will give you YYYY-MM-DD
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
                <Link to="/records" className="text-base">Bill Records</Link>
                <img src={front} alt="arrow" />
                <h4 className="text-base text-blue-400 ">
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
          {/* line  */}
          <div className="h-1 w-[99%] bg-blue-700 mx-auto mt-5"></div>
          {!loading ? (
            <>
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
                      {billDetails.voucher_no || "--"}
                    </span>
                  </p>
                  {/* <p>Item ID: <span>{billDetails.items.item_id}</span></p> */}
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
                {/* right side  */}
                <div className="flex flex-col gap-5 mt-7 pl-9 ">
                  <p className="font-semibold">
                    TDS:
                    <span className="font-medium pl-4">{billDetails.TDS}</span>
                  </p>
                  <p className="font-semibold">
                    Bill Amount:
                    <span className="font-medium pl-4">
                      {billDetails.voucher_no || "--"}
                    </span>
                  </p>
                  {/* <p>Item ID: <span>{billDetails.items.item_id}</span></p> */}
                  <p className="font-semibold">
                    Paid Amount:
                    <span className="font-medium pl-4">
                      {billDetails.paid_amount || "--"}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Pending Amount:
                    <span className="font-medium pl-4">
                      {billDetails.quantity || "--"}
                    </span>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>

      {addFormVisibility && (
        <>
          <div className="h-screen w-screen bg-overlay absolute " onClick={closeEditBillDetailsForm}></div>

          <form onSubmit={handleSubmit}
            className="flex absolute z-30 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded w-[55%]"
          >
            <div className="flex flex-col gap-10 justify-between ">
              <div className="flex justify-between items-center mx-11 ">
                <p className="font-bold text-xl">Edit Bill Details</p>
                <img src={close} alt="close" className="h-4 w-4 " />
              </div>
              <div className="flex gap-10 justify-around ">
                <div className="flex flex-col gap-6">
                  {/* bill number */}
                  <div className="flex items-center gap-5">
                    <label htmlFor="bill_no" className="w-32 font-medium">
                      Bill No. :
                    </label>
                    <input
                      type="text"
                      id="bill_no"
                      name="bill_no"
                      placeholder="Enter Bill Number"
                      className="border-2 border-border p-1 pl-3 rounded-md "
                      onChange={handleChange}
                    />
                  </div>
                  {/* bill date */}
                  <div className="flex items-center gap-5">
                    <label htmlFor="bill_date" className="w-32 font-medium">Bill Date:</label>
                    <NepaliDatePicker
                      inputClassName=""
                      className="border-2 border-border p-1 pl-3 rounded-md"
                      value={date}
                      onChange={handleChange}
                      options={{ calenderLocale: "en", valueLocale: "en" }}
                    />
                  </div>
                  {/* item name */}
                  <div className="flex items-center gap-5">
                    <label htmlFor="item_name" className="w-32 font-medium">
                      Item Name :
                    </label>
                    <input
                      type="text"
                      id="item_name"
                      name="item_name"
                      placeholder="Enter Item Name"
                      className="border-2 border-border p-1 pl-3 rounded-md "
                      onChange={handleChange}
                    />
                  </div>
                  {/* quantity */}
                  <div className="flex items-center gap-5">
                    <label htmlFor="quantity" className="w-32 font-medium">
                      Quantity :
                    </label>
                    <input
                      type="text"
                      id="quantity"
                      name="quantity"
                      placeholder="Enter Quantity"
                      className="border-2 border-border p-1 pl-3 rounded-md "
                      onChange={handleChange}
                    />
                  </div>
                  {/* Unit Price */}
                  <div className="flex items-center gap-5">
                    <label htmlFor="unit_price" className="w-32 font-medium">
                      Unit Price :
                    </label>
                    <input
                      type="text"
                      id="unit_price"
                      name="unit_price"
                      placeholder="Enter Unit Price"
                      className="border-2 border-border p-1 pl-3 rounded-md "
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* right side edit page */}
                <div className="flex flex-col gap-6">
                  {/* TDS */}
                  <div className="flex items-center gap-5">
                    <label htmlFor="tds" className="w-32 font-medium">
                      TDS :
                    </label>
                    <select
                      className="border-2 border-border p-1 pl-3 rounded-md w-56"
                      id="tds"
                      name="tds"
                      onChange={handleChange}
                    >
                      <option value="">Select TDS</option>
                      <option value="ten">10</option>
                      <option value="twenty">20</option>
                      <option value="thirty">30</option>
                    </select>
                  </div>
                  {/* Bill Amount */}
                  <div className="flex items-center gap-5">
                    <label htmlFor="bill_amount" className="w-32 font-medium">
                      Bill Amount :
                    </label>
                    <input
                      type="text"
                      id="bill_amount"
                      name="bill_amount"
                      placeholder="Enter Bill Amount"
                      className="border-2 border-border p-1 pl-3 rounded-md "
                      onChange={handleChange}
                    />
                  </div>
                  {/* Paid Amount */}
                  <div className="flex items-center gap-5">
                    <label htmlFor="paid_amount" className="w-32 font-medium">
                      Paid Amount :
                    </label>
                    <input
                      type="text"
                      id="paid_amount"
                      name="paid_amount"
                      placeholder="Enter Paid Amount"
                      className="border-2 border-border p-1 pl-3 rounded-md "
                      onChange={handleChange}
                    />
                  </div>
                  {/* Left Amount */}
                  <div className="flex items-center gap-5">
                    <label htmlFor="left_amount" className="w-32 font-medium">
                      Left Amount :
                    </label>
                    <input
                      type="text"
                      id="left_amount"
                      name="left_amount"
                      placeholder="Enter Left Amount"
                      className="border-2 border-border p-1 pl-3 rounded-md "
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <button
                className="bg-blue-600 text-white py-2 px-6 w-fit h-fit rounded-md flex"
              >
                Save Changes
              </button>
            </div>
          </form>


        </>
      )}
    </div>
  );
};

export default SpecificBill;


{/* <label htmlFor="bill_date">Bill Date:</label>
                  <NepaliDatePicker
                    inputClassName="form-control"
                    className="border-2 border-gray p-1 pl-3 rounded-md "
                    value={date}
                    onChange={handleChange}

                    options={{ calenderLocale: "en", valueLocale: "en" }}
                  />
                  <label htmlFor="Voucher_no">
                    Voucher No. :
                  </label>
                  <input
                    type="text"
                    id="voucher_no"
                    name="voucher_no"
                    placeholder="Enter Voucher Number"
                    className="border-2 border-gray p-1 pl-3 rounded-md "
                    onChange={handleChange}

                  /> */}
