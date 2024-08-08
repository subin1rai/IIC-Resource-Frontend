import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";
import close from "../assets/close.svg";
import Select from "react-select";
import add from "../assets/addIcon.svg";
import remove from "../assets/removeIcon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemFields, setItemFields] = useState([{ item: "", quantity: "" }]);
  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");
  const [acceptFormVisibility, setAcceptFormVisibility] = useState(false);

  // getting token from local storage
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
      // Implement the form submission logic here
      // Example: sending the data to the server
      const response = await axios.post(
        "http://localhost:8898/api/accept-request",
        {
          item: selectedItem,
          quantity,
          remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Request accepted successfully");
        setAcceptFormVisibility(false);
        // Update the requests list or perform any necessary actions
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to accept the request");
    }
  };

  const openAcceptForm = () => {
    setAcceptFormVisibility(true);
  };

  const closeAcceptForm = () => {
    setAcceptFormVisibility(false);
  };

  const handleItemChange = (index, field, value) => {
    const newFields = [...itemFields];
    newFields[index][field] = value;
    setItemFields(newFields);
  };

  const addItemField = () => {
    setItemFields([...itemFields, { item: "", quantity: "" }]);
  };

  const removeItemField = (index) => {
    const newFields = itemFields.filter((_, i) => i !== index);
    setItemFields(newFields);
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
    openAcceptForm();
    // console.log(`Accepted request with ID: ${requestId}`);
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
          className="flex absolute z-30 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 gap-7 rounded w-fit"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the form
        >
          <div className="flex flex-col gap-7">
            <div className="flex justify-between p-2">
              <p className="font-semibold text-2xl">Request</p>
              <img
                src={close}
                alt="close"
                className="h-4 w-4 cursor-pointer"
                onClick={closeAcceptForm}
              />
            </div>
            {/* Summary Section */}
            <div className="flex gap-3 bg-slate-200 p-4 flex-col rounded-lg">
              <div className="flex text-lg font-semibold text-zinc-600">
                Summary
              </div>
              <div className="flex gap-16 font-medium">
                <div className="flex flex-col gap-2">
                  <p>
                    Item: <span className="text-neutral-600">Copy</span>
                  </p>
                  <p>
                    Department: <span className="text-neutral-600">IT Department</span>
                  </p>
                  <p>
                    Quantity: <span className="text-neutral-600">24</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 ">
                  <p>
                    Requested By: <span className="text-neutral-600">Mr.Projesh Basnet</span>
                  </p>
                  <p>
                    Requested To: <span className="text-neutral-600">Mr.Nishesh Bishwas</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-2">
              <div className="flex gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="item" className="font-semibold text-md">
                    Item
                  </label>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="quantity" className="font-semibold text-md pl-64 ml-2">
                    Quantity
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex">
                {itemFields.map((field, index) => (
                  <div key={index} className="flex flex-col gap-5 items-end">
                    <div className="flex">
                    <Select
                      options={items}
                      onChange={(option) => handleItemChange(index, 'item', option)}
                      value={items.find(option => option === field.item)}
                      placeholder="Select Item"
                      styles={customStyles}
                      className="w-[14vw]"
                    />
                    <input
                      className="border-2 rounded border-border px-3 py-2 w-[14vw]"
                      type="number"
                      placeholder="Enter a quantity"
                      name={`quantity-${index}`}
                      id={`quantity-${index}`}
                      value={field.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeItemField(index)}
                        className="flex items-center"
                      >
                        <img src={remove} alt="Remove" className="h-7 w-7" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItemField}
                  className="flex items-center mt-2"
                >
                  <img src={add} alt="Add" className="h-7 w-7 ml-3" />
                </button>
              </div>
            </div>
            </div>
            <div className="flex flex-col gap-3 p-2">
              <label className="w-40 font-semibold text-md" htmlFor="remarks">
                Remarks
              </label>
              <textarea
                name="remarks"
                placeholder="Enter remarks"
                className="border-stone-200 border-2 rounded py-2 px-4 w-80 h-32 resize-none"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            <button className="flex self-end bg-blue-500 text-white rounded items-center w-fit p-2 px-8">
              Done
            </button>
          </div>
        </form>
      )}
      {acceptFormVisibility && (
        <div
          className="w-screen h-screen z-20 bg-overlay cursor-pointer absolute top-0 left-0"
          onClick={closeAcceptForm}
        ></div>
      )}
      <ToastContainer />
    </div>
  );
};

export default RequestTable;
