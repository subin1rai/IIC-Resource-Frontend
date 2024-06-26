import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/issue.css";
import Topbar from "../components/Topbar";
import validVendor from "../assets/user.svg";
import filterIcon from "../assets/filter.svg";

const Inventory = () => {
  var [addFormVisiblity, setAddFormVisiblity] = useState(false);

  const displayAddPopup = () => {
    setAddFormVisiblity(true);
  };
  const closeAddItemForm = () => {
    setAddFormVisiblity(false);
  };

  return (
    <div className="inventory">
      <Sidebar />
      <div className="inventory-main">
        <Topbar />
        {/* Status */}
        <div className="inventory-summary">
          <div className="overall-inventory">
            <h3 className="title">Overall Inventory</h3>
            <div className="inventory-container">
              <div className="container">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
              <div className="container">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
              <div className="container">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
              <div className="container">
                <img src={validVendor} alt="" />
                <h4>31</h4>
                <p>Number of inventory</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items table */}

        <div className="items-container">
          <div className="item-container-top">
            <div className="container-title">
              <p>Items</p>
            </div>

            <div className="icon-actions">
              <input type="text" placeholder="Search items" />
              <button className="filter-btn">
                {" "}
                <img src={filterIcon} alt="" />
                Filter
              </button>

              <button className="add-btn" onClick={displayAddPopup}>
                Add Item
              </button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Items</th>
                <th>Category</th>
                <th>Product Category</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Unit Price</th>
                <th>Total Purchased</th>
                <th>Recent Purchased</th>
                <th>Item Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Item 1</td>
                <td>Electronics</td>
                <td>Gadgets</td>
                <td>50</td>
                <td>Pcs</td>
                <td>$10</td>
                <td>500</td>
                <td>2024-06-20</td>
                <td>In Stock</td>
              </tr>
              <tr>
                <td>Item 1</td>
                <td>Electronics</td>
                <td>Gadgets</td>
                <td>50</td>
                <td>Pcs</td>
                <td>$10</td>
                <td>500</td>
                <td>2024-06-20</td>
                <td>In Stock</td>
              </tr>
              <tr>
                <td>Item 1</td>
                <td>Electronics</td>
                <td>Gadgets</td>
                <td>50</td>
                <td>Pcs</td>
                <td>$10</td>
                <td>500</td>
                <td>2024-06-20</td>
                <td>In Stock</td>
              </tr>
              <tr>
                <td>Item 1</td>
                <td>Electronics</td>
                <td>Gadgets</td>
                <td>50</td>
                <td>Pcs</td>
                <td>$10</td>
                <td>500</td>
                <td>2024-06-20</td>
                <td>In Stock</td>
              </tr>
              <tr>
                <td>Item 1</td>
                <td>Electronics</td>
                <td>Gadgets</td>
                <td>50</td>
                <td>Pcs</td>
                <td>$10</td>
                <td>500</td>
                <td>2024-06-20</td>
                <td>In Stock</td>
              </tr>
              <tr>
                <td>Item 1</td>
                <td>Electronics</td>
                <td>Gadgets</td>
                <td>50</td>
                <td>Pcs</td>
                <td>$10</td>
                <td>500</td>
                <td>2024-06-20</td>
                <td>In Stock</td>
              </tr>
              <tr>
                <td>Item 1</td>
                <td>Electronics</td>
                <td>Gadgets</td>
                <td>50</td>
                <td>Pcs</td>
                <td>$10</td>
                <td>500</td>
                <td>2024-06-20</td>
                <td>In Stock</td>
              </tr>
              <tr>
                <td>Item 1</td>
                <td>Electronics</td>
                <td>Gadgets</td>
                <td>50</td>
                <td>Pcs</td>
                <td>$10</td>
                <td>500</td>
                <td>2024-06-20</td>
                <td>In Stock</td>
              </tr>
              <tr>
                <td>Item 1</td>
                <td>Electronics</td>
                <td>Gadgets</td>
                <td>50</td>
                <td>Pcs</td>
                <td>$10</td>
                <td>500</td>
                <td>2024-06-20</td>
                <td>In Stock</td>
              </tr>
              <tr>
                <td>Item 1</td>
                <td>Electronics</td>
                <td>Gadgets</td>
                <td>50</td>
                <td>Pcs</td>
                <td>$10</td>
                <td>500</td>
                <td>2024-06-20</td>
                <td>In Stock</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Items table closed */}

        {addFormVisiblity && (
          <form action="" className="filter-form">
            <p className="title">Add Item</p>
            <div className="field">
              <label htmlFor="">Item Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                name=""
                id=""
              />
            </div>
            <div className="field">
              <label htmlFor=""> Category</label>
              <input type="text" placeholder="Choose Category" name="" id="" />
            </div>
            <div className="field">
              <label htmlFor="">Item Category</label>
              <input type="text" placeholder="Choose Category" name="" id="" />
            </div>
            <div className="field">
              <label htmlFor="">Item Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                name=""
                id=""
              />
            </div>
            <div className="buttons">
              <button className="discard-btn" onClick={closeAddItemForm}>
                Discard
              </button>
              <button className="add-btn">Add Item </button>
            </div>
          </form>
        )}
      </div>

      {addFormVisiblity && (
        <div className="overlay" onClick={closeAddItemForm}></div>
      )}
    </div>
  );
};

export default Inventory;
