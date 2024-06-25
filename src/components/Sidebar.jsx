import React from "react";

import "../styles/sidebar.css";

import sideBarLogo from "../assets/top.svg";
import dashboard from "../assets/dashboard.png";
import inventory from "../assets/inventory.png";
import settings from "../assets/settings.svg";
import logout from "../assets/logout.svg";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <img src={sideBarLogo} className="sidebar-logo" alt="" />

        <div className="sidebar-items">
          <div className="item">
            <img src={dashboard} alt="" />

            <Link to="/dashboard" className="item-text">
              Dashboard
            </Link>
          </div>
          <div className="item">
            <img src={inventory} alt="" />
            <Link to="/inventory" className="item-text">
              Inventory
            </Link>
          </div>
          <div className="item">
            <img src={inventory} alt="" />
            <Link to="/billRecords" className="item-text">
              Bill Records
            </Link>
          </div>
          <div className="item">
            <img src={dashboard} alt="" />
            <Link to="/vendors" className="item-text">
              Vendors
            </Link>
          </div>
          <div className="item">
            <img src={dashboard} alt="" />
            <Link to="/issue" className="item-text">
              Issue
            </Link>
          </div>
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-items">
          <div className="item">
            <img src={settings} alt="" />
            <Link to="/settings" className="item-text">
              Settings
            </Link>
          </div>
          <div className="item">
            <img src={logout} alt="" />
            <Link to="/" className="item-text">
              Log out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
