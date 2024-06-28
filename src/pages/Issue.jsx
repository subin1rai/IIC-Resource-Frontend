import React from 'react';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/inventory.css";
import filterIcon from "../assets/filter.svg";

const Issue = () => {
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
              </div>
            </div>
          <table>
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
          <div className="last">
          <div className="previous">
            <button type="button">Previous </button>
            </div>
            <div className="middle">
              Page 1 of 10
            </div>
            <div className="next">
            <button type="button"> Next </button>
            </div>
        </div>
        </div>

        
      </div>

      
    </div>
  );
};

export default Issue;
