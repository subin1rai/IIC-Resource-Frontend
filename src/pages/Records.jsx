import * as React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/records.css";
import RecordsTable from "../components/RecordsTable";
import filterIcon from "../assets/filter.svg";
import { Link } from "react-router-dom";
import axios from "axios";

const Records = () => {
    return(
        <div className="records">
            <Sidebar />
        <div className="records-main">
            <Topbar />  
          <div className="records-container">
            <div className="top">
            <div className="container-title">
              <p>Bill Records</p>
            </div>
              <button className="filter-btn" aria-label="Menu">
                <img src={filterIcon} alt="" />
                Filter
              </button>
              <button className="add-btn">
                Add Bill
              </button>
              </div>
          <RecordsTable />
          </div>
       </div>
       </div>
    );
}
export default Records;