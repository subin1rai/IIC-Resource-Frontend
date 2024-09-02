import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import close from "../assets/close.svg";
import filterIcon from "../assets/filter.svg";
import Select from "react-select";
import IssueTable from "../components/IssueTable";
import issuesno from "../assets/issuesno.png";
import pendingreq from "../assets/pendingreq.png";
import add from "../assets/addIcon.svg";
import remove from "../assets/removeIcon.svg";
import { ToastContainer, toast } from "react-toastify";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import axios from "axios";

const Issue = () => {
  const [issue, setIssue] = useState({
    issue_date:"",
    issued_to: "",
    purpose: "",
    items: [],
  });

  const [date, setDate] = useState("");
  const [issues, setIssues] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [filterFormVisibility, setFilterFormVisibility] = useState(false);
  const [addIssueVisibility, setAddIssueVisibility] = useState(false);
  const [itemFields, setItemFields] = useState([{ item: "", quantity: "" }]);
  const [itemOptions, setItemOptions] = useState([]);

  const displayFilterForm = () => {
    setFilterFormVisibility(true);
  };

  const closeFilterForm = () => {
    setFilterFormVisibility(false);
  };

  const openAddIssueForm = () => {
    setAddIssueVisibility(true);
  };

  const closeAddIssueForm = () => {
    setAddIssueVisibility(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formattedItems = itemFields.map((field) => ({
        item_name: field.item, // Mapping 'item' to 'item_name'
        quantity: field.quantity,
      }));

      const issueData = {
        issue_date: issue.issue_date,

        issued_to: issue.issued_to,
        purpose: purpose,  // Purpose is set separately
        items: formattedItems,  // Add the formatted items array
      };

      const response = await axios.post(
        "http://localhost:8898/api/addIssue",
        issueData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Sending data:", issueData);
      console.log(issues);
      const newIssue = response.data.issues;
      const formattedNewIssue = {
        issue_id: newIssue.id,
        issue_date: newIssue.issue_Date,
        issue_item: formattedItems.map(item => item.item_name).join(', '),
        item_quantity: formattedItems.reduce((sum, item) => sum + Number(item.quantity), 0),
        requested_by: newIssue.issued_to,
        department: newIssue.department || 'N/A', 
        issued_by: newIssue.approved_by || 'N/A', 
        status: newIssue.status || 'Dispatched', 
        remarks: newIssue.purpose || 'N/A',
      };
  
      setIssues((prevIssues) => [...prevIssues, formattedNewIssue]);
      closeAddIssueForm();
      toast.success(`Items issued to ${issue.issued_to} successfully `);
      setItemFields([{ item: "", quantity: "" }]);
    } catch (error) {
      console.error("Error adding issue:", error);
      toast.error("Failed to add issue!");
    }
  };

  const handleItemChange = (index, field, value) => {
    const newFields = [...itemFields];
    newFields[index][field] = value;
    setItemFields(newFields);
  };

  const handleChange = (e) => {
    setIssue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addItemField = () => {
    if (itemFields.length < itemOptions.length) {
      setItemFields([...itemFields, { item: "", quantity: "" }]);
    }
  };

  const removeItemField = (index) => {
    if (itemFields.length > 1) {
      const newFields = itemFields.filter((_, i) => i !== index);
      setItemFields(newFields);
    }
  };
  const handleDateChange = (event) => {
    const date = event;
    setIssue((prev) => ({ ...prev, issue_date: date }));
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      alignSelf: "end",
      border: state.isFocused ? "2px solid #94a3b8" : "2px solid #e5e5e5",
      borderRadius: "4px",
      boxShadow: "none",
      minHeight: "46px",
      "&:hover": {
        border: state.isFocused ? "2px solid #94a3b8" : "2px solid #e5e5e5",
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
      width: "100px",
      margin: "0px",
      color: "black",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#757575",
    }),
    container: (provided) => ({
      ...provided,
      width: "250px",
      color: "black",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
      color: "black",
    }),
  };

  const token = localStorage.getItem("token");

  // get issue from backend
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/issue", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setIssues(response.data.issue || []);
      } catch (error) {
        console.error("Error fetching issues:", error);
        setIssues([]);
      }
    };
    fetchIssues();
  }, [token]);

  console.log(issues);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsResponse = await axios.get(
          "http://localhost:8898/api/items",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const options = itemsResponse.data.map((item) => ({
          value: item.item_name,
          label: item.item_name,
        }));
        setItemOptions(options);
        setItems(itemsResponse.data);
      } catch (error) {
        console.error("Error fetching items:", error);
        setItemOptions([]);
      }
    };

    fetchItems();
  }, [token]);

  return (
    <div className="w-screen h-screen flex justify-between bg-background">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto  items-center">
        <Topbar />

        <div className="flex flex-wrap w-[87vw] gap-5 justify-center">
          <div className="bg-white w-[85.5vw] rounded-lg flex flex-col justify-between p-3 gap-3">
            <h3 className="flex text-lg font-bold m-3">Issue Summary</h3>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={issuesno} alt="" />
                <h4>5</h4>
                <p className="font-medium">Number of categories</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={pendingreq} alt="" />
                <h4>5</h4>
                <p className="font-medium">Number of items</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[85.5vw] bg-white p-6 rounded">
          <div className="flex justify-between w-fill">
            <div className="flex font-bold text-lg">Issue</div>

            <div className="flex gap-6">
              <button
                onClick={displayFilterForm}
                className="border flex items-center gap-4 border-border px-4 py-2 rounded"
              >
                <img src={filterIcon} alt="" />
                Filter
              </button>
              <button
                className="bg-blue-600 text-white py-2 px-3 rounded"
                onClick={openAddIssueForm}
              >
                Add Issue
              </button>
            </div>
          </div>
          <div className="mt-3">
            {issues ? <IssueTable issues={issues} /> : <p>Loading issues...</p>}
          </div>
        </div>
      </div>

      {filterFormVisibility && (
        <div className="bg-overlay absolute left-0 top-0 z-30 w-screen h-screen flex justify-center items-center">
          <form className="rounded-md bg-white z-50 p-8  flex flex-col w-fit h-fit gap-8">
            <div className="flex justify-between">
              <h2 className="font-semibold text-xl"> Filtering Option</h2>
              <button type="button" className="" onClick={closeFilterForm}>
                <img src={close} alt="" className="cursor-pointer w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {/*div for department and status  */}
              <div className="flex gap-8">
                {/* div for department */}
                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="font-medium">
                    Issued Item:{" "}
                  </label>
                  <select
                    name=""
                    id=""
                    className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                    autoFocus
                  >
                    <option value="">Select an item</option>
                  </select>
                </div>

                {/* div for request status */}
                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="font-medium">
                    {" "}
                    Department:{" "}
                  </label>
                  <select
                    name=""
                    id=""
                    className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                  >
                    <option value="" disabled>
                      Select department
                    </option>
                    <option value="">BIT</option>
                    <option value="">SSD</option>
                    <option value="">BBA</option>
                    <option value="">Resource</option>
                  </select>
                </div>
              </div>

              {/* filter by requested date */}
              <div className="flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  Issue Date:
                </label>
                <div className="flex gap-8 ">
                  <input
                    className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                    type="date"
                    placeholder=" from"
                  />
                  <input
                    className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                    type="date"
                    placeholder="to"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-8">
              {/* div for department */}
              <div className="flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  Issued By:{" "}
                </label>
                <select
                  name=""
                  id=""
                  className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                  autoFocus
                >
                  <option value="">Select a department</option>
                  <option value="">BIT</option>
                  <option value="">SSD</option>
                  <option value="">BBA</option>
                  <option value="">Resource</option>
                </select>
              </div>

              {/* div for request status */}
              <div className="flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  {" "}
                  Status:{" "}
                </label>
                <select
                  name=""
                  id=""
                  className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  <option value="">Pending</option>
                  <option value="">Dispatched</option>
                  <option value="">Denied</option>
                </select>
              </div>
            </div>
            <button className="flex bg-blue-600 text-white rounded p-3 items-center justify-center mt-3 text-lg font-medium">
              Filter
            </button>
          </form>
        </div>
      )}
      {addIssueVisibility && (
        <form
          onSubmit={handleSubmit}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white z-50 p-8 flex flex-col w-fit h-fit gap-2"
        >
          <div className="flex justify-between">
            <h2 className="font-semibold text-lg m-2"> Add Issue Details</h2>
            <button
              type="button"
              className="discard-btn"
              onClick={closeAddIssueForm}
            >
              <img src={close} alt="" />
            </button>
          </div>
          <div className="flex flex-col gap-3 p-2">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <div className="flex gap-6">
                  <div className="flex flex-col gap-4">
                    <label className="font-medium text-md" htmlFor="bill_no">
                      Issue Date:
                    </label>
                    <NepaliDatePicker
                      inputClassName="form-control focus:outline-none"
                      className="border-2 border-neutral-200 p-2 w-[250px] pl-3 rounded-md  focus:outline-slate-400"
                      value={date}
                      onChange={handleDateChange}
                      options={{ calenderLocale: "en", valueLocale: "en" }}
                    />
                  </div>

              <div className="flex flex-col gap-4">
                  <label className="font-medium text-md"> Issued To: </label>
                  <input
                  className="border-2 rounded border-neutral-200 w-[14vw] px-2 py-2 focus:outline-slate-400"
                  type="text"
                  placeholder="Enter Student Name"
                  autoFocus="autofocus"
                  name="issued_to"
                  id="issued_to"
                  onChange={handleChange}
                />
                </div>

                </div>
                <div className="flex flex-col">
                  <div className="flex py-3 gap-3">
                    <div className="flex font-medium text-md w-64">
                      <label>Item Name:</label>
                    </div>
                    <div className="flex font-medium text-md w-64">
                      <label>Quantity:</label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    {itemFields.map((items, index) => (
                      <div key={index} className="flex gap-5  items-center">
                        <Select
                          options={itemOptions}
                          onChange={(selectedOption) =>
                            handleItemChange(
                              index,
                              "item",
                              selectedOption.value
                            )
                          }
                          value={itemOptions.find(
                            (option) => option.value === items.item
                          )}
                          placeholder="Select Item"
                          styles={{
                            ...customStyles,
                            menuPortal: (provided) => ({
                              ...provided,
                              zIndex: 9999,
                            }),
                            menuList: (provided) => ({
                              ...provided,
                              maxHeight: 150, // Adjust this as needed
                              overflowY: 'auto', // This ensures only the menu list scrolls
                            }),
                          }}
                          menuPortalTarget={document.body}
                          className="w-[190px]"
                          classNamePrefix="react-select"
                        />
                        <input
                          className="border-2 rounded border-neutral-200 px-3 py-2 w-[14vw]  focus:outline-slate-400"
                          type="number"
                          placeholder="Enter a quantity"
                          name={`quantity-${index}`}
                          id={`quantity-${index}`}
                          value={items.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                        />
                        {itemFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemField(index)}
                            className="flex items-center"
                          >
                            <img
                              src={remove}
                              alt="Remove"
                              className="h-7 w-7"
                            />
                          </button>
                        )}
                        {index === itemFields.length - 1 && (
                          <button
                            type="button"
                            onClick={addItemField}
                            className="flex items-center"
                          >
                            <img src={add} alt="Add" className="h-7 w-7" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <label className="font-medium text-md">Purpose:</label>
                <textarea
                  rows={5}
                  className="border-2 border-neutral-200 p-1.5 rounded-md w-[33vw] h-[15vh]  focus:outline-slate-400 resize-none"
                  placeholder="Enter your purpose here.."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button className="bg-blue-600 text-white py-2 px-6 rounded">
                Add Issue
              </button>
            </div>
          </div>
        </form>
      )}
      {addIssueVisibility && (
        <div
          className="absolute bg-overlay z-30 w-screen h-screen"
          onClick={closeAddIssueForm}
        >
          {" "}
        </div>
      )}
      <ToastContainer pauseOnHover theme="light" />
    </div>
  );
};

export default Issue;
