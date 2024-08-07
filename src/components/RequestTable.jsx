import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";
import close from "../assets/close.svg";
import Select from "react-select";
import add from "../assets/addIcon.svg"

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequestTable = () => {
  const [requests, setRequests] = useState([]);

  // getting token from localstorage
  const token = localStorage.getItem("token");

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      borderRadius: "4px",
      borderColor: "#D0D5DD",
      boxShadow: "none",
      minHeight: "43px",
      color: "black",
      "&:hover": {
        borderColor: "#aaa",
      },
    }),
    menu: (provided) => ({
      ...provided,
      width: "100%",
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }),
    input: (provided) => ({
      ...provided,
      width: "100px",
      margin: "0px",
      color: "black",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#757575",
    }),
    container: (provided) => ({
      ...provided,
      width: "300px",
      color: "black",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
      color: "black",
    }),
  };

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
          className="flex absolute z-50 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 gap-7 rounded w-fit"
        >
          <div className="flex flex-col gap-7 ">
            <div className="flex justify-between p-2">
              <p className="font-semibold text-2xl">Request</p>
              <img src={close} alt="close" className="h-4 w-4 cursor-pointer" onClick={closeAcceptForm} />
            </div>
            {/* Summary Section */}
            <div className="flex gap-3 bg-slate-200 p-4 flex-col rounded-lg">
              <div className="flex text-lg font-semibold text-zinc-600">
                Summary
              </div>
              <div className="flex gap-16 font-medium">
                <div className="flex flex-col gap-2">
                  <p>Item: <span className="text-neutral-600">Copy</span></p>
                  <p>Department: <span className="text-neutral-600">IT Department</span></p>
                  <p>Quantity: <span className="text-neutral-600">24</span></p>
                </div>
                <div className="flex flex-col gap-2 ">
                  <p>Requested By: <span className="text-neutral-600">Mr.Projesh Basnet</span></p>
                  <p>Requested To: <span className="text-neutral-600">Mr.Nishesh Bishwas</span></p>

                </div>
              </div>
            </div>
            {/* form section */}
            <div className="flex p-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-semibold text-md">Item</label>
                <Select
                  // options={items.map((item) => ({
                  //   value: item.item_name,
                  //   label: item.item_name,
                  // }))}
                  // onChange={(option) =>
                  //   handleSelectChange(option, { name: "item_name" })
                  // }
                  // value={
                  //   bill.item_name
                  //     ? { value: bill.item_name, label: bill.item_name }
                  //     : null
                  // }
                  placeholder="Select Item"
                  autoFocus="autofocus"
                  styles={customStyles}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-semibold text-md">Quantity</label>
                <input className="border-2 rounded border-border px-3 py-2 w-[14vw]"
                  type="number"
                  placeholder="Enter a quantity"
                  name="quantity"
                  id="quantity"
                //onChange={handleChange}
                />
              </div>
              <div className="mt-10 flex">
                <img src={add} alt="" className="h-7 w-7 " />
              </div>
            </div>
            <div className="flex flex-col gap-3 p-2">
              <label className="w-40 font-semibold text-md" htmlFor="remarks" >
                Remarks
              </label>
              <textarea
                name="remarks"
                placeholder="Enter remarks"
                className="border-stone-200 border-2 rounded py-2 px-4 w-80 h-32 resize-none "
              // onChange={handleChange}
              // value={request.purpose}
              />
            </div>
            <button className="flex self-end bg-blue-500 text-white rounded items-center w-fit p-2 px-8 "> Done </button>
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



{/* <div className="flex justify-between items-center">
            <p className="text-xl font-semibold">Accept Request</p>
            <img
              className="rounded-md cursor-pointer p-4"
              src={close}
              alt=""
              onClick={closeAcceptForm}
            />
          </div>

          <div className="flex gap-10">
            <div className="flex flex-col bg-customGray gap-4 h-[30vh] w-[18vw] justify-start rounded-lg p-5">
              <h2 className="text-xl font-semibold">Summary</h2>
              <p className="text-md">Item Name:</p>
              <p className="text-md">Quantity:</p>
              <p className="text-md">Request By:</p>
              <p className="text-md">Request For:</p>
              <p className="text-md">Department:</p>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex gap-8">
                <div className="flex justify-between gap-3">
                  <label htmlFor="item_name">Item Name:</label>
                  <Select
                    // options={items.map((item) => ({
                    //   value: item.item_name,
                    //   label: item.item_name,
                    // }))}
                    // onChange={(option) =>
                    //   handleSelectChange(option, { name: "item_name" })
                    // }
                    // value={
                    //   bill.item_name
                    //     ? { value: bill.item_name, label: bill.item_name }
                    //     : null
                    // }
                    placeholder="Select Item"
                    styles={customStyles}
                  />
                </div>

                <input className="border-2 rounded border-neutral-200 p-1 py-2 w-[14vw]"
                  type="number"
                  placeholder=""
                  autoFocus="autofocus"
                  name="quantity"
                  id="quantity"
                // onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="w-40 " htmlFor="remarks" >
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  placeholder="Enter remarks"
                  className="border-stone-200 border-2 rounded py-2 px-4 w-[14vw] h-32 resize-none "
                // onChange={handleChange}
                // value={request.purpose}
                />
              </div>
            </div>
          </div>

          <button className="flex self-end bg-blue-500 text-white rounded items-center w-fit p-2 px-8 "> Done </button> */}