import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import socket from "../socket.js";
import Select from "react-select";
import requestImage from "../assets/requestImg.svg";
import addImage from "../assets/addItem.svg";
import subtract from "../assets/subtract.svg";

const UserRequest = () => {
  const [request, setRequest] = useState({
    items: [],
    purpose: "",
    for_UserId: "",
  });
  const [items, setItems] = useState([{ item_id: "", quantity: "" }]);
  const [allItems, setAllItems] = useState([]);
  const [departmentMembers, setDepartmentMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const token = localStorage.getItem("token");
  const userDepartment = localStorage.getItem("department");

  console.log(request);

  useEffect(() => {
    const getDepartmentUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8898/api/role/allUsers"
        );

        console.log(response);

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

    console.log(departmentMembers);

    getDepartmentUsers();
  }, [userDepartment]);

  useEffect(() => {
    setMembers(
      departmentMembers.map((member) => ({
        value: member.user_id, // Set user_id as value
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
      for_UserId: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleItemSelectChange = (selectedOption, index) => {
    const newItems = [...items];
    newItems[index].item_id = selectedOption ? selectedOption.value : "";
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { item_id: "", quantity: "" }]);
  };

  console.log(items);

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
      items.some((item) => !item.item_id || !item.quantity) ||
      !request.purpose ||
      !request.for_UserId
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const requestData = {
      items: items.map((item) => ({
        item_id: item.item_id,
        quantity: item.quantity,
      })),
      purpose: request.purpose,
      for_UserId: request.for_UserId,
    };

    try {
      const response = await axios.post(
        "http://localhost:8898/api/addRequest",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setItems([{ item_id: "", quantity: "" }]);
      setRequest({
        purpose: "",
        for_UserId: "",
      });
      toast.success("Request submitted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit request. Please try again."
      );
      console.error(error);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      alignSelf: "end",
      border: state.isFocused ? "2px solid #94a3b8" : "2px solid #e5e5e5",
      borderRadius: "4px",
      boxShadow: "none",
      minHeight: "46px",
      "&:hover": {
        border: state.isFocused ? "2px solid #94a3b8" : "2px solid #e5e5e5",
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
                    options={allItems.map((item) => {
                      const features = Object.entries(
                        item.itemsOnFeatures || {}
                      )
                        .filter(([key, value]) => value)
                        .map(([key, value]) => ` - ${value}`)
                        .join("");

                      const label = `${item.item_name}${features}`;

                      return {
                        value: item.item_id,
                        label: label,
                      };
                    })}
                    onChange={(option) => handleItemSelectChange(option, index)}
                    value={
                      item.item_id
                        ? {
                            value: item.item_id,
                            label: allItems
                              .map((i) => {
                                const features = Object.entries(
                                  i.itemsOnFeatures || {}
                                )
                                  .filter(([key, value]) => value)
                                  .map(([key, value]) => ` - ${value}`)
                                  .join("");

                                return `${i.item_name}${features}`;
                              })
                              .find(
                                (label, idx) =>
                                  allItems[idx].item_id === item.item_id
                              ),
                          }
                        : null
                    }
                    placeholder="Select Item"
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: 150, // Adjust this as needed
                        overflowY: 'auto', // This ensures only the menu list scrolls
                      }),
                    }}
                    menuPortalTarget={document.body}
                    className="w-[170px] whitespace-nowrap"
                  />

                  <input
                    name={`quantity_${index}`}
                    placeholder="Enter quantity"
                    className="border-stone-200 border-2 rounded py-2 px-4 w-64 focus:outline-slate-400"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                  />
                  {items.length > 1 && (
                    <img
                      src={subtract}
                      alt="delete"
                      onClick={() => removeItem(index)}
                      className="mt-2 cursor-pointer"
                    />
                  )}
                  {index === items.length - 1 && (
                    <img
                      src={addImage}
                      alt="add"
                      onClick={addItem}
                      className="mt-2 cursor-pointer"
                    />
                  )}
                </div>
              ))}
              <div className="flex flex-col p-3 gap-3">
                <label className="font-semibold text-md">Requesting for:</label>
                <Select
                  options={members}
                  value={members.find(
                    (member) => member.value === request.for_UserId
                  )}
                  onChange={handleSelectChange}
                  placeholder="Select Member"
                  className="w-full"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      minHeight:"46px",

                    }),
                    menuPortal: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      width:"100%",
                      maxHeight: 150, // Adjust this as needed
                      overflowY: 'auto', // This ensures only the menu list scrolls
                    }),
                  }}
                  menuPortalTarget={document.body}
                />
              </div>
              <div className="flex flex-col p-3 gap-3">
                <label className="font-semibold text-md">Purpose:</label>
                <textarea
                  rows={5}
                  name="purpose"
                  placeholder="Enter your purpose"
                  className="border-stone-200 border-2 rounded py-2 px-4 w-[100%] focus:border-[#057dcd]"
                  value={request.purpose}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="bg-button py-3 rounded-lg m-3 font-medium text-white text-lg"
              >
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
