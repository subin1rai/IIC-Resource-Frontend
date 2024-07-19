import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/inventory.css";
import Topbar from "../components/Topbar";
import validVendor from "../assets/user.svg";
import filterIcon from "../assets/filter.svg";
import close from "../assets/close.svg";
import InventoryTable from "../components/InventoryTable";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [itemData, setItemData] = useState({
    item_name: "",
    category: "",
    itemCategory: "",
    measuring_unit: "",
    productCategory: "",
    low_limit: 0,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [itemCategory, setItemCategory] = useState([]);

  const [addFormVisibility, setAddFormVisibility] = useState(false);

  const displayAddPopup = () => {
    setAddFormVisibility(true);
  };

  const closeAddItemForm = () => {
    setError("");
    setAddFormVisibility(false);
  };

  const handleChange = (e) => {
    setItemData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // gettting token from localstorage

  const token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8898/api/addItem",
        itemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`${itemData.item_name} Added successfully!`);
      setAddFormVisibility(false);
      setLoading(false);

      // Add the new item to the items state
      setItems((prevItems) => [...prevItems, response.data.newItem]);

      // Reset the form
      setItemData({
        item_name: "",
        category: "",
        itemCategory: "",
        measuring_unit: "",
        productCategory: "",
        low_limit: 0,
      });
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAllItems = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/items", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data.items);

        const categoryResponse = await axios.get(
          "http://localhost:8898/api/category",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const itemCategoryResponse = await axios.get(
          "http://localhost:8898/api/itemCategory",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const productCategoryResponse = await axios.get(
          "http://localhost:8898/api/productCategory",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProductCategory(productCategoryResponse.data.allData);
        setItemCategory(itemCategoryResponse.data.allData);
        setCategory(categoryResponse.data.category);
      } catch (error) {
        console.log(error);
      }
    };

    getAllItems();
  }, []);

  return (
    <div className="inventory">
      <Sidebar />
      <div className="inventory-main">
        <Topbar />
        <div className="inventory-summary">
          <div className="overall-inventory">
            <h3 className="title">Overall Inventory</h3>
            <div className="inventory-container">
              <div className="container">
                <img src={validVendor} alt="" />
                <h4>{category.length}</h4>
                <p>Number of categories</p>
              </div>
              <div className="container">
                <img src={validVendor} alt="" />
                <h4>{items.length}</h4>
                <p>Number of items</p>
              </div>
              <div className="container">
                <img src={validVendor} alt="" />
                <h4>
                  {
                    items.filter((item) => item.stockStatus === "Low Stock")
                      .length
                  }
                </h4>
                <p>Number of low stock</p>
              </div>
            </div>
          </div>
        </div>
        <div className="items-container">
          <div className="item-container-top">
            <div className="container-title">
              <p>Items</p>
            </div>
            <div className="icon-actions">
              <input type="text" placeholder="Search items" />
              <button className="filter-btn" aria-label="Menu">
                <img src={filterIcon} alt="" />
                Filter
              </button>
              <button className="add-btn" onClick={displayAddPopup}>
                Add Item
              </button>
            </div>
          </div>
          <InventoryTable items={items} />
        </div>
      </div>

      {addFormVisibility && (
        <form onSubmit={handleSubmit} className="filter-form">
          <button
            type="button"
            className="discard-btn"
            onClick={closeAddItemForm}
          >
            <img src={close} alt="" />
          </button>
          <p className="title">Add Item</p>
          <div className="field">
            <label htmlFor="item_name">Item Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              autoFocus="autofocus"
              name="item_name"
              id="item_name"
              value={itemData.item_name}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              name="category"
              id="category"
              value={itemData.category}
              onChange={handleChange}
            >
              <option value="">Choose Category</option>
              {category.map((cat, index) => (
                <option key={index} value={cat.category_name}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="product_category">Product Category</label>
            <select
              name="productCategory"
              id="product_category"
              value={itemData.productCategory}
              onChange={handleChange}
            >
              <option value="">Select Product Category</option>
              {productCategory.map((prodCat, index) => (
                <option key={index} value={prodCat.product_category_name}>
                  {prodCat.product_category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="item_category">Item Category</label>
            <select
              name="itemCategory"
              id="item_category"
              value={itemData.itemCategory}
              onChange={handleChange}
            >
              <option value="">Choose Item Category</option>
              {itemCategory.map((itemCat, index) => (
                <option key={index} value={itemCat.item_category_name}>
                  {itemCat.item_category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="measuring_unit">Measuring Unit</label>
            <input
              type="text"
              placeholder="Enter measuring unit"
              name="measuring_unit"
              id="measuring_unit"
              value={itemData.measuring_unit}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="low_limit">Low Limit</label>
            <input
              type="number"
              placeholder="Enter low limit"
              name="low_limit"
              id="low_limit"
              value={itemData.low_limit}
              onChange={handleChange}
            />
          </div>

          {error && <span className="text-red-500">{error}</span>}

          <div className="buttons">
            <button type="submit" className="add-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      )}

      {addFormVisibility && (
        <div className="overlay" onClick={closeAddItemForm}></div>
      )}
      <ToastContainer pauseOnHover theme="light" />
    </div>
  );
};

export default Inventory;
