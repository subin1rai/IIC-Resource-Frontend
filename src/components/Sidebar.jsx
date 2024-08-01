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
import issue from "../assets/issue.svg";
import category from "../assets/category.svg";
import vendor from "../assets/vendor.svg";

import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const checkSpecificRoute = (pathname, parentPath) => {
    const specificRoutes = ["/specificItem", "/specificVendor"];
    return specificRoutes.some(
      (route) => pathname.startsWith(route) && pathname.includes(parentPath)
    );
  };

  const setActiveClass = ({ isActive, to }) => {
    const pathname = location.pathname;

    if (isActive) {
      return "active item-text";
    }

    // Check if the current route is a specific route and set the parent path to active
    if (checkSpecificRoute(pathname, to)) {
      return "active item-text";
    }

    return "item-text";
  };

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
      localStorage.clear();
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
              <img src={dashboard} className="item-img" alt="" />
              Dashboard
            </NavLink>
          </div>
          {/* inventory nav */}
          <div className="item">
            <NavLink to="/inventory" className={setActiveClass}>
              <img src={inventory} className="item-img" alt="" />
              Inventory
            </NavLink>
          </div>
          {/* record nav */}
          <div className="item">
            <NavLink to="/records" className={setActiveClass}>
              <img src={billRecord} className="item-img" alt="" />
              Bill Records
            </NavLink>
          </div>
          {/* vendors nav */}
          <div className="item">
            <NavLink to="/vendors" className={setActiveClass}>
              <img src={vendor} className="item-img" alt="" />
              Vendors
            </NavLink>
          </div>
          {/* category nav */}
          <div className="item">
            <NavLink to="/Category" className={setActiveClass}>
              <img src={category} className="item-img" alt="" />
              Category
            </NavLink>
          </div>
          {/* issue nav */}
          <div className="item">
            <NavLink to="/issue" className={setActiveClass}>
              <img src={issue} className="item-img" alt="" />
              Issue
            </NavLink>
          </div>
          {/* Payment nav */}
          <div className="item">
            <NavLink to="/payment" className={setActiveClass}>
              <img src={payment} className="item-img" alt="" />
              Payment
            </NavLink>
          </div>
          {/* Request nav */}
          <div className="item">
            <NavLink to="/request" className={setActiveClass}>
              <img src={request} className="item-img" alt="" />
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
              <img src={settings} className="item-img" alt="" />
              Settings
            </NavLink>
          </div>
          {/* logout nav */}
          <div className="item">
            <NavLink to="/" onClick={handleLogout} className={setActiveClass}>
              <img src={logout} className="item-img" alt="" />
              Log out
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
