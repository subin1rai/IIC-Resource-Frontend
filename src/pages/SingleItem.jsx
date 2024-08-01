import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import arrow from "../assets/arrow-right.svg";
import filter from "../assets/filter.svg";
import close from "../assets/close.svg";
import { Link, useParams } from "react-router-dom";
import ItemHistory from "../components/ItemHistory";
import axios from "axios";
import { Select } from "react-aria-components";
import { Audio } from "react-loader-spinner";

const SingleItem = () => {
  const [item, setItem] = useState({
    item_name: "",
    category: "",
    item_category_name: "",
    product_category_name: "",
    measuring_unit: "",
    low_limit: "",
    features: "",
  });

  const [editedItem, setEditedItem] = useState({
    item_name: "",
    category: "",
    item_category: "",
    product_category: "",
    measuring_unit: "",
    low_limit: "",
    faatures: "",
  });

  const [loading, setLoading] = useState(false);

  const [selectedFeatures, setSelectedFeatures] = useState([
    { feature: "", value: "" },
  ]);
  const [editFormVisibility, setEditFormVisibility] = useState(false);

  const { id } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getSingleItem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8898/api/items/${id}`
        );
        console.log(response.data.itemsOnFeatures.color);
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };
    getSingleItem();
  }, [id]);

  const handlePopupForm = () => {
    setEditedItem({
      item_name: item.item_name || "",
      category: item.category?.category_name || "",
      item_category: item.itemCategory?.item_category_name || "",
      product_category: item.productCategory?.product_category_name || "",
      measuring_unit: item.measuring_unit || "",
      low_limit: item.low_limit?.toString() || "",
      features: item.features || [{ feature: "", value: "" }],
    });
    setEditFormVisibility(true);
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...selectedFeatures];
    updatedFeatures[index][field] = value;
    setSelectedFeatures(updatedFeatures);
  };

  const addFeatureField = () => {
    setSelectedFeatures([...selectedFeatures, { feature: "", value: "" }]);
  };

  const removeFeatureField = (index) => {
    const updatedFeatures = selectedFeatures.filter((_, i) => i !== index);
    setSelectedFeatures(updatedFeatures);
  };

  const featureOptions = [
    { value: "feature1", label: "Feature 1" },
    { value: "feature2", label: "Feature 2" },
    // Add more options as needed
  ];

  const handleChange = (e) => {
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
  };

  const fetchItemData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8898/api/items/${id}`);
      setItem(response.data.itemData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching item data:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedItem = {
        item_name: editedItem.item_name,
        category_name: editedItem.category,
        item_category_name: editedItem.item_category,
        product_category_name: editedItem.product_category,
        measuring_unit: editedItem.measuring_unit,
        low_limit: parseInt(editedItem.low_limit, 10),
        features: editedItem.selectedFeatures,
      };
      const response = await axios.put(
        `http://localhost:8898/api/updateItem/${id}`,
        updatedItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchItemData();
      console.log("Server response:", response.data);

      if (response.data.updatedItem) {
        setItem(response.data.updatedItem);
      } else if (response.data) {
        setItem(response.data);
      } else {
        setItem((prevItem) => ({
          ...prevItem,
          ...updatedItem,
        }));
      }
      console.log(item);
      setEditFormVisibility(false);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="flex bg-background h-screen w-screen">
      <Sidebar />
      <div className="flex flex-col mx-auto gap-4">
        <Topbar />
        <div className="bg-white w-[99%] mx-auto h-50 flex flex-col p-5 rounded-md relative">
          <div className="flex justify-between w-[98%]">
            <div className="flex flex-col gap-1">
              <div className="flex justify-center items-end gap-2 h-10 p-4">
                <h4 className="text-base font-normal">
                  <Link to="/inventory">Inventory</Link>
                </h4>
                <img src={arrow} alt="arrow" />
                <h4 className="text-base font-normal text-blue-400">
                  {item.item_name}
                </h4>
              </div>
              <h2 className="font-semibold px-4 text-2xl">{item.item_name}</h2>
            </div>
            <div className="flex justify-center items-end">
              <button
                className="bg-blue-600 text-white py-2 px-6 w-fit h-fit rounded-md"
                onClick={handlePopupForm}
              >
                Edit Item
              </button>
            </div>
          </div>
          <div className="w-[98%] mx-auto mt-5 bg-blue-600 h-1"></div>
          {!loading ? (
            <div className="flex px-11 justify-between mt-7 w-9/12">
              <div className="flex flex-col gap-5">
                <div className="flex gap-4">
                  <p className="font-semibold">Item Name:</p>
                  <span className="font-medium">{item.item_name}</span>
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
                  <p className="font-semibold">Brand:</p>
                  <div className="font-medium">
                    <span>{item?.itemsOnFeatures?.brand || "--"}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <p className="font-semibold">Item Category:</p>
                  <span className="font-medium">{item.itemCategory}</span>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex gap-4">
                  <p className="font-semibold">Size:</p>
                  <span className="font-medium">
                    {item?.itemsOnFeatures?.size || "--"}
                  </span>
                </div>
                <div className="flex gap-4">
                  <p className="font-semibold">Color:</p>
                  <div className="font-medium">
                    <span>{item?.itemsOnFeatures?.color || "--"}</span>
                  </div>
                </div>
                {/* <div className="flex gap-4">
                <p className="font-semibold">Item Category:</p>
                <span className="font-medium">{item.itemCategory}</span>
              </div> */}
              </div>
            </div>
          ) : (
            <>Loading</>
          )}
        </div>
        <div className="bg-white w-[99%] mx-auto flex flex-col p-5 rounded-md">
          <div className="flex justify-between mb-7">
            <h2 className="font-semibold px-4 text-2xl">Purchase History</h2>
            <div className="flex gap-5">
              <input
                type="text"
                placeholder="Search for history"
                className="border-2 border-border py-2 pl-3 rounded-md w-64"
              />
              <button className="bg-white border-border border-2 rounded-md p-1 px-4 py-2 flex justify-between items-center gap-3">
                <img src={filter} alt="filter" /> Filter
              </button>
            </div>
          </div>
          <ItemHistory hostory={item} />
        </div>
      </div>
      {editFormVisibility && (
        <>
          <form
            className="flex absolute z-30 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded"
            onSubmit={handleSubmit}
          >
            <button
              type="button"
              className="absolute p-2 top-5 right-5"
              onClick={() => setEditFormVisibility(false)}
            >
              <img src={close} alt="close" className="w-3.5 h-3.5" />
            </button>
            <h4 className="font-semibold text-xl">Edit Items</h4>
            <div className="flex gap-16">
              <div className="flex justify-between items-center gap-24">
                <label className="w-36" htmlFor="item_name">
                  Item Name
                </label>
                <input
                  type="text"
                  id="item_name"
                  name="item_name"
                  placeholder="Enter item name"
                  className="border-2 border-gray p-1 pl-3 rounded-md "
                  value={editedItem.item_name}
                  onChange={handleChange}
                  autoFocus
                />
              </div>
              <div className="flex justify-between items-center gap-24">
                <label className="w-36" htmlFor="category">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  placeholder="Enter category"
                  className="border-2 border-gray p-1 pl-3 rounded-md "
                  onChange={handleChange}
                  value={editedItem.category}
                />
              </div>
            </div>
            <div className="flex gap-16">
              <div className="flex justify-between items-center gap-24">
                <label className="w-36" htmlFor="item_category">
                  Item Category
                </label>
                <input
                  type="text"
                  id="item_category"
                  name="item_category"
                  placeholder="Enter item category"
                  className="border-2 border-gray p-1 pl-3 rounded-md "
                  onChange={handleChange}
                  value={editedItem.item_category}
                />
              </div>
              <div className="flex justify-between items-center gap-24">
                <label className="36" htmlFor="product_category">
                  Product Category
                </label>
                <input
                  type="text"
                  id="product_category"
                  name="product_category"
                  placeholder="Enter product category"
                  className="border-2 border-gray p-1 pl-3 rounded-md"
                  onChange={handleChange}
                  value={editedItem.product_category}
                />
              </div>
            </div>
            <div className="flex gap-16">
              <div className="flex justify-between items-center gap-24">
                <label className="w-36" htmlFor="measuring_unit">
                  Measuring Unit
                </label>
                <input
                  type="text"
                  id="measuring_unit"
                  name="measuring_unit"
                  placeholder="Enter measuring unit"
                  className="border-2 border-gray p-1 pl-3 rounded-md"
                  value={editedItem.measuring_unit}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between items-center gap-24">
                <label className="w-36" htmlFor="low_limit">
                  Low Limit
                </label>
                <input
                  type="number"
                  id="low_limit"
                  name="low_limit"
                  placeholder="Enter low limit"
                  className="border-2 border-gray p-1 pl-3 rounded-md "
                  value={editedItem.low_limit}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <label className="font-medium text-lg" htmlFor="feature">
                Feature
              </label>
              <div className="gap-6">
                {selectedFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-16">
                    <div className="field">
                      <div className="w-48 rounded-md border-slate-200 border-2">
                        <select
                          value={feature.feature}
                          onChange={(e) =>
                            handleFeatureChange(
                              index,
                              "feature",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Choose Feature</option>
                          {featureOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="values">
                      <input
                        type="text"
                        placeholder="Enter the value"
                        value={feature.value}
                        onChange={(e) =>
                          handleFeatureChange(index, "value", e.target.value)
                        }
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureField(index)}
                        >
                          -
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-center ">
                  {selectedFeatures.length < featureOptions.length && (
                    <button
                      className="mt-6"
                      type="button"
                      onClick={addFeatureField}
                    >
                      Add more field
                    </button>
                  )}
                </div>
              </div>
            </div>
            <button className="bg-blue-500 w-fit px-5 text-white py-2 rounded self-end">
              Save Edit
            </button>
          </form>

          <div
            className="w-screen h-screen z-20 bg-overlay cursor-pointer absolute"
            onClick={() => setEditFormVisibility(false)}
          ></div>
        </>
      )}
    </div>
  );
};

export default SingleItem;
