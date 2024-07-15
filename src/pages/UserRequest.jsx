import React from "react";
import NavTable from "../components/NavTable";
import filter from "../assets/filter.svg";
import "../styles/userrequest.css";
import Navbar from "../components/Navbar";

const UserRequest = () => {
  return (
    <div className="userRequest">
      <Navbar />
      <div className="requestcontent">
        {/* this is a request form for users */}
        <form action="" className="request-form">
          <div className="headings">
            <h1>Request Resource</h1>
            <h5>You can request the resource of your choice</h5>
          </div>
          {/* creating required fields for the form */}
          <div className="singleField">
            <label htmlFor="categoryName">Category Name</label>
            <select name="category_name" id="">
              <option value="">Select a category</option>
              <option value="">Books</option>
              <option value="">Pens</option>
            </select>
          </div>
          <div className="singleField">
            <label htmlFor="categoryName">Item Category</label>
            <select name="item_category" id="">
              <option value="">Select a category</option>
              <option value="">Books</option>
              <option value="">Pens</option>
            </select>
          </div>
          <div className="singleField">
            <label htmlFor="categoryName">Quantity</label>
            <input type="number" name="" id="" placeholder="Enter quantity" />
          </div>
          <div className="request-buttons">
            <button type="submit" className="request-btn">
              Request
            </button>
          </div>
        </form>
        {/* Creating a div for keeping history records */}
        <div className="requestHistory">
          <div className="heading2">
            <h1>History</h1>
            <h5>You can view your history details here.</h5>
            <button type="filter" className="filter-btn">
              <img src={filter} alt="" />
              Filter</button>


          </div>
          <div className="history">

          </div>
        </div>

      </div>
    </div>
  );
};
export default UserRequest;
