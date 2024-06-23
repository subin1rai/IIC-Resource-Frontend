import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import Topbar from "../components/Topbar";

const Dashboard = () => {
  return (
    <div className="dashbaord">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />
      </div>
    </div>
  );
};

export default Dashboard;
