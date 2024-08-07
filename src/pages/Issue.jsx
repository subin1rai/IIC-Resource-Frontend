import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import close from "../assets/close.svg";
import filterIcon from "../assets/filter.svg";
import Select from "react-select";
import IssueTable from "../components/IssueTable";
import issuesno from "../assets/issuesno.png";
import pendingreq from "../assets/pendingreq.png";

const Issue = () => {
  const [issue, setIssue] = "";
  const [filterFormVisibility, setFilterFormVisibility] = useState(false);

  const displayFilterForm = () => {
    setFilterFormVisibility(true);
  };

  const closeFilterForm = () => {
    setFilterFormVisibility(false);
  };

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
              <button className="bg-blue-600 text-white py-2 px-3 rounded" >
                Add Issue
              </button>
            </div>
          </div>
          <div className="mt-10">
            <IssueTable />
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
          onCick={closeFilterForm}
        >
          {" "}
        </div>
      )}
    </div>
  );
};

export default Issue;
