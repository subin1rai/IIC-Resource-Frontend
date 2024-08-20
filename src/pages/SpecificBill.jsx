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
import Vat from "../components/Vat";
import Pan from "../components/Pan10";
import NoBill from "../components/NoBill";

const SpecificBill = () => {
  const [bill, setBill] = useState({
    bill_no: "",
    bill_date: "",
    invoice_no: "",
    vat_number: "",
    selectedOptions: "",
    paid_amount: 0,
    items: [],
  });

  const [editedBill, setEditedBill] = useState({
    bill_no: "",
    bill_date: "",
    invoice_no: "",
    vat_number: "",
    selectedOptions: "",
    paid_amount: 0,
    items: [],
  });

  const [date, setDate] = useState("");
  const [addFormVisibility, setEditBillDetailsFormVisibility] = useState(false);
  const [billDetails, setBillDetails] = useState({});
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  const { bill_id } = useParams();

  const token = localStorage.getItem("token");

  // please dont remove this

  const role = localStorage.getItem("role");

  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8898/api/approveBill/${bill_id}`
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // ya samma hai ta

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case "vat 0":
      case "vat 1.5":
        return (
          <Vat
            selectedOption={selectedOption}
            handleChange={handleChange}
            onDataUpdate={(data) => handleDataUpdate(data, 'vat')}
          />
        );
      case "pan 0":
      case "pan 10":
      case "pan 15":
        return ( <Pan selectedOption={selectedOption} handleChange={handleChange} onDataUpdate={(data) => handleDataUpdate(data, 'pan')}  />);
      case "noBill":
        return (
          <NoBill handleChange={handleChange} onDataUpdate={(data) => handleDataUpdate(data, 'noBill')}/>
        );
      default:
        return (
          <div className="text-red-500">Please select the type of Bill</div>
        );
    }
  };

  const handleSelectChange = (option, { name }) => {
    setBill((prevBill) => ({
      ...prevBill,
      [name]: option.value,
    }));
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "254px",
      borderRadius: "4px",
      borderColor: "lightgrey",
      boxShadow: "none",
      minHeight: "41px",
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
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
    setEditedBill({
      bill_no: billDetails.bill_no || "",
      bill_date: billDetails.bill_date ? formatDate(billDetails.bill_date) : "",
      voucher_no: billDetails.invoice_no || "",
      vendor_name: billDetails.vendors?.vendor_name || "",
      item_name: billDetails.items?.item_name || "",
      quantity: billDetails.quantity || "",
      unit_price: billDetails.unit_price || "",
      tds: billDetails.TDS || "",
      amount: billDetails.amount || "",
      paid_amt: billDetails.paid_amount || "",
      pending_amt: billDetails.vendors?.pending_payment || "",
    });
    setEditBillDetailsFormVisibility(true);
  };

  const closeEditBillDetailsForm = () => {
    setEditBillDetailsFormVisibility(false);
  };

  const handleChange = (e) => {
    setEditedBill({ ...editedBill, [e.target.name]: e.target.value });
  };

  const handleDateChange = (event) => {
    const date = event;
    setBill((prev) => ({ ...prev, bill_date: date }));
  };

  const handleBillChange = (event) => {
    const value = event.target.value;
    console.log("Selected option:", value);
    setSelectedOption(value);
    setBill((prevBill) => ({
      ...prevBill,
      selectedOptions: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:8898/api/updateBill/${bill_id}`,
        editedBill,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBill({ ...bill, ...editedBill });
      closeEditBillDetailsForm();
    } catch (error) {
      console.log(error);
    }
  };

  console.log(token);

  // Refresh bill details
  useEffect(() => {
    const fetchSingleBill = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8898/api/singleBill/${bill_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBill(response.data.bill);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching Bill data:", error);
      }
    };
    fetchSingleBill();
  }, [bill_id]);

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

            {/* please dont remove this during merge conflict */}
            <div className="flex gap-3">
              <button
                onClick={openEditBillDetailsForm}
                className="flex justify-end bg-blue-600 px-6 py-3 h-fit w-fit rounded font-medium text-white mr-5"
              >
                Edit Bill
              </button>

              {role === "superadmin" ? (
                <button
                  className="bg-green-500 px-6 rounded text-white font-medium py-3"
                  onClick={handleApprove}
                >
                  Approve Bill
                </button>
              ) : (
                <></>
              )}
            </div>
            {/* na hatako ma thank you hai  */}
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
                {/* <p className="font-semibold">
                  Vendor Name:
                  <span className="font-medium pl-4">
                    {billDetails.vat_no || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Vat No:
                  <span className="font-medium pl-4">
                    {billDetails.vat_no || "--"}
                  </span>
                </p> */}
                 <p className="font-semibold">
                  Vendor Name:
                  <span className="font-medium pl-4">
                    {billDetails?.vendors?.vendor_name || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Vat/Pan No:
                  <span className="font-medium pl-4">
                    {billDetails.vat_number || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Voucher No:
                  <span className="font-medium pl-4">
                    {billDetails.invoice_no || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Approved Status:
                  <span className="font-medium pl-4">
                    {billDetails.approved_status || "--"}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-5 mt-7 pl-9">
                <p className="font-semibold">
                  TDS:
                  <span className="font-medium pl-4">
                    {billDetails?.BillItems?.TDS || "--"}
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
                    {billDetails.paid_amt || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Pending Amount:
                  <span className="font-medium pl-4">
                    {billDetails.left_amount || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Payment Status:
                  <span className="font-medium pl-4">
                    {billDetails.payment_status || "--"}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
          <div className="h-[2px] w-[99%] bg-blue-700 mx-auto mt-5"></div>
          <p className="font-bold text-xl py-6 px-2">Items</p>
          <table className="min-w-full table-fixed border-collapse">
      <thead>
        <tr >
          <th className="p-2 text-left border-b border-neutral-200">S.No.</th>
          <th className="p-2 text-left border-b  border-neutral-200">Item Name</th>
          <th className="p-2 text-left border-b  border-neutral-200">Quantity</th>
          <th className="p-2 text-left border-b  border-neutral-200">Unit Price</th>
        </tr>
      </thead>
      <tbody>
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <tr key={index}>
              <td className="p-2 border-b  border-neutral-200">{index + 1}</td>
              <td className="p-2 border-b  border-neutral-200">{item.name}</td>
              <td className="p-2 border-b  border-neutral-200">{item.quantity}</td>
              <td className="p-2 border-b  border-neutral-200">{item.unitPrice}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="p-2 text-center border-b border-gray-300">
              No items available
            </td>
          </tr>
        )}
      </tbody>
    </table>
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
              <div className=" gap-16">
                <div className="flex flex-col pb-8">
                  <h1 className="font-medium pb-4">Select the type of Bill</h1>
                  <div className="flex border-2 rounded-md border-neutral-300 w-[378px]">
                    <select
                      value={selectedOption}
                      onChange={handleBillChange}
                      className={`rounded w-[200px] h-10 ${
                        selectedOption === "vat 0" ||
                        selectedOption === "vat 1.5"
                          ? "bg-green-300"
                          : "border-neutral-300"
                      } focus:outline-none focus:border-transparent px-4`}
                    >
                      <option value="" disabled>
                        Select VAT
                      </option>
                      <option value="vat 0">VAT 0</option>
                      <option value="vat 1.5">VAT 1.5</option>
                    </select>
                    <select
                      value={selectedOption}
                      onChange={handleBillChange}
                      className={` rounded w-[200px] ${
                        selectedOption === "pan 0" ||
                        selectedOption === "pan 10" ||
                        selectedOption === "pan 15"
                          ? "bg-yellow-300"
                          : "border-neutral-300"
                      } focus:outline-none focus:border-transparent px-4`}
                    >
                      <option value="" disabled>
                        Select PAN
                      </option>
                      <option value="pan 0">Pan 0</option>
                      <option value="pan 10">Pan 10</option>
                      <option value="pan 15">Pan 15</option>
                    </select>
                    <button
                      onClick={() =>
                        handleBillChange({ target: { value: "noBill" } })
                      }
                      className={` rounded w-[200px] ${
                        selectedOption === "noBill"
                          ? "bg-red-300 text-white"
                          : "border-neutral-300"
                      } px-4 whitespace-nowrap`}
                    >
                      No Bill
                    </button>
                  </div>
                </div>

                <div className="flex gap-[250px] pb-8">
                  <div className="flex flex-col gap-4">
                    <label className="font-medium" htmlFor="bill_no">
                      Bill Date:
                    </label>
                    <NepaliDatePicker
                      inputClassName="form-control"
                      className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                      value={editedBill.date}
                      onChange={handleDateChange}
                      options={{ calenderLocale: "en", valueLocale: "en" }}
                    />
                  </div>

                  <div className="flex">
                    <div className="flex flex-col gap-4">
                      <label className="font-medium" htmlFor="bill_no">
                        Bill No:
                      </label>
                      <input
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        placeholder="Enter bill number"
                        autoFocus="autofocus"
                        name="bill_no"
                        id="bill_no"
                        onChange={handleChange}
                        value={editedBill.bill_no}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="font-medium" htmlFor="voucher_no">
                      Voucher No:
                    </label>
                    <input
                      className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                      placeholder="Enter voucher number"
                      autoFocus="autofocus"
                      name="invoice_no"
                      id="invoice_no"
                      onChange={handleChange}
                      value={editedBill.invoice_no}
                    />
                  </div>
                </div>
                <div className="flex  pb-8">
                  <div className="flex gap-[250px]">
                    <div className="flex flex-col gap-4">
                      <label className="font-medium" htmlFor="vendor_name">
                        Vendor Name:
                      </label>
                      <Select
                          // options={vendors.map((vendor) => ({
                          //   value: vendor.vendor_name,
                          //   label: vendor.vendor_name,
                          // }))}
                          // onChange={(option) => handleSelectChange(option, { name: "vendor_name" })}
                          // value={
                          //   editedBill.vendor_name
                          //     ? {
                          //         value: editedBill.vendor_name,
                          //         label: editedBill.vendor_name,
                          //       }
                          //     : null
                          // }
                          placeholder="Select Vendor"
                          styles={customStyles}
                        />

                    </div>
                    <div className="flex flex-col gap-4">
                      <label className="font-medium" htmlFor="vat">
                        Vat/Pan No:
                      </label>
                      <input
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        placeholder="Enter Vat/Pan number"
                        autoFocus="autofocus"
                        name="vat_number"
                        id="vat"
                        onChange={handleChange}
                        value={editedBill.vat_number}
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <label className="font-medium" htmlFor="paid_amt">
                        Paid amount:
                      </label>
                      <input
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        placeholder="Enter paid amount"
                        autoFocus="autofocus"
                        name="paid_amount"
                        id="paid_amount"
                        onChange={handleChange}
                        value={editedBill.paid_amt}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col self-center ">
                {error && (
                  <span className="text-red-500 self-center">{error}</span>
                )}
                {renderSelectedComponent()}
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SpecificBill;
