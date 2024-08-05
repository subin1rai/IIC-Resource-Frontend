import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";
import close from "../assets/close.svg";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // getting token from local storage
  const token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Handle form submission logic here
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
    // Fetch item options for the select dropdown
    const getItems = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/items", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const itemOptions = response.data.items.map((item) => ({
          value: item.id,
          label: item.item_name,
        }));
        setItems(itemOptions);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      getItems();
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
          className="flex absolute z-50 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 gap-7 rounded w-fit"
        >
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold">Accept Request</p>
            <img
              className="rounded-md cursor-pointer p-4"
              src={close}
              alt=""
              onClick={closeAcceptForm}
            />
          </div>

          <div className="flex gap-10">
            <div className="flex flex-col bg-customGray gap-3 h-[30vh] w-[18vw] justify-start rounded-lg p-5">
              <h2 className="text-xl font-semibold">Summary</h2>
              <p className="text-lg">Item Name:</p>
              <p className="text-lg">Quantity:</p>
              <p className="text-lg">Request By:</p>
              <p className="text-lg">Request For:</p>
              <p className="text-lg">Department:</p>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex gap-8">
                <div className="flex flex-col justify-between gap-3">
                  <label className="w-40" htmlFor="item_name">
                    Item Name
                  </label>
                  <Select
                    className="w-[14vw]"
                    options={items}
                    value={selectedItem}
                    onChange={setSelectedItem}
                    placeholder="Select item"
                    id="item_name"
                  />
                </div>
                <div className="flex justify-between flex-col gap-3">
                  <label className="w-40" htmlFor="quantity">
                    Quantity
                  </label>
                  <input
                    className="border-2 rounded border-neutral-200 p-1 py-2 w-[14vw]"
                    type="number"
                    placeholder=""
                    name="quantity"
                    id="quantity"
                    // onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="w-40" htmlFor="remarks">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  placeholder="Enter remarks"
                  className="border-stone-200 border-2 rounded py-2 px-4 w-[14vw] h-32 resize-none"
                  // onChange={handleChange}
                  // value={request.purpose}
                />
              </div>
            </div>
          </div>

          <button className="flex self-end bg-blue-500 text-white rounded items-center w-fit p-2 px-8">
            Done
          </button>
        </form>
      )}

      {acceptFormVisibility && (
        <div className="bg-overlay absolute w-[100%] h-[100%] top-0 left-0"></div>
      )}
      <ToastContainer pauseOnHover theme="light" />
    </div>
  );
};

export default RequestTable;
