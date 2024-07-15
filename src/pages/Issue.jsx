import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/issue.css";
import filterIcon from "../assets/filter.svg";
import back from "../assets/arrow-left.svg";
import front from "../assets/arrow-right.svg";
import IssueTable from "../components/IssueTable";
const Issue = () => {
  const [issue, setIssue] = "";

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
            <div className="icon-action">
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
    </div>
  );
};

export default Issue;
