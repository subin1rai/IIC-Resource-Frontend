import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequestTable = () => {
  const [requests, setRequests] = useState([]);

  // getting token from localstorage
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
            className="flex w-full p-7 justify-between border-2 rounded-md mt-3 text-l text-black font-semibold"
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
                className="bg-blue-900 text-white h-fit py-3 px-8 rounded-md"
                onClick={() => handleAccept(request.id)}
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
      <ToastContainer pauseOnHover theme="light" />
    </div>
  );
};

export default RequestTable;
