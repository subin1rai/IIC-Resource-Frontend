import React from "react";

import filter from "../assets/filter.svg";
import "../styles/userrequest.css";
import Navbar from "../components/Navbar";

const UserRequest = () => {
  const [request, setRequest] = React.useState({
    user_id: "",
    category_name: "",
    item_name: "",
    quantity: "",
  });

  const handleChange = (e) => {
    setRequest((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:8898/api/addRequest");
    console.log(response);
  };

  console.log(request);

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
            <select name="category_name" id="" onChange={handleChange}>
              <option value="">Select a category</option>
              <option value="Books">Books</option>
              <option value="Pens">Pens</option>
            </select>
          </div>
          <div className="singleField">
            <label htmlFor="itemCategory">Item Category</label>
            <select name="item_category" id="" onChange={handleChange}>
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
                <label htmlFor="Item">Item:</label>
              </div>

              <div className="History">
                <label htmlFor="Quantity">Quantity:</label>
              </div>

              <div className="History">
                <label htmlFor="Requested date">Requested date:</label>
               
              </div>
            </div>

            <div className="right-column">
              <div className="History">
                <label htmlFor="Status">Status:</label>
               
              </div>

              <div className="History">
                <label htmlFor="Issued by">Issued by:</label>
                
              </div>

              <div className="History">
                <label htmlFor="Issued date">Issued date:</label>
               
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRequest;
