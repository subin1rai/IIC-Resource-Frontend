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
              <option value="Books">Books</option>
              <option value="Pens">Pens</option>
            </select>
          </div>
          <div className="singleField">
            <label htmlFor="itemCategory">Item Category</label>
            <select name="item_category" id="">
              <option value="">Select a category</option>
              <option value="Books">Books</option>
              <option value="Pens">Pens</option>
              <option value="Pencil">Pencil</option>
            </select>
          </div>

          <div className="singleField">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              name="quantity"
              id=""
              placeholder="Enter quantity"
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
          <div class="form-container">
            <div class="form-row">
              <span class="form-label">Item:</span>
              <input type="text" class="form-input" />
            </div>
            <div class="form-row">
              <span class="form-label">Quantity:</span>
              <input type="text" class="form-input" />
            </div>
            <div class="form-row">
              <span class="form-label">Requested date:</span>
              <input type="text" class="form-input" />
            </div>
            <div class="form-row">
              <span class="form-label">Status:</span>
              <input type="text" class="form-input" />
            </div>
            <div class="form-row">
              <span class="form-label">Issued by:</span>
              <input type="text" class="form-input" />
            </div>
            <div class="form-row">
              <span class="form-label">Issued date:</span>
              <input type="text" class="form-input" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRequest;
