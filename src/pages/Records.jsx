import * as React from "react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import "../styles/records.css";
import close from "../assets/close.svg";
import RecordsTable from "../components/RecordsTable";
import filterIcon from "../assets/filter.svg";
import exportIcon from "../assets/export.svg";
import record from "../assets/billRecord.svg";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import pending from "../assets/pending.png";
import records from "../assets/records.png";
import Vat from "../components/Vat";
import Pan from "../components/Pan10";
import NoBill from "../components/NoBill";

const Records = () => {
  const [bill, setBill] = useState({
    bill_no: "",
    bill_date: "",
    invoice_no: "",
    vat_number: "",
    selectedOptions: "",
    paid_amount: 0,
    items: [],
  });

  const [date, setDate] = useState("");
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchBill, setSearchBill] = useState("");
  const [error, setError] = useState("");
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [filterFormVisibility, setFilterFormVisibility] = useState(false);
  const [bills, setBills] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState("");
  // const [exports, setExport] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [vatData, setVatData] = useState([]);
  const [panData, setPanData] = useState([]);
  const [noBillData, setNoBillData] = useState([]);

  const token = localStorage.getItem("token");

  const handleDataUpdate = (data, type) => {
    switch (type) {
      case "vat":
        setVatData(data);
        setBill((prevBill) => ({
          ...prevBill,
          items: data,
        }));
        break;
      case "pan":
        setPanData(data);
        setBill((prevBill) => ({
          ...prevBill,
          panItems: data,
        }));
        break;
      case "noBill":
        setNoBillData(data);
        setBill((prevBill) => ({
          ...prevBill,
          noBillItems: data,
        }));
        break;
      default:
        console.error("Unknown data type:", type);
    }
  };

  const handleBillChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    setBill((prevBill) => ({
      ...prevBill,
      selectedOptions: value,
    }));
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8898/api/bill/exportBill",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "bills.xlsx";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      console.log("File saved successfully!");
    } catch (error) {
      console.error("Error downloading the file:", error.message);
    }
  };

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case "vat 0":
      case "vat 1.5":
        return (
          <Vat
            selectedOption={selectedOption}
            handleChange={handleChange}
            onDataUpdate={(data) => handleDataUpdate(data, "vat")}
          />
        );
      case "pan 0":
      case "pan 10":
      case "pan 15":
        return (
          <Pan
            selectedOption={selectedOption}
            handleChange={handleChange}
            onDataUpdate={(data) => handleDataUpdate(data, "pan")}
          />
        );
      case "noBill":
        return (
          <NoBill
            handleChange={handleChange}
            onDataUpdate={(data) => handleDataUpdate(data, "noBill")}
          />
        );
      default:
        return (
          <div className="text-red-500">Please select the type of Bill</div>
        );
    }
  };

  const fetchBills = async () => {
    try {
      const response = await axios.get("http://localhost:8898/api/bill", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBills(response.data.bill || []);
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

        setItems(itemsResponse.data);

        console.log(vendorsResponse);
        setVendors(vendorsResponse.data.vendor);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

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

  const openAddBillForm = () => {
    setAddFormVisibility(true);
  };

  const displayFilterForm = () => {
    setFilterFormVisibility(true);
  };

  const closeFilterForm = () => {
    setFilterFormVisibility(false);
  };

  const closeAddBillForm = () => {
    setError("");
    setAddFormVisibility(false);
    setBill({
      bill_ID: "",
      bill_no: "",
      bill_date: "",
      invoice_no: "",
      vat_number: "",
      vendor_name: "",
      paid_amt: "",
      items: [],
    });
  };

  const handleChange = (e) => {
    setBill((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (event) => {
    const date = event;
    setBill((prev) => ({ ...prev, bill_date: date }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const billData = {
        ...bill,
        selectedOptions: selectedOption, // Include the selectedOption
        items: vatData,
        panItems: panData,
        noBillItems: noBillData,
      };

      const response = await axios.post(
        "http://localhost:8898/api/addBill",
        billData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBills((prevBills) => [...prevBills, response.data.result.bill]);
      toast.success(`${bill.bill_no} Added Successfully!`);
      closeAddBillForm();
    } catch (error) {
      console.error("Error adding bill:", error);
      setError(
        error.response?.data?.error || "An error occurred while adding the bill"
      );
    }
  };

  useEffect(() => {
    const filterBills = () => {
      const searchBillNumber = parseInt(searchBill, 10);
      if (!isNaN(searchBillNumber)) {
        const newFilteredBills = bills.filter((bill) =>
          bill.bill_no.toString().includes(searchBillNumber.toString())
        );
        setFilteredBills(newFilteredBills);
      } else {
        setFilteredBills(bills);
      }
    };
    filterBills();
  }, [searchBill, bills]);

  return (
    <div className="records">
      <Sidebar />
      <div className="records-main">
        <Topbar />
        {/* summary section */}
        <div className="flex flex-col w-[85.5vw]  bg-white rounded-lg p-3 gap-3">
          <h1 className="flex text-lg font-bold m-3">Bill Summary</h1>
          <div className="flex justify-around">
            <div className="flex flex-col items-center justify-center gap-2">
              <img src={records} alt="number of bills" className="h-8 w-8" />
              <h4>{bills.length}</h4>
              <p className="font-medium">Number of Records</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <img src={pending} alt="number of bills" className="h-8 w-8" />
              <h4>5</h4>
              <p className="font-medium">Pending payments</p>
            </div>
          </div>
        </div>
        <div className="records-container">
          <div className="top">
            <div className="container-title">
              <p className="text-lg font-bold m-1">Bill Records</p>
            </div>
            <div className=" flex justify-between gap-3 mr-4 mt-3">
              <input
                type="text"
                placeholder="Search bills"
                value={searchBill}
                onChange={(e) => setSearchBill(e.target.value)}
                className="border-2 px-5 w-80 border-border rounded"
              />
              <button
                className="flex bg-transparent border h-fit py-2 border-border px-6  w-fit justify-center items-center rounded gap-4"
                aria-label="Menu"
                onClick={displayFilterForm}
              >
                <img src={filterIcon} alt="filter icon" />
                Filter
              </button>
              <button
                className="flex bg-transparent border-2 h-fit py-1.5 border-green-500 px-6 text-green-600 font-regular  w-fit justify-center items-center rounded gap-2"
                aria-label="Menu"
                onClick={handleExport}
              >
                <img src={exportIcon} alt="export icon" className="h-6 w-6" />
                Export
              </button>
              <button
                onClick={openAddBillForm}
                className="flex bg-blue-500 px-6  w-fit h-fit py-2 justify-center items-center rounded text-white"
              >
                Add Bill
              </button>
            </div>
          </div>
          <RecordsTable bills={filteredBills} />
        </div>
      </div>
      {addFormVisibility && (
        <>
          <div className="overlay"></div>
          <form
            onSubmit={handleSubmit}
            className="flex absolute z-30 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded w-fit"
          >
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-center ">
                <p className="font-semibold text-xl">Add Bill</p>
                <img
                  className="cursor-pointer  h-[2vh] w-[2vw]"
                  src={close}
                  alt="close icon"
                  onClick={closeAddBillForm}
                />
              </div>
              <div className=" gap-16">
                <div className="flex flex-col pb-8">
                  <h1 className="font-medium pb-4">Select the type of Bill</h1>
                  <div className="flex border-2 rounded-md border-neutral-300 w-[378px] items-center">
                    <select
                      value={selectedOption}
                      onChange={handleBillChange}
                      className={`rounded w-[200px]  ${
                        selectedOption === "vat 0" ||
                        selectedOption === "vat 1.5"
                          ? "bg-green-300"
                          : "border-neutral-300"
                      } focus:outline-none focus:border-transparent px-4 py-3`}
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
                      } focus:outline-none focus:border-transparent py-3 px-4`}
                    >
                      <option value="" disabled>
                        Select PAN
                      </option>
                      <option value="pan 0">Pan 0</option>
                      <option value="pan 10">Pan 10</option>
                      <option value="pan 15">Pan 15</option>
                    </select>
                    <span
                      onClick={() =>
                        handleBillChange({ target: { value: "noBill" } })
                      }
                      className={` rounded w-[200px] py-3 ${
                        selectedOption === "noBill"
                          ? "bg-red-300 text-white"
                          : "border-neutral-300"
                      } px-4 whitespace-nowrap`}
                    >
                      No Bill
                    </span>
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
                      value={date}
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
                        value={bill.bill_no}
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
                      value={bill.invoice_no}
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
                        options={vendors.map((vendor) => ({
                          value: vendor.vendor_name,
                          label: vendor.vendor_name,
                        }))}
                        onChange={(option) =>
                          handleSelectChange(option, { name: "vendor_name" })
                        }
                        value={
                          bill.vendor_name
                            ? {
                                value: bill.vendor_name,
                                label: bill.vendor_name,
                              }
                            : null
                        }
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
                        value={bill.vat}
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
                        value={bill.paid_amount}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col self-center ">
                {renderSelectedComponent()}

                {error && (
                  <span className="text-red-500 self-center">{error}</span>
                )}
              </div>
            </div>
          </form>
        </>
      )}
      {filterFormVisibility && (
        <form className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white z-50 p-8  flex flex-col w-fit h-fit gap-4">
          <div className="flex justify-between">
            <h2 className="font-semibold text-xl"> Select Filtering Option</h2>
            <button
              type="button"
              className="discard-btn"
              onClick={closeFilterForm}
            >
              <img src={close} alt="" />
            </button>
          </div>
          <label>Select Category</label>
          <div className="flex gap-6"></div>
          <label>Select Date:</label>
          <div className="flex gap-6">
            <input
              className="border-2  border-neutral-200 p-1.5 rounded-md w-[14.4vw]"
              type="date"
              placeholder=" from"
            />
            <input
              className="border-2 border-neutral-200 p-1.5 rounded-md w-[14.4vw]"
              type="date"
              placeholder="to"
            />
          </div>
        </form>
      )}
      {filterFormVisibility && <div className="overlay"></div>}
    </div>
  );
};

export default Records;
