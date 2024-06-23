import React from "react";

import "../styles/sidebar.css";

import sideBarLogo from "../assets/top.svg";
import dashboard from "../assets/dashboard.png";
import inventory from "../assets/inventory.png";
import settings from "../assets/settings.svg";
import logout from "../assets/logout.svg";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <img src={sideBarLogo} className="sidebar-logo" alt="" />

        <div className="sidebar-items">
          <div className="item">
            <img src={dashboard} alt="" />
            <div className="item-text">Dashboard</div>
          </div>
          <div className="item">
            <img src={inventory} alt="" />
            <div className="item-text">Inventory</div>
          </div>
          <div className="item">
            <img src={dashboard} alt="" />
            <div className="item-text">Vendors</div>
          </div>
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-items">
          <div className="item">
            <img src={settings} alt="" />
            <div className="item-text">Settings</div>
          </div>
          <div className="item">
            <img src={logout} alt="" />
            <div className="item-text">Log out</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
