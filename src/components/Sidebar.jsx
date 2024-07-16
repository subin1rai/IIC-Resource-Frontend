import React from "react";
import "../styles/sidebar.css";
import sideBarLogo from "../assets/top.svg";
import dashboard from "../assets/dashboard.svg";
import inventory from "../assets/inventory.svg";
import settings from "../assets/settings.svg";
import logout from "../assets/logout.svg";
import request from "../assets/request.svg";
import payment from "../assets/payment.svg";
import billRecord from "../assets/billRecord.svg";
import activeBillRecord from "../assets/activeBillRecord.svg";
import issue from "../assets/issue.svg";
import category from "../assets/category.svg";
import vendor from "../assets/vendor.svg";
import activeVendor from "../assets/activeVendor.svg";
import activeDashboard from "../assets/activeDashboard.svg";
import activeInventory from "../assets/activeInventory.svg";
import activeRequest from "../assets/activeRequest.svg";

import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const setActiveClass = ({ isActive }) =>
    isActive ? "active item-text" : "item-text";

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Sending logout request");
      const response = await axios.post(
        "http://localhost:8898/api/logout",
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Logout response:", response);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <img src={sideBarLogo} className="sidebar-logo" alt="" />

        <div className="sidebar-items">
          {/* dashboard nav */}
          <div className="item">
            <NavLink to="/dashboard" className={setActiveClass}>
              <img src={dashboard} className="inactiveImg" alt="" />
              <img src={activeDashboard} className="activeImg" alt="" />
              Dashboard
            </NavLink>
          </div>
          {/* inventory nav */}
          <div className="item">
            <NavLink to="/inventory" className={setActiveClass}>
              <img src={activeInventory} alt="" className="activeImg" />
              <img src={inventory} alt="" className="inactiveImg" />
              Inventory
            </NavLink>
          </div>
          {/* record nav */}
          <div className="item">
            <NavLink to="/records" className={setActiveClass}>
              <img src={activeBillRecord} alt="" className="activeImg" />
              <img src={billRecord} alt="" className="inactiveImg" />
              Bill Records
            </NavLink>
          </div>
          {/* vendors nav */}
          <div className="item">
            <NavLink to="/vendors" className={setActiveClass}>
              <img src={activeVendor} alt="" className="activeImg" />
              <img src={vendor} alt="" className="inactiveImg" />
              Vendors
            </NavLink>
          </div>
          {/* category nav */}
          <div className="item">
            <NavLink to="/Category" className={setActiveClass}>
              <img src={category} alt="" />
              <img src={category} alt="" />
              Category
            </NavLink>
          </div>
          {/* issue nav */}
          <div className="item">
            <NavLink to="/issue" className={setActiveClass}>
              <img src={issue} alt="" className="activeImg" />
              <img src={issue} alt="" className="activeImg" />
              Issue
            </NavLink>
          </div>
          {/* Payment nav */}
          <div className="item">
            <NavLink to="/payment" className={setActiveClass}>
              <img src={payment} alt="" className="activeImg" />
              <img src={payment} alt="" className="activeImg" />
              Payment
            </NavLink>
          </div>
          {/* Request nav */}
          <div className="item">
            <NavLink to="/request" className={setActiveClass}>
              <img src={activeRequest} alt="" className="activeImg" />
              <img src={request} alt="" className="inactiveImg" />
              Request
            </NavLink>
          </div>
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-items">
          {/* settings nav */}
          <div className="item">
            <NavLink to="/settings" className={setActiveClass}>
              <img src={settings} alt="" className="activeImg" />
              <img src={settings} alt="" className="activeImg" />
              Settings
            </NavLink>
          </div>
          {/* logout nav */}
          <div className="item">
            <NavLink to="/" onClick={handleLogout} className={setActiveClass}>
              <img src={logout} alt="" className="activeImg" />
              <img src={logout} alt="" className="activeImg" />
              Log out
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
