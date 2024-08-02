import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";
import close from "../assets/close.svg";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequestTable = () => {
  const [requests, setRequests] = useState([]);

  // getting token from localstorage
  const token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
     
    } catch (error) {
      console.log(error);
      
    }
  };
  const [acceptFormVisibility, setAcceptFormVisibility] = useState(false);

  const openAcceptForm = () => {
    setAcceptFormVisibility(true);
  };

  const closeAcceptForm = () => {
    setAcceptFormVisibility(false);
  };

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

    if (token) {
      getRequest();
    }
  }, [token]);

  useEffect(() => {
    // Listen for the newRequest event
    socket.on("newRequest", (data) => {
      toast.success(data.message);
      // Add the new request to the requests state
      setRequests((prevRequests) => [...prevRequests, data.requestData]);
    });

    return () => {
      // Clean up the socket listener on component unmount
      socket.off("newRequest");
    };
  }, []);

  const handleAccept = (requestId) => {
    openAcceptForm(requestId);
    console.log(`Accepted request with ID: ${requestId}`);
    // Implement the accept logic here
  };

  const handleDecline = (requestId) => {
    console.log(`Declined request with ID: ${requestId}`);
    // Implement the decline logic here
  };

  return (
    <div className="flex flex-col gap-4">
      {requests.length === 0 ? (
        <div>No requests found.</div>
      ) : (
        requests.map((request) => (
          <div
            key={request.id}
            className="flex w-[79vw] p-7 justify-between border-2 border-neutral-300 rounded-md mt-3 text-l text-black font-semibold "
          >
            <div className="flex flex-col gap-5">
              <p>
                Item:{" "}
                <span className="font-medium">{request.item?.item_name}</span>
              </p>
              <p>
                Department:{" "}
                <span className="font-medium">{request.users?.department}</span>
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <p>
                Quantity:{" "}
                <span className="font-medium">{request.request_quantity}</span>
              </p>
              <p>
                Requested By:{" "}
                <span className="font-medium">{request.users?.user_name}</span>
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <p>
                Requested Date:{" "}
                <span className="font-medium">
                  {new Date(request.request_date).toLocaleDateString()}
                </span>
              </p>
            </div>
            <div className="flex gap-7 items-center">
              <button
                className="bg-blue-600 text-white h-fit py-3 px-8 rounded-md"
                // onClick={() => handleAccept(request.id)}
                onClick={openAcceptForm}
              >
                Accept
              </button>
              
              
              

              <button
                className="bg-white text-red-500 border-2 h-fit py-3 px-8 rounded-md border-red-400"
                onClick={() => handleDecline(request.id)}
              >
                Decline
              </button>

              
            </div>

            
            
          </div>
          
        ))
        
      )}
      {acceptFormVisibility && (
       <form
       onSubmit={handleSubmit}
       className="flex absolute z-50 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 gap-7 rounded w-fit "
     >
       <div className="flex justify-between items-center">
         <p className=" text-xl font-semibold">Accept Request</p>
         <img
           className="rounded-md cursor-pointer p-4"
           src={close}
           alt=""
           onClick={closeAcceptForm}
         />
         </div>
         <div className="flex justify-between items-center gap-4">
         <label>Item Name: </label>
         <input className=" border-b-2"/>
         </div>
         <div className="flex justify-between items-center gap-4">
         <label>Quantity:</label>
         <input className="border-2 rounded border-neutral-300 p-2" />
         </div>
         <div className="flex justify-between items-center gap-2">
         <label> Remarks: </label>
         <textarea className="border-2 rounded border-neutral-300"> </textarea>
         </div>
        </form>
      )}
      
      {acceptFormVisibility && (
        <div className="bg-overlay absolute w-[100%] h-[100%] top-0 left-0" ></div>
      )}


      <ToastContainer pauseOnHover theme="light" />
      
    </div>
    
    
  );
  
};

export default RequestTable;
