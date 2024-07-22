import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import arrow from "../assets/arrow-right.svg";
import filter from "../assets/filter.svg";
import close from "../assets/close.svg";
import { Link, useParams } from "react-router-dom";
import ItemHistory from "../components/ItemHistory";
import axios from "axios";

const SingleItem = () => {
  const [item, setItem] = useState({
    item_name: "",
    category: "",
    item_category_name: "",
    product_category_name: "",
    measuring_unit: "",
    low_limit: "",
  });

  const [editedItem, setEditedItem] = useState({
    item_name: "",
    category: "",
    item_category: "",
    product_category: "",
    measuring_unit: "",
    low_limit: "",
  });

  const [editFormVisibility, setEditFormVisibility] = useState(false);
  const { id } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          itemResponse,
          categoriesResponse,
          itemCategoriesResponse,
          productCategoriesResponse,
        ] = await Promise.all([
          axios.get(`http://localhost:8898/api/items/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8898/api/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8898/api/itemCategories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8898/api/productCategories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setItem(itemResponse.data.itemData);
        setCategories(categoriesResponse.data);
        setItemCategories(itemCategoriesResponse.data);
        setProductCategories(productCategoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handlePopupForm = () => {
    setEditedItem({
      item_name: item.item_name,
      category: item.category,
      item_category: item.item_category_name,
      product_category: item.product_category_name,
      measuring_unit: item.measuring_unit,
      low_limit: item.low_limit,
    });
    setEditFormVisibility(true);
  };

  const handleChange = (e) => {
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:8898/api/updateItem/${id}`,
        editedItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setItem({ ...item, ...editedItem });
      setEditFormVisibility(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // JSX for rendering the component
    <div className="flex bg-background h-screen w-screen gap-1">
      <Sidebar /> {/* Rendering Sidebar component */}
      <div className="flex flex-col mx-auto gap-3">
        <Topbar /> {/* Rendering Topbar component */}
        {/* Start of top container */}
        <div className="bg-white w-[98%] mx-auto h-50 flex flex-col p-5 rounded-md relative">
          <div className="flex justify-between w-[98%]">
            <div className="flex flex-col gap-1">
              <div className="flex justify-center items-end gap-2 h-10 p-4">
                <h4 className="text-base font-normal">
                  <Link to="/inventory">Inventory</Link>
                </h4>
                <img src={arrow} alt="arrow" /> {/* Arrow icon */}
                <h4 className="text-base font-normal text-blue-400">
                  {item.item_name}
                </h4>
              </div>
              <h2 className="font-semibold px-4 text-2xl">{item.item_name}</h2>{" "}
              {/* Displaying item name */}
            </div>
            <div className="flex justify-center items-end">
              <button
                className="bg-blue-600 text-white py-2 px-6 w-fit h-fit rounded-md"
                onClick={handlePopupForm} // Handling click event to show edit form
              >
                Edit Item
              </button>
            </div>
          </div>
          <div className="w-[98%] mx-auto mt-5 bg-blue-600 h-1"></div>{" "}
          {/* Divider */}
          <div className="flex px-11 justify-between mt-7 w-9/12">
            <div className="flex flex-col gap-5">
              <div className="flex gap-4">
                <p className="font-semibold">Item Name:</p>{" "}
                {/* Item name label */}
                <span className="font-medium">{item.item_name}</span>{" "}
                {/* Displaying item name */}
              </div>
              <div className="flex gap-4">
                <p className="font-semibold">Measuring Unit:</p>
                <span className="font-medium">{item.measuring_unit}</span>
              </div>
              <div className="flex gap-4">
                <p className="font-semibold">Low Limit:</p>
                <span className="font-medium">{item.low_limit}</span>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex gap-4">
                <p className="font-semibold">Category:</p>
                <span className="font-medium">{item.category}</span>
              </div>
              <div className="flex gap-4">
                <p className="font-semibold">Product Category:</p>
                <span className="font-medium">
                  {item.product_category_name}
                </span>
              </div>
              <div className="flex gap-4">
                <p className="font-semibold">Item Category:</p>
                <span className="font-medium">{item.item_category_name}</span>
              </div>
            </div>
          </div>
        </div>
        {/* End of top container */}
        <div className="bg-white w-[98%] mx-auto flex flex-col p-5 rounded-md">
          <div className="flex justify-between mb-7">
            <h2 className="font-semibold px-4 text-2xl">Purchase History</h2>
            <div className="flex gap-5">
              <input
                type="text"
                placeholder="Search for history"
                className="border-2 border-gray p-1 pl-3 rounded-md w-64" // Search input for purchase history
              />
              <button className="bg-white border-2 rounded-md p-1 px-4 flex justify-between items-center gap-3">
                <img src={filter} alt="filter" /> Filter
              </button>{" "}
              {/* Filter button */}
            </div>
          </div>
          <ItemHistory /> {/* Rendering ItemHistory component */}
        </div>
      </div>
      {editFormVisibility && (
        <>
          <form
            className="flex absolute z-30 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded"
            onSubmit={handleSubmit} // Preventing default form submission
          >
            <button
              type="button"
              className="absolute p-2 top-5 right-5"
              onClick={() => setEditFormVisibility(false)} // Handling click event to hide edit form
            >
              <img src={close} alt="close" className="w-3.5 h-3.5" />
            </button>
            <h4 className="font-semibold text-xl">Edit Items</h4>{" "}
            {/* Edit form heading */}
            <div className="flex justify-between items-center">
              <label htmlFor="item_name">Item Name</label>
              <input
                type="text"
                id="item_name"
                placeholder="Enter item name"
                className="border-2 border-gray p-1 pl-3 rounded-md w-64"
                onChange={handleChange}
                value={editedItem.item_name}
                autoFocus
              />
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="category">Category</label> {/* Category label */}
              <select
                id="category"
                className="border-2 border-gray p-1 pl-3 rounded-md w-64"
                onChange={handleChange}
                value={editedItem.category}
              >
                <option value="">Select category</option>{" "}
                {/* Placeholder option */}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="item_category">Item Category</label>
              <select
                id="item_category"
                className="border-2 border-gray p-1 pl-3 rounded-md w-64"
                onChange={handleChange}
                value={editedItem.item_category}
              >
                <option value="">Select item category</option>
              </select>
            </div>
            <div className="flex justify-between items-center gap-9">
              <label htmlFor="product_category">Product Category</label>
              <select
                id="product_category"
                className="border-2 border-gray p-1 pl-3 rounded-md w-64"
                onChange={handleChange}
                value={editedItem.product_category}
              >
                <option value="">Select product category</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="measuring_unit">Measuring Unit</label>
              <input
                type="text"
                id="measuring_unit"
                placeholder="Edit measuring unit"
                className="border-2 border-gray p-1 pl-3 rounded-md w-64" // Measuring unit input
                onChange={handleChange}
                value={editedItem.measuring_unit}
              />
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="low_limit">Low Limit</label>
              <input
                type="number"
                id="low_limit"
                placeholder="Edit low limit"
                onChange={handleChange}
                className="border-2 border-gray p-1 pl-3 rounded-md w-64"
                value={editedItem.low_limit}
              />
            </div>
            <button className="bg-blue-500 w-fit px-5 text-white py-2 rounded self-end">
              Save Edit
            </button>
          </form>

          <div
            className="w-screen h-screen z-20 bg-overlay cursor-pointer absolute"
            onClick={() => setEditFormVisibility(false)} // Handling click event to hide edit form
          ></div>
        </>
      )}
    </div>
  );
};

export default SingleItem;
