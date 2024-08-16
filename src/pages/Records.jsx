import * as React from "react";
import { useEffect, useState,} from "react";
import Sidebar from "../components/Sidebar";
import {useNavigate} from "react-router-dom";
import Topbar from "../components/Topbar";
import "../styles/records.css";
import close from "../assets/close.svg";
import RecordsTable from "../components/RecordsTable";
import filterIcon from "../assets/filter.svg";
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
    vendor_name: "",
    item_name: "",
    unit_price: "",
    quantity: "",
    amount: "",
    tds: "",
    amtAfterTds: "",
    vat: "",
    amountWithVat: "",
  });
  
  const [date, setDate] = useState("");
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchBill, setSearchBill] = useState("");

  const [error, setError] = useState("");
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [filterFormVisibility, setFilterFormVisibility] = useState(false);
  const [bills, setBills] = useState([]);
  const [vendors, setVendors] = useState("");
  const [items, setItems] = useState("");

  const [selectedOption, setSelectedOption] = useState('');

  const handleBillChange = (event) => {
    const value = event.target.value;
    console.log('Selected option:', value); // Debugging output
    setSelectedOption(value);
};

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case 'vat0':
      case 'vat1.5':
        return <Vat selectedOption={selectedOption} />;
      
      case 'pan0':
      case 'pan10':
      case 'pan15':
        return <Pan selectedOption={selectedOption} />;
      
      case 'noBill':
        return <NoBill selectedOption={selectedOption} />;
      
      default:
        return <div className="text-red-500">Please select the type of Bill</div>;
    }
  };
  

  const token = localStorage.getItem("token");

  const fetchBills = async () => {
    try {
      const response = await axios.get("http://localhost:8898/api/bill", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);
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

        setItems(itemsResponse.data);
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
        [name]: option.value, // Update the appropriate field in the bill
    }));
};

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
        setVendors(vendorsResponse.data.vendor);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

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
      bill_no: "",
      bill_date: "",
      invoice_no: "",
      vendor_vat: "",
      vendor_name: "",
      item_name: "",
      unit_price: "",
      quantity: "",
      tds: "",
      amtAfterTds: "",
      vat: "",
      amountWithVat: "",
    });
  };

  const handleChange = (e) => {
    setBill((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (event) => {
    console.log("Event:", event);
    const date = event;
    console.log("Selected date:", date);
    setBill((prev) => ({ ...prev, bill_date: date }));
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

      console.log(response.data.result.newBill);

      setBills((prevBills) => [...prevBills, response.data.result.newBill]);
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
            {/* number of vendor summary */}
            <div className="flex flex-col items-center justify-center gap-2">
              <img src={records} alt="number of bills" className="h-8 w-8" />
              <h4>{bills.length}</h4>
              <p className="font-medium">Number of Records</p>
            </div>
            {/* number of  */}
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
          <form onSubmit={handleSubmit} 
          className="flex absolute z-30 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded ">
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
                <div className="flex border-2 rounded-md border-neutral-300 w-[378px]">
                <select value={selectedOption} onChange={handleBillChange}
                className={`rounded w-[200px] h-10 ${(selectedOption === 'vat0' || selectedOption === 'vat1.5') ? 'bg-green-300' : 'border-neutral-300' } focus:outline-none focus:border-transparent px-4`}>
                  <option value="" disabled >Select VAT</option>
                  <option value="vat0">VAT 0</option>
                  <option value="vat1.5">VAT 1.5</option>
                </select>
                <select value={selectedOption} onChange={handleBillChange}  
                className={` rounded w-[200px] ${(selectedOption === 'pan0' || selectedOption === 'pan10' || selectedOption === 'pan15') ? 'bg-yellow-300' : 'border-neutral-300'} focus:outline-none focus:border-transparent px-4`} >
                  <option value="" disabled >Select PAN</option>
                  <option value="pan0">Pan 0</option>
                  <option value="pan10">Pan 10</option>
                  <option value="pan15">Pan 15</option>
                </select>
                <button onClick={() => handleBillChange({ target: { value: 'noBill' } })}  className={` rounded w-[200px] ${selectedOption === 'noBill' ? 'bg-red-300 text-white' : 'border-neutral-300'} px-4 whitespace-nowrap`}>
                  No Bill
                </button>
                  </div>
                  </div>
                
                  <div className="flex gap-16 pb-8">
                  <div className="flex flex-col">
              <label className="font-medium" htmlFor="bill_no">Bill Date:</label>
              <NepaliDatePicker
                        inputClassName="form-control"
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        value={date}
                        onChange={handleDateChange}
                        options={{ calenderLocale: "en", valueLocale: "en" }}
                      />

                      </div>

                  <div className="flex">
                  <div className="flex flex-col">
              <label className="font-medium" htmlFor="bill_no">Bill No:</label>
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
            
                      <div className="flex flex-col">
                    <label className="font-medium" htmlFor="bill_no">Voucher No:</label>
                      <input
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        placeholder="Enter voucher number"
                        autoFocus="autofocus"
                        name="bill_no"
                        id="bill_no"
                        onChange={handleChange}
                        value={bill.voucher_no}
                      />
                      </div>  
                  </div>
                  </div>
                  <div className="flex gap-16">
                  <div className="flex flex-col">
              <label className="font-medium" htmlFor="bill_no">Vendor Name:</label>
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
            <div className="flex flex-col">
              <label className="font-medium" htmlFor="bill_no">Vat No:</label>
                      <input
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md"
                        placeholder="Enter vat number"
                        autoFocus="autofocus"
                        name="bill_no"
                        id="bill_no"
                        onChange={handleChange}
                        value={bill.vat_number}
                      />
                      </div>  
                  </div>
              </div>
              <div>
                  {renderSelectedComponent()}
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
          <div className="flex gap-6">
           
          </div>
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
      {/* <ToastContainer pauseOnHover theme="light" /> */}
    </div>
  );
};

export default Records;
