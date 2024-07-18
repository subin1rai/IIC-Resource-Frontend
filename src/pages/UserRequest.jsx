import axios from "axios";
import filter from "../assets/filter.svg";
import "../styles/userrequest.css";
import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";

const UserRequest = () => {
  const [request, setRequest] = React.useState({
    item_name: "",
    quantity: "",
    purpose: "",
  });
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setRequest((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const [items, setItems] = useState([]);

  useEffect(() => {
    const getAllItems = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/items", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data.items || []);
      } catch (error) {
        console.log(error);
        setItems([]);
      }
    };

    getAllItems();
  }, [token]);

  console.log(request);

  return (
    <div className="userRequest">
      <Navbar />
      <div className="requestcontent">
        {/* this is a request form for users */}
        <form className="request-form" onSubmit={handleSubmit}>
          <div className="headings">
            <h1>Request Resource</h1>
            <h5>You can request the resource of your choice</h5>
          </div>

          {/* creating required fields for the form */}
          <div className="singleField">
            <label htmlFor="item_name">Item Name</label>
            <select name="item_name" id="item_name" onChange={handleChange}>
              <option value="">Select an Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.item_name}>
                  {item.item_name}
                </option>
              ))}
            </select>
          </div>

          <div className="singleField">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              placeholder="Enter quantity"
              onChange={handleChange}
            />
          </div>
          <div className="singleField">
            <label htmlFor="purpose">Purpose</label>
            <textarea
              type="text"
              name="purpose"
              id="purpose"
              placeholder="Enter your purpose"
              onChange={handleChange}
            />
          </div>
          <div className="request-buttons">
            <button type="submit" className="request-btn">
              Request
            </button>
          </div>
        </form>

        {/* Vertical line */}
        <div className="divider"></div>

        {/* Creating a div for keeping history records */}
        <div className="requestHistory">
          <div className="heading2">
            <div>
              <h1>History</h1>
              <h5>You can view your request history.</h5>
            </div>
            <div className="filter-options">
              <button className="month-btn">By date</button>
              <button className="date-btn">By month</button>
            </div>
          </div>

          <form action="" className="Historyform">
            <div className="left-column">
              <div className="History">
                <label htmlFor="Item">Item</label>
              </div>

              <div className="History">
                <label htmlFor="Quantity">Quantity</label>
              </div>

              <div className="History">
                <label htmlFor="Requested date">Requested date</label>
              </div>
            </div>

            <div className="right-column">
              <div className="History">
                <label htmlFor="Status">Status</label>
              </div>

              <div className="History">
                <label htmlFor="Issued by">Issued by</label>
              </div>

              <div className="History">
                <label htmlFor="Issued date">Issued date</label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRequest;
