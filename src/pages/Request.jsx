import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import RequestTable from "../components/RequestTable";
import axios from "axios";
import Chat from "../components/Chat";

const Request = () => {
  return (
    <div className="w-screen h-screen flex justify-between bg-background reltive">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto  items-center">
        <Topbar />
        <div className="flex flex-col bg-white w-[85.5vw] px-9 py-5 rounded gap-2 h-[88vh] ">
          <h3 className=" font-semibold text-2xl">Requests</h3>
          <p>You can view your request here</p>

          <div className="w-[100%] mx-auto mt-5 bg-button h-1"></div>
          <div className="h-[82vh] overflow-y-scroll mt-3 ">
            <RequestTable />
          </div>
        </div>
      </div>
      <div className="absolute right-12 bottom-12">
        <Chat />
      </div>
    </div>
  );
};

export default Request;
