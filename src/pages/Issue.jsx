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
import axios from "axios";

const Issue = () => {
  const [issues, setIssues] = useState();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [filterFormVisibility, setFilterFormVisibility] = useState(false);
  const [addIssueVisibility, setAddIssueVisibility] = useState(false);
  const [itemFields, setItemFields] = useState([{ item: "", quantity: "" }]);

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

  const handleItemChange = (index, field, value) => {
    const newFields = [...itemFields];
    newFields[index][field] = value;
    setItemFields(newFields);
  };

  const addItemField = () => {
    setItemFields([...itemFields, { item: "", quantity: "" }]);
  };

  const removeItemField = (index) => {
    const newFields = itemFields.filter((_, i) => i !== index);
    setItemFields(newFields);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      borderRadius: "4px",
      borderColor: "#D0D5DD",
      boxShadow: "none",
      minHeight: "43px",
      color: "black",
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

  useEffect(() => {
    const getAllIssue = async () => {
      const response = await axios.get(`http://localhost:8898/api/issue`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIssues(response.data.response);
    };
    getAllIssue();
  }, []);

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
            <div className="flex flex-col">Issue</div>

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
          <div className="mt-10">
            {issues ? <IssueTable issues={issues} /> : <p>Loading issues...</p>}
          </div>
        </div>
      </div>
      {filterFormVisibility && (
        <form className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white z-50 p-8 flex flex-col w-fit h-fit gap-4">
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
      {filterFormVisibility && (
        <div
          className="absolute bg-overlay z-30 w-screen h-screen"
          onClick={closeFilterForm}
        >
          {" "}
        </div>
      )}
      {addIssueVisibility && (
        <form className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white z-50 p-8 flex flex-col w-fit h-fit gap-4">
          <div className="flex justify-between">
            <h2 className="font-semibold text-xl m-2"> Add Issue Details</h2>
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
                <div className="flex gap-40 ">
                  <label className="font-semibold">Issue Item</label>
                  <Select
                    className="w-[70%]"
                    styles={customStyles}
                    options={items}
                    value={selectedItem}
                    onChange={setSelectedItem}
                    placeholder="Select Item"
                  />
                </div>
                <label className="font-semibold">Remarks</label>
                <textarea
                  rows={5}
                  className="border-2 border-neutral-200 p-1.5 rounded-md w-[35vw]"
                  placeholder="Type here..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
                <div className="flex flex-col gap-4">
                  <h4 className="font-bold"> Items to be Issued </h4>
                  {itemFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex gap-2 flex-col sm:flex-row items-start sm:items-center"
                    >
                      <input
                        className="border-2 border-neutral-200 p-1.5 rounded-md w-full sm:w-[14vw]"
                        type="text"
                        placeholder="Item"
                        value={field.item}
                        onChange={(e) =>
                          handleItemChange(index, "item", e.target.value)
                        }
                      />
                      <input
                        className="border-2 border-neutral-200 p-1.5 rounded-md w-full sm:w-[14vw]"
                        type="number"
                        placeholder="Quantity"
                        value={field.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                      />
                      {itemFields.length > 1 && (
                        <button
                          type="button"
                          className="bg-red-500 text-white p-2 rounded"
                          onClick={() => removeItemField(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={addItemField}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="discard-btn"
                onClick={closeAddIssueForm}
              >
                <img src={remove} alt="" />
                Remove
              </button>
              <button className="bg-blue-600 text-white py-2 px-4 rounded">
                Done
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
    </div>
  );
};

export default Issue;
