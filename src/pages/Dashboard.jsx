import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import Topbar from "../components/Topbar";
import validVendor from "../assets/user.svg";

const Dashboard = () => {
  return (
    <div className="dashbaord">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />
        <div className="summary">
          <div className="inventory-overwiew">
            <h3 className="summary-title">Inventory Overview</h3>
            <div className="overview-container">
              <div className="overview">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
              <div className="overview">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
              <div className="overview">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
              <div className="overview">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
            </div>
          </div>

          <div className="vendor-overview">
            <h3 className="summary-title">Vendor Overview</h3>
            <div className="overview-container">
              <div className="overview">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
            </div>
          </div>
          <div className="vendor-overview">
            <h3 className="summary-title">Vendor Overview</h3>
            <div className="overview-container">
              <div className="overview">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
            </div>
          </div>
          <div className="vendor-overview">
            <h3 className="summary-title">Vendor Overview</h3>
            <div className="overview-container">
              <div className="overview">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
            </div>
          </div>
          <div className="vendor-overview">
            <h3 className="summary-title">Vendor Overview</h3>
            <div className="overview-container">
              <div className="overview">
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

export default Dashboard;
