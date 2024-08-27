import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ReqTable from "../components/ReqTable";
import socket from "../socket";
import filterIcon from "../assets/filter.svg";
// import RequestTable from "../components/RequestTable";
import axios from "axios";
import Chat from "../components/Chat";
import req from "../assets/request.svg";

const Request = () => {
  const [requests, setRequests] = useState({
    userId: "",
    for_userId: "",
    request_date: "",
    department: "",
    purpose:"",
    status: "",
    items: [],
  });

  const [items, setItems] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getRequest = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/request", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data.request);
      } catch (error) {
        console.log(error);
      }
    };

    getRequest();
  }, [token]);

  console.log(requests);

  useEffect(() => {
    socket.on("newRequest", (data) => {
      toast.success(data.message);
      setRequests((prevRequests) => [...prevRequests, data.requestData]);
    });

    return () => {
      socket.off("newRequest");
    };
  }, []);

  return (
    <div className="w-screen h-screen flex justify-between bg-background reltive">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto  items-center">
        <Topbar />
        <div className="flex flex-wrap w-[87vw] gap-5 justify-center">
          <div className="bg-white w-[85.5vw] rounded-lg flex flex-col justify-between p-3 gap-3">
            <h3 className="flex text-lg font-bold m-3">Request Summary</h3>
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

        <div className="flex flex-col bg-white justify-center items-center w-[85.5vw] p-3 rounded-xl">
          <div className="flex w-[85.8vw] justify-between">
            <div className="text-lg m-4">
              <p className="flex text-lg font-bold m-3">Requests</p>
            </div>
          <div className="flex justify-between gap-5 m-4 mr-10">
            {/* Filter */}
            <button
                className="flex justify-center items-center w-fit h-fit px-5 py-2 gap-3 bg-white border-neutral-300 border-2 cursor-pointer rounded"
                aria-label="Menu"
                // onClick={displayFilterForm}
              >
                <img
                  className="mt-1 justify-center align-center"
                  src={filterIcon}
                  alt=""
                />
                Filter
              </button>
              </div>
            </div>
            {/* <p>You can view your request here</p>
            <div className="w-[100%] mx-auto mt-5 bg-button h-1"></div> */}
           
              {/* <RequestTable /> */}
              <ReqTable requests={requests} />
            
        </div>
      </div>
      <div className="absolute right-12 bottom-12 z-50">
        <Chat />
      </div>
    </div>
  );
};

export default Request;
