import React, { useState, useEffect } from "react";
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


  // const [issue, setIssue] = useState({
  //   issue_id: "",
  //   issue_name: "",
  //   quantity: "",
  //   remarks: "",
  //   issueData: "",
  //   status: "",
  //   approved_by: "",
  //   department: "",
  //   isReturned: "",
  // });


  const token = localStorage.getItem("token");

  const [issues, setIssues] = useState("");
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    const getAllIssues = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:8898/api/issue", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIssues(response.data.response);
        setLoading(false)
      } catch (error) {
        console.log("Error fetching issues:", error);
        setLoading(false)
      }
    };

    getAllIssues();
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
            <div className="flex flex-col">Issue</div>

            <div className="flex gap-6">
              <button
                onClick={displayFilterForm}
                className="border flex items-center gap-4 border-border px-4 py-2 rounded"
              >
                <img src={filterIcon} alt="" />
                Filter
              </button>
              <button className="bg-blue-600 text-white py-2 px-3 rounded" onClick={openAddIssueForm} >
                Add Issue
              </button>
            </div>
          </div>
          {!loading ? (<div className="mt-10">
            <IssueTable issues={issues} />
          </div>) : (<>Loading.....</>)}

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
          onCick={closeFilterForm}
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
                  <label className="font-medium text-md">Requested by</label>
                  <label className="font-medium text-md">Issued by</label>
                </div>
                <div className="flex gap-5">
                  <input className="border-2 rounded border-border px-3 py-2 w-[13vw]"
                    placeholder="Request made by" />
                  <input className="border-2 rounded border-border px-3 py-2 w-[13vw]"
                    placeholder="Items issued by" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-60">
                  <label htmlFor="item" className="font-medium text-md">
                    Item
                  </label>
                  <label
                    htmlFor="quantity"
                    className="font-medium text-md"
                  >
                    Quantity
                  </label>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex flex-col gap-6">
                    {itemFields.map((field, index) => (
                      <div key={index} className="flex  gap-5 items-center">
                        {/* <div className="flex gap-12 bg-red-600  "> */}
                        <Select
                          options={items}
                          onChange={(option) =>
                            handleItemChange(index, "item", option)
                          }
                          value={items.find((option) => option === field.item)}
                          placeholder="Select Item"
                          styles={customStyles}
                        />
                        <input
                          className="border-2 rounded border-border px-3 py-2 w-[13vw]"
                          type="number"
                          placeholder="Enter a quantity"
                          name={`quantity-${index}`}
                          id={`quantity-${index}`}
                          value={field.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                        />
                        {/* </div> */}
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeItemField(index)}
                            className="flex items-center"
                          >
                            <img src={remove} alt="Remove" className="h-7 w-7" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {itemFields.length >= 3 ? null : (
                    <button
                      type="button"
                      onClick={addItemField}
                      className="flex items-center mb-2"
                    >
                      <img src={add} alt="Add" className="h-7 w-7 ml-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-2">
            <label className="w-40 font-medium text-md" htmlFor="remarks">
              Remarks
            </label>
            <textarea
              name="remarks"
              placeholder="Enter remarks"
              className="border-stone-200 border-2 rounded py-2 px-4 w-80 h-32 resize-none"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <button className="flex self-end bg-blue-500 text-white rounded items-center w-fit p-2 px-8">
            Done
          </button>
        </form>

      )}
      {addIssueVisibility && (
        <div
          className="absolute bg-overlay z-30 w-screen h-screen"
          onCick={closeAddIssueForm}
        >
          {" "}
        </div>
      )}

    </div>
  );
};

export default Issue;
