import React from "react";
import "../styles/sidebar.css";
import sideBarLogo from "../assets/top.svg";
import dashboard from "../assets/dashboard.png";
import inventory from "../assets/inventory.png";
import settings from "../assets/settings.svg";
import logout from "../assets/logout.svg";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const setActiveClass = ({ isActive }) =>
    isActive ? "active item-text" : "item-text";

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <img src={sideBarLogo} className="sidebar-logo" alt="" />

        <div className="sidebar-items">
          <div className="item">
            <img src={dashboard} alt="" />
            <NavLink to="/dashboard" className={setActiveClass}>
              Dashboard
            </NavLink>
          </div>
          <div className="item">
            <img src={inventory} alt="" />
            <NavLink to="/inventory" className={setActiveClass}>
              Inventory
            </NavLink>
          </div>
          <div className="item">
            <img src={inventory} alt="" />
            <NavLink to="/records" className={setActiveClass}>
              Bill Records
            </NavLink>
          </div>
          <div className="item">
            <img src={dashboard} alt="" />
            <NavLink to="/vendors" className={setActiveClass}>
              Vendors
            </NavLink>
          </div>
          <div className="item">
            <img src={dashboard} alt="" />
            <NavLink to="/Category" className={setActiveClass}>
              Category
            </NavLink>
          </div>
          <div className="item">
            <img src={dashboard} alt="" />
            <NavLink to="/issue" className={setActiveClass}>
              Issue
            </NavLink>
          </div>
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-items">
          <div className="item">
            <img src={settings} alt="" />
            <NavLink to="/settings" className={setActiveClass}>
              Settings
            </NavLink>
          </div>
          <div className="item">
            <img src={logout} alt="" />
            <NavLink to="/" className={setActiveClass}>
              Log out
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
