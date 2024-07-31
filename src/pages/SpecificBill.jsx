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
  const [error, setError] = useState("");

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
        setError(error.response?.data?.error || "An error occurred");
      }
    };
    fetchData();
  }, []);

  console.log(billDetails)

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
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // This will give you YYYY-MM-DD
  };

  return (
    <div className="flex bg-background h-screen w- screen gap-1" >
      <Sidebar />
      <div className="flex flex-col gap-3">
        <Topbar />

        <div className="bg-white w-[98%] mx-auto h-50 flex flex-col p-5 rounded-md relative">
          <div className="flex justify-between items-center ml-2">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <h4 className="text-base">
                  Bill Records
                </h4>
                <img src={front} alt="arrow" />
                <h4 className="text-base text-blue-400 ">
                  {billDetails.bill_no}
                </h4>
              </div>
              <h2 className="font-semibold text-2xl">
                {billDetails.bill_no}
              </h2>
            </div>
            <button onClick={openEditBillDetailsForm} className="flex justify-end bg-blue-600 px-7 py-2 h-fit w-fit rounded text-white mr-5">Edit Bill</button>
          </div>
          {/* line  */}
          <div className="h-1 w-[99%] bg-blue-700 mx-auto mt-5"></div>

          <div className="flex justify-between w-[75%]">
            <div className="flex flex-col gap-5 mt-7 pl-9">
              <p className="font-semibold">
                Bill Date:
                <span className="font-medium pl-4" >{formatDate(billDetails.bill_date) || "--"}</span>
              </p>
              <p className="font-semibold">
                Voucher No:
                <span className="font-medium pl-4">{billDetails.voucher_no || "--"}</span>
              </p>
              {/* <p>Item ID: <span>{billDetails.items.item_id}</span></p> */}
              <p className="font-semibold">
                Item Name:
                {/* <span className="font-medium pl-4">{billDetails.items.item_name || "--"}</span> */}
              </p>
              <p className="font-semibold">
                Quantity:
                <span className="font-medium pl-4">{billDetails.quantity || "--"}</span>
              </p>
              <p className="font-semibold">
                Unit Price:
                <span className="font-medium pl-4">{billDetails.unit_price || "--"}</span>
              </p>
            </div>
            {/* right side  */}
            <div className="flex flex-col gap-5 mt-7 pl-9 ">
              <p className="font-semibold">
                TDS:
                <span className="font-medium pl-4" >{billDetails.TDS}</span>
              </p>
              <p className="font-semibold">
                Bill Amount:
                <span className="font-medium pl-4">{billDetails.voucher_no || "--"}</span>
              </p>
              {/* <p>Item ID: <span>{billDetails.items.item_id}</span></p> */}
              <p className="font-semibold">
                Paid Amount:
                <span className="font-medium pl-4">{billDetails.paid_amount || "--"}</span>
              </p>
              <p className="font-semibold">
                Pending Amount:
                <span className="font-medium pl-4">{billDetails.quantity || "--"}</span>
              </p>

            </div>



          </div>
        </div>
      </div>


      {addFormVisibility && (
        <>
          <div className="z-20 bg-overlay w-screen h-screen absolute" onClick={closeEditBillDetailsForm}></div>

          <form onSubmit={handleSubmit} className="flex absolute z-30 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 rounded " >
            <div className="flex">
              <p className="font-bold text-base">Edit Bill Details</p>
            </div>
          </form>
        </>
      )
      }
    </div >
  );
};

export default SpecificBill;
