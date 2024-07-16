
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/request.css";
import Topbar from "../components/Topbar";
import axios from "axios";

const Request = () => {
  return (
    <div className="request">
    <Sidebar />
    <div className="request-main">
      <Topbar />
      <div className="overall-request">
      <h3 className="request-title">Requests</h3>
      <p>You can view your request here</p>
        </div>



          </div>
          </div>

  );
};

export default Request;
