import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import close from "../assets/close.svg";
import filterIcon from "../assets/filter.svg";
import Select from "react-select";
import back from "../assets/arrow-left.svg";
import front from "../assets/arrow-right.svg";
import IssueTable from "../components/IssueTable";
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
    <div className="issue">
      <Sidebar />
      <div className="issue-main">
        <Topbar />

        {/* Items table */}

        <div className="issue-container">
          <div className="issue-container-top">
            <div className="issue-title">
              <p>Issues</p>
            </div>
            <div className="icon-action" onClick={displayFilterForm}>
              <button className="filter">
                {" "}
                <img src={filterIcon} alt="" />
                Filters
              </button>
              <button class="bg-blue-500 p-2 text-white ">Add Issue</button>
            </div>
          </div>

          <IssueTable />
          {/* <table>
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Issued Item</th>
                <th>Issue Date</th>
                <th>Quantity</th>
                <th>Department</th>
                <th>Status</th>
                <th>Issued By</th>
                <th>Remarks</th>
              </tr>
            </thead>
        
          </table>
          <div className="page-controller">
            <button className="prev-btn">
              {" "}
              <img src={back} alt="" /> Previous
            </button>
            <div className="page-details">
              <p>
                page <span>1</span> of <span>12</span>{" "}
              </p>
            </div>
            <button className="next-btn">
              {" "}
              Next <img src={front} alt="" />
            </button>
          </div> */}
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
          <div className="flex gap-6">
            <Select
            // options={categoryOptions}
            // onChange={(selectedOption) =>
            //   handleSelectChange(selectedOption, { name: "feature" })
            // }
            // value={categoryOptions.find(
            //   (option) => option.value === itemData.category
            // )}
            // placeholder="Choose Category"
            // styles={customStyles}
            // className="react-select-container"
            // classNamePrefix="react-select"
            />
            <Select
            // options={itemCategoryOptions}
            // onChange={(selectedOption) =>
            //   handleSelectChange(selectedOption, { name: "itemCategory" })
            // }
            // value={itemCategoryOptions.find(
            //   (option) => option.value === itemData.itemCategory
            // )}
            // placeholder="Choose Item Category"
            // styles={customStyles}
            // className="react-select-container"
            // classNamePrefix="react-select"
            />
            <Select
            // options={productCategoryOptions}
            // onChange={(selectedOption) =>
            //   handleSelectChange(selectedOption, { name: "productCategory" })
            // }
            // value={productCategoryOptions.find(
            //   (option) => option.value === itemData.productCategory
            // )}
            // placeholder="Choose Product Category"
            // styles={customStyles}
            // className="react-select-container"
            // classNamePrefix="react-select"
            />
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
