import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/inventory.css";
import Topbar from "../components/Topbar";
import validVendor from "../assets/user.svg";

const Inventory = () => {
  return (
    <div className="inventory">
      <Sidebar />

      <div className="inventory-main">
        <Topbar />
        <div className="inventory-summary">
          <div className="overall-inventory">
            <h3 className="title">Overall Inventory</h3>
            <div className="inventory-container">
              <div className="container">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
              <div className="overview-container">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
              <div className="overview-container">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
              <div className="overview-container">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
