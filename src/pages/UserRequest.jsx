import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import socket from "../socket.js";
import Select from "react-select";
import requestImage from "../assets/requestImg.svg"
import addImage from "../assets/addItem.svg"
import subtract from "../assets/subtract.svg"

const UserRequest = () => {
  const [request, setRequest] = useState({
    purpose: "",
    requested_for: "",
  });
  const [items, setItems] = useState([{ item_name: "", quantity: "" }]);
  const [allItems, setAllItems] = useState([]);
  const [departmentMembers, setDepartmentMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const token = localStorage.getItem("token");
  const userDepartment = localStorage.getItem("department");

  useEffect(() => {
    const getDepartmentUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8898/api/role/allUsers"
        );
        const filteredUsers = response.data.users.filter(
          (user) => user.department_name === userDepartment
        );
        setDepartmentMembers(filteredUsers || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
          "Failed to fetch department users. Please try again."
        );
        console.error(error);
      }
    };

    getDepartmentUsers();
  }, [userDepartment]);

  useEffect(() => {
    setMembers(
      departmentMembers.map((member) => ({
        value: member.user_name,
        label: member.user_name,
      }))
    );
  }, [departmentMembers]);

  useEffect(() => {
    const getAllItems = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/items", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllItems(response.data || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
          "Failed to fetch items. Please try again."
        );
        console.error(error);
        setAllItems([]);
      }
    };

    getAllItems();
  }, [token]);

  useEffect(() => {
    socket.on("new_request", (data) => {
      toast.success(`${data.message} by ${data.user}`);
    });

    return () => {
      socket.off("new_request");
    };
  }, []);

  const handleChange = (e) => {
    setRequest((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (selectedOption) => {
    setRequest((prev) => ({
      ...prev,
      requested_for: selectedOption ? selectedOption.value : "",
    }));
  };

  const addItem = () => {
    setItems([...items, { item_name: "", quantity: "" }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      items.some(item => !item.item_name || !item.quantity) ||
      !request.purpose ||
      !request.requested_for
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8898/api/addRequest",
        { ...request, items },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setItems([{ item_name: "", quantity: "" }]);
      setRequest({
        purpose: "",
        requested_for: "",
      });
      toast.success("Request submitted successfully!");
      console.log(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to submit request. Please try again."
      );
      console.error(error);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      borderRadius: "4px",
      borderColor: "#ccc",
      boxShadow: "none",
      minHeight: "43px",
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
      width: "260px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
    }),
  };

  return (
    <div className="h-screen w-screen">
      <Navbar />
      <div className="flex justify-evenly h-[87.5vh] items-center ">
        <img src={requestImage} alt="" />
        <form onSubmit={handleSubmit} className="">
          <div className="shadow-xl  rounded-lg w-[100%] p-8 flex gap-3 flex-col">
            <div className="">
              <h1 className="font-medium text-2xl">Request Resource</h1>
              <p>You can request the resource of your choice.</p>
              <hr className="mt-4 border-2 border-blue-600 " />
            </div>
            <div className="flex flex-col">
              <div className="flex p-3 gap-3">
                <div className="flex w-64">
                  <label>Item Name:</label>
                </div>
                <div className="flex w-64">
                  <label>Quantity:</label>
                </div>
              </div>
              {items.map((item, index) => (
                <div key={index} className="flex p-3 gap-3">
                  <Select
                    placeholder="Select item's name"
                    styles={customStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={allItems.map(item => ({ value: item.item_name, label: item.item_name }))}
                    value={item.item_name}
                    onChange={(selectedOption) => handleItemChange(index, 'item_name', selectedOption)}
                  />
                  <input
                    type="number"
                    name={`quantity_${index}`}
                    placeholder="Enter quantity"
                    className="border-stone-200 border-2 rounded py-2 px-4 w-64"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  />
                  {items.length > 1 && (
                    <img src={subtract} alt="delete" onClick={() => removeItem(index)} className="mt-2 cursor-pointer" />
                  )}
                  {index === items.length - 1 && (
                    <img src={addImage} alt="add" onClick={addItem} className="mt-2 cursor-pointer" />
                  )}
                </div>
              ))}
              <div className="flex flex-col p-3 gap-3">
                <label htmlFor="requested_for">
                  Requested For:
                </label>
                <Select
                  placeholder="Select teacher's name"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={members}
                  onChange={handleSelectChange}
                  value={members.find(member => member.value === request.requested_for)}
                />
              </div>
              <div className="flex flex-col p-3 gap-3">
                <label htmlFor="purpose">
                  Purpose:
                </label>
                <textarea
                  name="purpose"
                  id="purpose_field"
                  className="border-stone-200 border-2 rounded py-2 px-4 h-24 resize-none"
                  placeholder="Write the purpose of your request..."
                  onChange={handleChange}
                  value={request.purpose}
                />
              </div>
              <button type="submit" className="bg-button py-3 rounded-lg m-3 font-medium text-white text-lg">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserRequest;