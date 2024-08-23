import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ReqTable from "../components/ReqTable";
// import RequestTable from "../components/RequestTable";
import axios from "axios";
import Chat from "../components/Chat";
import req from "../assets/request.svg";

const Request = () => {
  return (
    <div className="w-screen h-screen flex justify-between bg-background reltive">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto  items-center">
        <Topbar />
        <div className="flex flex-wrap w-[87vw] gap-5 justify-center">
          <div className="bg-white w-[85.5vw] rounded-lg flex flex-col justify-between p-3 gap-3">
            <h3 className="flex text-lg font-bold m-3">Issue Summary</h3>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={req} alt="" />
                <h4>5</h4>
                <p className="font-medium">Number of Requests</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={req} alt="" />
                <h4>5</h4>
                <p className="font-medium">Number of Pending Requests</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[85.5vw] bg-white p-6 rounded">
        <div className="flex flex-col bg-white rounded gap-2">
          <h3 className=" font-semibold text-2xl">Requests</h3>
          <p>You can view your request here</p>

          <div className="w-[100%] mx-auto mt-5 bg-button h-1"></div>
          <div className="  mt-3 ">
            {/* <RequestTable /> */}
            <ReqTable />
          </div>
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
