import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import RequestTable from "../components/RequestTable";
import axios from "axios";

const Request = () => {
  return (
    <div className="w-screen h-screen flex justify-between bg-background">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto  items-center">
        <Topbar />
        <div className="flex flex-col bg-white w-[85.5vw] px-4 py-4 rounded gap-2 h-[88vh]">
          <h3 className=" font-semibold text-2xl">Requests</h3>
          <p>You can view your request here</p>
          <hr className="h-1 bg-blue-500 border-none"></hr>
          <div className="h-[82vh] overflow-y-scroll mt-3">
            <RequestTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Request;
