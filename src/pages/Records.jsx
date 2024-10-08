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
import Select from "react-select";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { ADToBS } from "bikram-sambat-js";
import "nepali-datepicker-reactjs/dist/index.css";
import pending from "../assets/pending.png";
import records from "../assets/records.png";
import Vat from "../components/Vat";
import Pan from "../components/Pan10";
import NoBill from "../components/NoBill";
import { useSelector } from "react-redux";

const Records = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [bill, setBill] = useState({
    bill_no: "",
    bill_date: "",
    invoice_no: "",
    vat_number: "",
    selectedOptions: "",
    paid_amount: "",
    items: [],
  });

  const [filterOptions, setFilterOptions] = useState({
    vendor_id: "",
    dateFrom: "",
    dateTo: "",
    item_id: "",
    priceSort: "",
    billStatus: "",
    billType: "",
  });

  const [date, setDate] = useState(ADToBS(new Date().toDateString()));

  const [filteredBills, setFilteredBills] = useState([]);
  const [searchBill, setSearchBill] = useState("");
  const [error, setError] = useState("");
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [filterFormVisibility, setFilterFormVisibility] = useState(false);
  const [bills, setBills] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState("");
  // const [exports, setExport] = useState("");
  const [exports, setExport] = useState("");
  const [selectedOption, setSelectedOption] = useState("vat 0");
  // const [vatData, setVatData] = useState([]);
  // const [panData, setPanData] = useState([]);
  // const [noBillData, setNoBillData] = useState([]);


  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get(`${apiBaseUrl}/api/items`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(itemsResponse.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleDataUpdate = (data, type) => {
    switch (type) {
      case "vat":
        // setVatData(data);
        setBill((prevBill) => ({
          ...prevBill,
          items: data,
        }));
        break;
      case "pan":
        // setPanData(data);
        setBill((prevBill) => ({
          ...prevBill,
          items: data,
        }));
        break;
      case "noBill":
        // setNoBillData(data);
        setBill((prevBill) => ({
          ...prevBill,
          items: data,
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
      const response = await axios.get(`${apiBaseUrl}/api/bill/exportBill`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: `blob`,
      });

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
          <Vat
            selectedOption="vat 0"
            handleChange={handleChange}
            onDataUpdate={(data) => handleDataUpdate(data, "vat")}
          />
        );
    }
  };

  const fetchBills = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/bill`, {
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
        const vendorsResponse = await axios.get(`${apiBaseUrl}/api/vendor`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "2px solid #94a3b8" : "2px solid #D1D5DB", // Matches border-neutral-300
      borderRadius: "0.375rem",
      padding: "0.25rem 0.5rem",
      width: "100%",
      boxShadow: "none",
      "&:hover": {
        border: state.isFocused ? "2px solid #94a3b8" : "2px solid #D1D5DB",
      },
    }),
    menu: (provided) => ({
      ...provided,
      width: "100%",
    }),
    container: (provided) => ({
      ...provided,
      width: "250px",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: 150, // Adjust this as needed
      overflowY: "auto", // Ensures only the menu list scrolls
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
        selectedOptions: selectedOption,
        bill_date: bill.bill_date || date,
      };

      const response = await axios.post(`${apiBaseUrl}/api/addBill`, billData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBills((prevBills) => [...prevBills, response.data.result.resultData]);
      toast.success(`${bill.bill_no} added successfully!`);
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

  const handleFilterDateChange = (name) => (date) => {
    setFilterOptions((prev) => ({ ...prev, [name]: date }));
  };

  const applyFilters = () => {
    let filteredResults = [...bills];

    if (filterOptions.vendor_id) {
      filteredResults = filteredResults.filter(
        (bill) => bill.vendor_ID === filterOptions.vendor_id
      );
    }

    if (filterOptions.item_id) {
      filteredResults = filteredResults.filter((bill) =>
        bill.BillItems.some((item) => item.item_id === filterOptions.item_id)
      );
    }

    if (filterOptions.dateFrom && filterOptions.dateTo) {
      filteredResults = filteredResults.filter((bill) => {
        const billDate = new Date(bill.bill_date);
        return (
          billDate >= new Date(filterOptions.dateFrom) &&
          billDate <= new Date(filterOptions.dateTo)
        );
      });
    }

    if (filterOptions.priceSort) {
      filteredResults.sort((a, b) => {
        if (filterOptions.priceSort === "low-to-high") {
          return b.actual_Amount - a.actual_Amount;
        } else if (filterOptions.priceSort === "high-to-low") {
          return a.actual_Amount - b.actual_Amount;
        }
        return 0;
      });
    }

    if (filterOptions.billStatus) {
      filteredResults = filteredResults.filter(
        (bill) =>
          bill.isApproved > 0 === (parseInt(filterOptions.billStatus) === 0)
      );
    }

    if (filterOptions.billType) {
      filteredResults = filteredResults.filter(
        (bill) => bill.bill_type === filterOptions.billType
      );
    }

    setFilteredBills(filteredResults);
    setFilterFormVisibility(false);
  };

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
            <div className=" flex justify-between gap-3 mr-4 mt-3 ">
              <input
                type="text"
                placeholder="Search bills"
                value={searchBill}
                onChange={(e) => setSearchBill(e.target.value)}
                className="border-2 px-5 w-80 border-border rounded focus:outline-slate-400"
              />
              <button
                className="flex justify-center items-center w-fit px-5 py-1.5 gap-3 bg-white border-neutral-300 border-2 cursor-pointer rounded"
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

      {/* Add bill form */}
      {addFormVisibility && (
        <>
          <div className="overlay"></div>
          <form
            onSubmit={handleSubmit}
            className="flex absolute z-30 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded w-fit"
          >
            <div className="flex flex-col">
              <div className="flex justify-between ">
                <p className="font-semibold text-2xl">Add Bill</p>

                <div className="flex flex-col pb-8">
                  <div className="flex border-2 rounded-md overflow-hidden border-neutral-300 w-[370px] items-center h-fit">
                    <select
                      value={selectedOption}
                      onChange={handleBillChange}
                      className={` w-36 ${
                        selectedOption === "vat 0" ||
                        selectedOption === "vat 1.5"
                          ? "bg-blue-200"
                          : "border-neutral-300"
                      } focus:outline-none focus:border-transparent px-4 py-1`}
                    >
                      <option value="">Select VAT</option>
                      <option value="vat 0">VAT 0</option>
                      <option value="vat 1.5">VAT 1.5</option>
                    </select>
                    <div className="h-[100%] bg-neutral-300 w-1"></div>
                    <select
                      value={selectedOption}
                      onChange={handleBillChange}
                      className={` w-36 ${
                        selectedOption === "pan 0" ||
                        selectedOption === "pan 10" ||
                        selectedOption === "pan 15"
                          ? "bg-blue-200"
                          : "border-neutral-300"
                      } focus:outline-none focus:border-transparent py-1 px-4`}
                    >
                      <option value="">Select PAN</option>
                      <option value="pan 0">Pan 0</option>
                      <option value="pan 10">Pan 10</option>
                      <option value="pan 15">Pan 15</option>
                    </select>
                    <div className="h-[100%] bg-neutral-300 w-1"></div>
                    <span
                      onClick={() =>
                        handleBillChange({ target: { value: "noBill" } })
                      }
                      className={` border-neutral-300 w-80 py-1 cursor-pointer h-full ${
                        selectedOption === "noBill"
                          ? "bg-blue-200 text-black"
                          : "border-neutral-300"
                      } px-4 whitespace-nowrap`}
                    >
                      No Bill
                    </span>
                  </div>
                </div>
              </div>
              <img
                className="cursor-pointer  h-[2vh] w-[2vw] absolute -right-10 invert mb-3 "
                src={close}
                alt="close icon"
                onClick={closeAddBillForm}
              />
              <div className="flex flex-col gap-6">
                <div className="flex gap-28">
                  <div className="flex flex-col gap-3">
                    <label className="font-medium" htmlFor="bill_no">
                      Bill Date:
                    </label>
                    <NepaliDatePicker
                      inputClassName="form-control focus:outline-none"
                      className="border-2 border-neutral-300 p-2 w-[250px] pl-3 rounded-md focus:outline-slate-400"
                      value={date}
                      onChange={handleDateChange}
                      options={{ calenderLocale: "en", valueLocale: "en" }}
                      autoFocus="autofocus"
                    />
                  </div>

                  <div className="flex">
                    <div className="flex flex-col gap-3">
                      <label className="font-medium" htmlFor="bill_no">
                        Bill No:
                      </label>
                      <input
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md focus:outline-slate-400"
                        placeholder="Enter bill number"
                        autoFocus="autofocus"
                        name="bill_no"
                        id="bill_no"
                        onChange={handleChange}
                        value={bill.bill_no}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="font-medium" htmlFor="voucher_no">
                      Voucher No:
                    </label>
                    <input
                      className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md focus:outline-slate-400"
                      placeholder="Enter voucher number"
                      autoFocus="autofocus"
                      name="invoice_no"
                      id="invoice_no"
                      onChange={handleChange}
                      value={bill.invoice_no}
                    />
                  </div>
                </div>
                <div className="flex ">
                  <div className="flex gap-28">
                    <div className="flex flex-col gap-3">
                      <label className="font-medium" htmlFor="vendor_name">
                        Vendor Name:
                      </label>
                      <Select
                        options={vendors.map((vendor) => ({
                          value: vendor.vendor_name,
                          label: vendor.vendor_name,
                        }))}
                        onChange={(option) => {
                          handleSelectChange(option, { name: "vendor_name" });
                          const selectedVendor = vendors.find(
                            (v) => v.vendor_name === option.value
                          );
                          if (selectedVendor) {
                            setBill((prev) => ({
                              ...prev,
                              vendor_name: option.value,
                              vat_number: selectedVendor.vat_number || "",
                            }));
                          } else {
                            console.error(
                              "Selected vendor not found:",
                              option.value
                            );
                          }
                        }}
                        value={
                          bill.vendor_name
                            ? {
                                value: bill?.vendors?.vendor_name,
                                label: bill.vendor_name,
                              }
                            : null
                        }
                        placeholder="Select Vendor"
                        styles={customStyles}
                        menuPortalTarget={document.body}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="font-medium" htmlFor="vat_number">
                        VAT/PAN No:
                      </label>
                      <input
                        className="border-[1px] border-neutral-300  p-2 w-[250px] pl-3 rounded-md focus:outline-slate-400"
                        placeholder="Enter Vat/Pan number"
                        autoFocus="autofocus"
                        name="vat_number"
                        id="vat_number"
                        onChange={handleChange}
                        value={bill.vat_number}
                        readOnly
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="font-medium" htmlFor="paid_amt">
                        Paid amount:
                      </label>
                      <input
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md focus:outline-slate-400"
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
              <div className="flex flex-col  w-full mt-8">
                {renderSelectedComponent()}

                {error && (
                  <span className="text-red-500 justify-start">{error}</span>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button className="self-end bg-blue-600 text-white h-fit py-3 px-8 rounded-md">
                  Add Bill
                </button>
              </div>
            </div>
          </form>
        </>
      )}

      {/* filter form */}
      {filterFormVisibility && (
        <form
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white z-50 p-8  flex flex-col w-fit h-fit gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex justify-between">
            <h2 className="font-semibold text-xl"> Filtering Option</h2>
            <button type="button" className="p-2" onClick={closeFilterForm}>
              <img src={close} alt="" className="cursor-pointer w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex gap-8">
              <div className="flex flex-col gap-3">
                <label className="font-medium">By vendor:</label>
                <Select
                  options={vendors.map((vendor) => ({
                    value: vendor.vendor_name,
                    label: vendor.vendor_name,
                  }))}
                  onChange={(option) => {
                    const selectedVendor = vendors.find(
                      (v) => v.vendor_name === option.value
                    );

                    if (selectedVendor) {
                      setFilterOptions((prev) => ({
                        ...prev,
                        vendor_name: option.value,
                        vendor_id: selectedVendor.vendor_id,
                      }));
                    }
                  }}
                  value={
                    filterOptions.vendor_name
                      ? {
                          value: filterOptions.vendor_name,
                          label: filterOptions.vendor_name,
                        }
                      : null
                  }
                  placeholder="Select Vendor"
                  styles={customStyles}
                  autoFocus
                />
              </div>
              {/* Item fetching */}
              <div className="flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  By Item
                </label>
                <Select
                  options={items.map((item) => {
                    const features = Object.entries(item.itemsOnFeatures || {})
                      .filter(([key, value]) => value)
                      .map(([key, value]) => ` - ${value}`)
                      .join("");

                    const label = `${item.item_name}${features}`;

                    return {
                      value: item.item_id,
                      label: label,
                    };
                  })}
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setFilterOptions((prev) => ({
                        ...prev,
                        item_id: selectedOption.value,
                        item_name: selectedOption.label,
                      }));
                    }
                  }}
                  value={
                    filterOptions.item_id
                      ? {
                          value: filterOptions.item_id,
                          label: items.find(
                            (item) => item.item_id === filterOptions.item_id
                          )
                            ? `${
                                items.find(
                                  (item) =>
                                    item.item_id === filterOptions.item_id
                                ).item_name
                              }${Object.entries(
                                items.find(
                                  (item) =>
                                    item.item_id === filterOptions.item_id
                                ).itemsOnFeatures || {}
                              )
                                .filter(([key, value]) => value)
                                .map(([key, value]) => ` - ${value}`)
                                .join("")}`
                            : "",
                        }
                      : null
                  }
                  placeholder="Select an Item"
                  styles={customStyles}
                />
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  Bill From:
                </label>

                <NepaliDatePicker
                  inputClassName="form-control focus:outline-none"
                  className="border-2 border-neutral-300 p-2 w-[250px] pl-3 rounded-md focus:outline-slate-400"
                  onChange={handleFilterDateChange("dateFrom")}
                  value={filterOptions.dateFrom}
                  options={{ calenderLocale: "en", valueLocale: "en" }}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  Bill To:
                </label>
                <NepaliDatePicker
                  inputClassName="form-control focus:outline-none"
                  className="border-2 border-neutral-300 p-2 w-[250px] pl-3 rounded-md focus:outline-slate-400"
                  onChange={handleFilterDateChange("dateTo")}
                  value={filterOptions.dateTo}
                  options={{ calenderLocale: "en", valueLocale: "en" }}
                />
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  {" "}
                  By Price:{" "}
                </label>

                <select
                  className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                  value={filterOptions.priceSort}
                  onChange={(e) =>
                    setFilterOptions((prev) => ({
                      ...prev,
                      priceSort: e.target.value,
                    }))
                  }
                >
                  <option value="">Select an option</option>
                  <option value="high-to-low">High to Low</option>
                  <option value="low-to-high">Low to High</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  Bill Status:
                </label>
                <select
                  className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                  value={filterOptions.billStatus}
                  onChange={(e) =>
                    setFilterOptions((prev) => ({
                      ...prev,
                      billStatus: e.target.value,
                    }))
                  }
                >
                  <option value="">Stock Status</option>
                  <option value="0">Approved</option>
                  <option value="1  ">Pending</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  Bill Type:
                </label>
                <select
                  className="border-2 rounded border-neutral-300 p-2 w-[530px] focus:outline-slate-400"
                  value={filterOptions.billType}
                  onChange={(e) =>
                    setFilterOptions((prev) => ({
                      ...prev,
                      billType: e.target.value,
                    }))
                  }
                >
                  <option value="">Select Type </option>
                  <option value="VAT">VAT</option>
                  <option value="PAN">PAN</option>
                  <option value="NOBILL">No bill</option>
                </select>
              </div>
            </div>
          </div>
          <button
            className="flex bg-blue-600 text-white rounded p-3 items-center justify-center mt-3 text-lg font-medium focus:outline-blue-700"
            onClick={applyFilters}
          >
            Filter
          </button>
        </form>
      )}
      {filterFormVisibility && <div className="overlay"></div>}
    </div>
  );
};

export default Records;
