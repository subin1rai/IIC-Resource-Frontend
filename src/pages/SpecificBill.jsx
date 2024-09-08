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
import { ADToBS } from "bikram-sambat-js";
import "nepali-datepicker-reactjs/dist/index.css";
import Select from "react-select";
import Vat from "../components/Vat";
import Pan from "../components/Pan10";
import NoBill from "../components/NoBill";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const SpecificBill = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [bill, setBill] = useState({
    bill_no: "",
    bill_date: "",
    invoice_no: "",
    vendor_name: "",
    vat_number: "",
    selectedOptions: "",
    paid_amount: "",
    items: [],
  });

  const [editedBill, setEditedBill] = useState({
    bill_no: "",
    bill_date: "",
    invoice_no: "",
    vendor_name: "",
    vat_number: "",
    selectedOptions: "",
    paid_amount: "",
    items: [],
  });

  const [date, setDate] = useState(ADToBS(new Date().toDateString()));

  const [addFormVisibility, setEditBillDetailsFormVisibility] = useState(false);
  const [declineFormVisibility, setDeclineFormVisibility] = useState(false);
  const [billDetails, setBillDetails] = useState({});
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  // billDetails.bill_type + " " + billDetails.TDS
  const [remark, setRemark] = useState("");

  console.log(selectedOption);

  const handleDataUpdate = (data, type) => {
    switch (type) {
      case "vat":
        // setVatData(data);
        setEditedBill((prevBill) => ({
          ...prevBill,
          items: data,
        }));
        break;
      case "pan":
        console.log(data);
        // setPanData(data);
        setEditedBill((prevBill) => ({
          ...prevBill,
          items: data,
        }));
        break;
      case "NOBILL":
        // setNoBillData(data);
        setEditedBill((prevBill) => ({
          ...prevBill,
          items: data,
        }));
        break;
      default:
        console.error("Unknown data type:", type);
    }
  };

  const { bill_id } = useParams();

  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo.token;

  console.log(token);
  // please dont remove this

  const role = userInfo.user_role;

  const handleShowModal = (bill_id) => {
    Swal.fire({
      title: "Are you sure you want to approve this bill?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        handleApprove(bill_id);
        Swal.fire("Approved!", "This bill has been approved.", "success");
      }
    });
  };

  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/approveBill/${bill_id} `,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBillDetails((prev) => ({
        ...prev,
        bill: {
          ...prev.bill,
          isApproved: true,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  console.log(billDetails);
  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case "vat 0":
      case "vat 1.5":
        return (
          <Vat
            billDetails={billDetails}
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
            billDetails={billDetails}
            selectedOption={selectedOption}
            handleChange={handleChange}
            onDataUpdate={(data) => handleDataUpdate(data, "pan")}
          />
        );
      case "NOBILL":
        return (
          <NoBill
            billDetails={billDetails}
            selectedOption={selectedOption}
            handleChange={handleChange}
            onDataUpdate={(data) => handleDataUpdate(data, "NOBILL")}
          />
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
    control: (provided, state) => ({
      ...provided,
      width: "250px",
      borderRadius: "4px",
      border: state.isFocused ? "2px solid #94a3b8" : "2px solid #e5e5e5",
      borderColor: "#d1d5db",
      boxShadow: "none",
      minHeight: "41px",
      color: "black",
      "&:hover": {
        border: state.isFocused ? "2px solid #94a3b8" : "2px solid #e5e5e5",
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
            axios.get(`${apiBaseUrl}/api/singleBill/${bill_id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            axios.get(`${apiBaseUrl}/api/items`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            axios.get(`${apiBaseUrl}/api/vendor`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        setBillDetails(singleBillResponse.data);
        console.log(singleBillResponse.data.bill);

        console.log(
          "My billitem: ",
          singleBillResponse.data.bill.BillItems[0].TDS
        );

        if (singleBillResponse.data.bill.bill_type === "NOBILL") {
          setSelectedOption("NOBILL");
        } else {
          setSelectedOption(
            singleBillResponse.data?.bill.bill_type.toLowerCase() +
              " " +
              singleBillResponse.data.bill.BillItems[0].TDS
          );
        }

        console.log(selectedOption);

        setItems(itemsResponse.data);
        setVendors(vendorsResponse.data.vendor);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error.response?.data?.error);
        setLoading(false);
      }
    };
    fetchData();
  }, [bill_id, token]);

  // const checkPermissions = () => {
  //   const role = localStorage.getItem("role");
  //   if (role != "superadmin" || role !="admin") {
  //     console.error("Unauthorized cfgdgg");
  //   }
  // };

  const openEditBillDetailsForm = () => {
    // setEditedBill({
    //   bill_no: billDetails.bill_no || "",
    //   bill_date: billDetails.bill_date ? formatDate(billDetails.bill_date) : "",
    //   voucher_no: billDetails.invoice_no || "",
    //   vendor_name: billDetails.vendors?.vendor_name || "",
    //   item_name: billDetails.items?.item_name || "",
    //   quantity: billDetails.quantity || "",
    //   unit_price: billDetails.unit_price || "",
    //   tds: billDetails.TDS || "",
    //   amount: billDetails.amount || "",
    //   paid_amt: billDetails.paid_amount || "",
    //   pending_amt: billDetails.vendors?.pending_payment || "",
    // });
    setEditBillDetailsFormVisibility(true);
  };

  const closeEditBillDetailsForm = () => {
    setEditBillDetailsFormVisibility(false);
  };

  const openDeclineForm = () => {
    setDeclineFormVisibility(true);
  };

  const closeDeclineForm = () => {
    setDeclineFormVisibility(false);
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
    setSelectedOption(value);
    setBill((prevBill) => ({
      ...prevBill,
      selectedOptions: value,
      items: value === "NOBILL" ? [] : prevBill.items,
    }));
    if (value === "NOBILL") {
      setEditedBill((prevEditedBill) => ({
        ...prevEditedBill,
        items: [],
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const dataToSubmit = {
        ...editedBill,
        selectedOption: selectedOption,
        bill_date: bill.bill_date || date,
      };

      // Handle NOBILL case specifically
      // if (selectedOption === "NOBILL") {
      //   dataToSubmit.items = [];
      // }
      const response = await axios.put(
        `${apiBaseUrl}/api/updateBill/${bill_id}`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the bill state with the response data
        setBillDetails(response.data.result);
        closeEditBillDetailsForm();
      } else {
        console.error("Failed to update the bill:", response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchSingleBill = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${apiBaseUrl}/api/singleBill/${bill_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEditedBill({
          bill_no: response.data.bill.bill_no || "",
          bill_date: response.data.bill.bill_date
            ? formatDate(response.data.bill.bill_date)
            : "",
          invoice_no: response.data.bill.invoice_no || "",
          vendor_name: response.data.bill.vendors?.vendor_name || "",
          vat_number: response.data.bill?.vendors?.vat_number || "",
          selectedOptions: response.data.bill.selectedOptions || "",
          paid_amount: response.data.bill.paid_amount || 0,
          items: response.data.bill.items || [],
        });
        setLoading(false);
        console.log(response);
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

  //  for nepali date
  const nepaliMonthsInEnglish = [
    "Baisakh",
    "Jestha",
    "Ashadh",
    "Shrawan",
    "Bhadra",
    "Ashwin",
    "Kartik",
    "Mangsir",
    "Poush",
    "Magh",
    "Falgun",
    "Chaitra",
  ];

  function getNepaliMonth(dateString) {
    const [datePart] = dateString.split("T");
    const [year, month, day] = datePart.split("-");
    const monthIndex = parseInt(month, 10) - 1;
    return `${nepaliMonthsInEnglish[monthIndex]} ${day}, ${year}`;
  }

  // nepali date ends here

  const handleDecline = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/declineBill/${bill_id}`,
        { remark },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRemark("");
      setDeclineFormVisibility(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex bg-background h-screen w-screen ">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto">
        <Topbar />

        <div className="bg-white w-[99%] mx-auto h-50 flex flex-col p-5  rounded-md ">
          <div className="flex justify-between items-center ml-2">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Link to="/records" className="text-base">
                  Bill Records
                </Link>
                <img src={front} alt="arrow" />
                <h4 className="text-base text-blue-400">
                  {billDetails?.bill?.bill_no}
                </h4>
              </div>
              <h2 className="font-semibold text-2xl">
                {billDetails?.bill?.bill_no}
              </h2>
            </div>

            <div className="flex gap-3">
              {role === "admin" && billDetails?.bill?.isApproved ? (
                <></>
              ) : (
                <button
                  onClick={openEditBillDetailsForm}
                  className="flex justify-end bg-blue-600 px-6 py-3 h-fit w-fit rounded font-medium text-white "
                >
                  Edit Bill
                </button>
              )}

              {role === "admin" || billDetails?.bill?.isApproved ? (
                <></>
              ) : (
                <button
                  className="bg-red-500 px-6 rounded text-white font-medium py-3"
                  onClick={openDeclineForm}
                >
                  Decline Bill
                </button>
              )}

              {role === "admin" || billDetails?.bill?.isApproved ? (
                <></>
              ) : (
                <button
                  className="bg-green-500 px-6 rounded text-white font-medium py-3"
                  onClick={handleShowModal}
                >
                  Approve Bill
                </button>
              )}
            </div>
          </div>
          <div className="h-[2px] w-[99%] bg-neutral-300 mx-auto mt-5"></div>
          {!loading ? (
            <div className="flex justify-between w-[75%] pb-3">
              <div className="flex flex-col gap-5 mt-7 pl-9">
                <p className="font-semibold">
                  Bill Date:
                  <span className="font-normal  pl-4">
                    {formatDate(billDetails?.bill?.bill_date) || "--"}
                  </span>
                </p>
                {/* <p className="font-semibold">
                  Vendor Name:
                  <span className=" pl-4">
                    {billDetails.vat_no || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Vat No:
                  <span className=" pl-4">
                    {billDetails.vat_no || "--"}
                  </span>
                </p> */}
                <p className="font-semibold">
                  Vendor Name:
                  <span className=" font-normal pl-4">
                    {billDetails?.vendor_name || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Vat/Pan No:
                  <span className="font-normal  pl-4">
                    {billDetails?.bill?.vendors?.vat_number || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Voucher No:
                  <span className="font-normal  pl-4">
                    {billDetails?.bill?.invoice_no || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Approved Status:
                  <span className="font-normal  pl-4">
                    {billDetails?.bill?.isApproved ? (
                      <span className="text-green-600  bg-green-100 p-2 px-4 rounded-md">
                        Approved
                      </span>
                    ) : (
                      (
                        <span className="text-yellow-600  bg-yellow-100 p-2 px-4 rounded-md">
                          Pending
                        </span>
                      ) || "--"
                    )}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-5 mt-7 pl-9">
                <p className="font-semibold">
                  TDS:
                  <span className="font-normal  pl-4">
                    {billDetails?.TDS || 0}
                  </span>
                </p>
                <p className="font-semibold">
                  Bill Amount:
                  <span className="font-normal  pl-4">
                    {billDetails?.bill?.actual_Amount || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Paid Amount:
                  <span className="font-normal  pl-4">
                    {billDetails?.bill?.paid_amount || 0}
                  </span>
                </p>
                <p className="font-semibold">
                  Pending Amount
                  <span className="font-normal  pl-4">
                    {billDetails?.bill?.left_amount || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Payment Status:
                  <span className="font-normal  pl-4">
                    {billDetails?.bill?.left_amount > 0 ? (
                      <span className="text-yellow-600 bg-yellow-100 p-2 px-4 rounded-md">
                        Pending
                      </span>
                    ) : (
                      (
                        <span className="text-green-600 bg-green-100 p-2 px-4 rounded-md">
                          Complete{" "}
                        </span>
                      ) || "--"
                    )}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
          <div className="h-[2px] w-[99%] bg-neutral-300 mx-auto mt-5"></div>
          <p className="font-bold text-xl py-6 px-2">Items</p>
          <table className="min-w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-neutral-200">
                <th className="p-2 text-center border-b border-neutral-200 font-medium">
                  S.No.
                </th>
                <th className="p-2 text-center border-b  border-neutral-200 font-medium">
                  Item Name
                </th>
                <th className="p-2 text-center border-b  border-neutral-200 font-medium">
                  Quantity
                </th>
                <th className="p-2 text-center border-b  border-neutral-200 font-medium">
                  Unit Price
                </th>
                <th className="p-2 text-center border-b  border-neutral-200 font-medium">
                  Vat Amount
                </th>
                <th className="p-2 text-center border-b  border-neutral-200 font-medium">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
              billDetails?.bill?.BillItems &&
              billDetails?.bill?.BillItems.length > 0 ? (
                billDetails?.bill?.BillItems.map((billItem, index) => (
                  <tr key={index}>
                    <td className="p-2 text-center border-b border-neutral-200">
                      {index + 1}
                    </td>
                    <td className="p-2 text-center border-b border-neutral-200">
                      {billItem.item.item_name}
                    </td>
                    <td className="p-2 text-center border-b border-neutral-200">
                      {billItem.quantity}
                    </td>
                    <td className="p-2 text-center border-b border-neutral-200">
                      {billItem.unit_price}
                    </td>
                    <td className="p-2 text-center border-b border-neutral-200">
                      {billItem.withVATAmount}
                    </td>
                    <td className="p-2 text-center border-b border-neutral-200">
                      {billItem.total_Amount}
                    </td>

                    {/* <td className="p-2 border-b border-neutral-200">{billItem.TDS_deduct_amount}</td>
        <td className="p-2 border-b border-neutral-200">{billItem.withVATAmount}</td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-2 text-center border-b border-gray-300"
                  >
                    No bill items available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {!loading && declineFormVisibility && (
        <>
          <div className="h-screen w-screen bg-overlay absolute "></div>
          <form
            onSubmit={handleDecline}
            className="flex absolute z-30 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 rounded "
          >
            <div className="flex flex-col gap-4">
              <p className="font-semibold flex justify-between items-center text-xl ">
                Send Remarks
                <img
                  className="cursor-pointer h-4 w-4 "
                  src={close}
                  alt="close button"
                  onClick={closeDeclineForm}
                />
              </p>
              <div className="flex flex-col"></div>

              <div className="flex gap-3">
                <label className="font-medium text-md">Remarks:</label>
                <textarea
                  rows={5}
                  cols={40}
                  name="remarks"
                  placeholder="Enter your remarks here..."
                  className="border-stone-200 border-2 rounded py-2 px-4 w-[100%] focus:outline-slate-400 resize-none"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button className="self-end bg-blue-600 text-white h-fit py-3 px-8 rounded-md">
                  Done
                </button>
              </div>
            </div>
          </form>
        </>
      )}

      {!loading && addFormVisibility && (
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
                <div className="flex flex-col">
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
                        handleBillChange({ target: { value: "NOBILL" } })
                      }
                      className={` border-neutral-300 w-80 py-1 cursor-pointer h-full ${
                        selectedOption === "NOBILL"
                          ? "bg-blue-200 text-black"
                          : "border-neutral-300"
                      } px-4 whitespace-nowrap`}
                    >
                      No Bill
                    </span>
                  </div>
                </div>
                <img
                  className="cursor-pointer  h-[2vh] w-[2vw] absolute -right-10 invert mb-3 "
                  src={close}
                  alt="close icon"
                  onClick={closeEditBillDetailsForm}
                />
              </div>
              {/* form div */}
              <div className=" flex flex-col gap-6">
                <div className="flex gap-28">
                  <div className="flex flex-col gap-3">
                    <label className="font-medium" htmlFor="bill_no">
                      Bill Date:
                    </label>
                    <NepaliDatePicker
                      inputClassName="form-control focus:outline-none"
                      className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md "
                      value={editedBill.bill_date}
                      onChange={handleDateChange}
                      options={{ calenderLocale: "en", valueLocale: "en" }}
                      autoFocus="autofocus"
                    />
                  </div>

                  <div className="flex">
                    <div className="flex flex-col gap-4">
                      <label className="font-medium" htmlFor="bill_no">
                        Bill No:
                      </label>
                      <input
                        type="number"
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md  focus:outline-slate-400"
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
                      type="number"
                      className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md  focus:outline-slate-400"
                      placeholder="Enter voucher number"
                      autoFocus="autofocus"
                      name="invoice_no"
                      id="invoice_no"
                      onChange={handleChange}
                      value={editedBill.invoice_no}
                    />
                  </div>
                </div>
                <div className="flex">
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
                            setEditedBill((prev) => ({
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
                          editedBill.vendor_name
                            ? {
                                value: editedBill.vendor_name,
                                label: editedBill.vendor_name,
                              }
                            : null
                        }
                        placeholder="Select Vendor"
                        styles={{
                          ...customStyles,
                          menuPortal: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                          menuList: (provided) => ({
                            ...provided,
                            maxHeight: 150,
                            overflowY: "auto",
                          }),
                        }}
                        menuPortalTarget={document.body}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="font-medium" htmlFor="vat_number">
                        VAT/PAN No:
                      </label>
                      <input
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md  focus:outline-slate-400"
                        placeholder="Enter Vat/Pan number"
                        autoFocus="autofocus"
                        name="vat_number"
                        id="vat_number"
                        onChange={handleChange}
                        value={editedBill.vat_number}
                        readOnly
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <label className="font-medium" htmlFor="paid_amt">
                        Paid amount:
                      </label>
                      <input
                        className="border-[1px] border-neutral-300 p-2 w-[250px] pl-3 rounded-md  focus:outline-slate-400"
                        placeholder="Enter paid amount"
                        name="paid_amount"
                        id="paid_amount"
                        onChange={handleChange}
                        value={editedBill?.paid_amount}
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
              <div className="flex justify-end mt-4">
                <button className="self-end bg-blue-600 text-white h-fit py-3 px-8 rounded-md">
                  Edit Bill
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SpecificBill;
