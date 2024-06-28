import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/records.css";

const Records = () => {
    return(
        <div className="sidebar">
            <Sidebar />
        <div className="topbar">
            <Topbar />
        </div>    
        </div>
    );
}
export default Records;