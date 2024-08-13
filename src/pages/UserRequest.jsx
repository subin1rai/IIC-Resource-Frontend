// src/pages/UserRequest.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import socket from "../socket.js";
import Select from "react-select";

const UserRequest = () => {
  const [request, setRequest] = useState({
    item_name: "",
    quantity: "",
    purpose: "",
  });
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleChange = (e) => {
    setRequest((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [departmentMembers, setDepartmentMembers] = useState();

  useEffect(() => {
    const getDepartmentUsers = async () => {
      const response = await axios.get("http://localhost:8898/api/allUsers");
      console.log(response.data.users);
    };
    getDepartmentUsers();
  });

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      borderRadius: "4px",
      borderColor: "#ccc",
      boxShadow: "none",
      minHeight: "46px",
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
      margin: "0px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#757575",
    }),
    container: (provided) => ({
      ...provided,
      width: "320px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
    }),
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8898/api/addRequest",
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequest({
        item_name: "",
        quantity: "",
        purpose: "",
      });
      toast.success("Request submitted successfully!");
      console.log(response);
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("new_request", (data) => {
      toast.success(`${data.message} by ${data.user}`);
    });
  });

  useEffect(() => {
    const getAllItems = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/items", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setItems(response.data || []);
      } catch (error) {
        toast.error("Failed to fetch items. Please try again.");
        console.log(error);
        setItems([]);
      }
    };

    getAllItems();
  }, [token]);

  return (
    <>
      {/* main container */}
      <div className="flex flex-col gap-6 h-screen w-screen">
        <Navbar />
        <div className="flex justify-evenly mt-4 ml-14">
          <div className="flex flex-col bg-white p-8 shadow-lg border gap-3 rounded h-fit">
            <div className="flex flex-col">
              <h2 className="font-bold text-2xl">Request Resource</h2>
              <p className="font-light text-sm text-slate-500">
                You can request resource of your choice
              </p>
            </div>

            {/* line */}
            <div className="h-2 bg-blue-600 width-full"></div>
            {/* line closed */}

            <form onSubmit={handleSubmit} className="flex flex-col gap-7 mt-3">
              <div className="flex justify-between gap-24 items-center ">
                <label htmlFor="item_name" className="font-medium">
                  Item Name
                </label>
                <select
                  name="item_name"
                  id="item_name"
                  className="border-stone-200 border-2 rounded py-2 px-4 w-80"
                  onChange={handleChange}
                  value={request.item_name}
                >
                  <option value="">Select an Item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.item_name}>
                      {item.item_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between gap-11 items-center ">
                <label htmlFor="quantity" className="font-medium">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Enter quantity"
                  className="border-stone-200 border-2 rounded py-2 px-4  w-80"
                  onChange={handleChange}
                  value={request.quantity}
                />
              </div>
              <div className="flex justify-between gap-11 items-center ">
                <label htmlFor="quantity" className="font-medium">
                  Requested For
                </label>
                <Select
                  placeholder="Choose Category"
                  styles={customStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="flex justify-between gap-11 items-center ">
                <label
                  htmlFor="purpose"
                  className="flex self-start mt-3 font-medium"
                >
                  Purpose
                </label>
                <textarea
                  name="purpose"
                  placeholder="Enter purpose"
                  className="border-stone-200 border-2 rounded py-2 px-4 w-80 h-32 resize-none"
                  onChange={handleChange}
                  value={request.purpose}
                />
              </div>
              <button
                type="submit"
                className="flex justify-between items-center text-white bg-blue-600 w-fit h-fit py-2 px-4 rounded self-end"
              >
                Request
              </button>
            </form>
          </div>

          {/* history starts here */}
          <div className="flex flex-col gap-4 p-5">
            <div className="flex justify-between ">
              <div className="flex flex-col">
                <h2 className="font-bold text-2xl">Request History</h2>
                <p className="font-light text-sm text-slate-500">
                  You can view your request history.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex justify-between items-between gap-1 h-fit border-2 px-5 py-1 rounded">
                  {" "}
                  Date
                </button>
                <button className="flex justify-between items-between gap-1 h-fit border-2 px-5 py-1 rounded">
                  {" "}
                  Date
                </button>
              </div>
            </div>

            {/* list of history */}
            <div className="flex flex-col gap-3 bg-background rounded p-7">
              <h2>Charger</h2>
              <div className="flex justify-between gap-36 ">
                <div className="flex flex-col gap-3">
                  <p className="text-l text-slate-500 font-semibold flex gap-3">
                    Issued Date: <span className="text-black">2024/12/12</span>{" "}
                  </p>
                  <p className="text-l text-slate-500 font-semibold flex gap-3">
                    Quantity: <span className="text-black">12</span>
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-l text-slate-500 font-semibold flex gap-3">
                    Issued Date: <span className="text-black">2024/12/12</span>{" "}
                  </p>
                  <p className="text-l text-slate-500 font-semibold flex gap-3">
                    Quantity: <span className="text-black">12</span>
                  </p>
                </div>
                <div className="flex justify-between items-start text-green-600">
                  <p>Approved</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 bg-background rounded p-7">
              <h2>Charger</h2>
              <div className="flex justify-between gap-36 ">
                <div className="flex flex-col gap-3">
                  <p className="text-l text-slate-500 font-semibold flex gap-3">
                    Issued Date: <span className="text-black">2024/12/12</span>{" "}
                  </p>
                  <p className="text-l text-slate-500 font-semibold flex gap-3">
                    Quantity: <span className="text-black">12</span>
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-l text-slate-500 font-semibold flex gap-3">
                    Issued Date: <span className="text-black">2024/12/12</span>{" "}
                  </p>
                  <p className="text-l text-slate-500 font-semibold flex gap-3">
                    Quantity: <span className="text-black">12</span>
                  </p>
                </div>
                <div className="flex justify-between items-start text-red-600">
                  <p>Rejected</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 bg-background rounded p-7">
              <h2>Charger</h2>
              <div className="flex justify-between gap-36 ">
                <div className="flex flex-col gap-3">
                  <p className="text-l text-slate-500 font-semibold flex gap-3">
                    Issued Date: <span className="text-black">2024/12/12</span>{" "}
                  </p>
                  <p className="text-l text-slate-500 font-semibold flex gap-3">
                    Quantity: <span className="text-black">12</span>
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-l text-slate-500 font-semibold flex gap-3">
                    Issued Date: <span className="text-black">2024/12/12</span>{" "}
                  </p>
                  <p className="text-l text-slate-500 font-semibold flex gap-3">
                    Quantity: <span className="text-black">12</span>
                  </p>
                </div>
                <div className="flex justify-between items-start text-green-600">
                  <p>Approved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRequest;
