import React from 'react';
import "../styles/vendor.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Table from "../components/Table";
import validVendor from "../assets/user.svg"

const Vendor = () => {
    return (
        <div className="vendor">
       <Sidebar />
       <div className="vendor-main">
        <Topbar />
          <div className =" vendor-Summary">
            <h3 className="summary-title">Summary</h3>
            <div className="summary-container">
              <div className="summary">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of Vendors</p>
              </div>
              <div className="summary">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Whitelisted Vendors</p>
              </div>
              <div className="summary">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Blacklisted Vendors</p>
              </div>
              <div className="summary">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Payment Remaining</p>
              </div>
            </div>
          </div>
          <Table /> 
        </div>      
        </div>
        );
};
export default Vendor;
