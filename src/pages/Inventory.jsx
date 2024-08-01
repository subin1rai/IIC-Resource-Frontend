import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import validVendor from "../assets/user.svg";
import filterIcon from "../assets/filter.svg";
import close from "../assets/close.svg";
import Group from "../assets/Group.svg";
import InventoryTable from "../components/InventoryTable";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [itemData, setItemData] = useState({
    item_name: "",
    category: "",
    itemCategory: "",
    measuring_unit: "",
    // productCategory: "",
    low_limit: 0,
    features: {}, // Add this line
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [itemCategory, setItemCategory] = useState([]);
  const [feature, setFeature] = useState([]);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [productCategoryOptions, setProductCategoryOptions] = useState([]);
  const [itemCategoryOptions, setItemCategoryOptions] = useState([]);
  const [featureOptions, setFeatureOptions] = useState([]);

  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [filterFormVisibility, setFilterFormVisibility] = useState(false);

  const [selectedFeatures, setSelectedFeatures] = useState([
    { feature: "", value: "" },
  ]);

  const addFeatureField = () => {
    if (selectedFeatures.length < featureOptions.length) {
      setSelectedFeatures([...selectedFeatures, { feature: "", value: "" }]);
    }
  };

  const removeFeatureField = (index) => {
    const newFeatures = selectedFeatures.filter((_, i) => i !== index);
    setSelectedFeatures(newFeatures);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      borderRadius: "4px",
      borderColor: "#ccc",
      boxShadow: "none",
      minHeight: "38px",
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
      margin: "0px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#757575",
    }),
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
    }),
  };

  const displayAddPopup = () => {
    setAddFormVisibility(true);
  };

  const displayFilterForm = () => {
    setFilterFormVisibility(true);
  };

  const closeAddItemForm = () => {
    setError("");
    setAddFormVisibility(false);
  };

  const closeFilterForm = () => {
    setFilterFormVisibility(false);
  };

  const handleChange = (e) => {
    setItemData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...selectedFeatures];
    newFeatures[index][field] = value;
    setSelectedFeatures(newFeatures);

    // Update itemData with the new features
    const updatedFeatures = newFeatures.reduce((acc, feature) => {
      if (feature.feature && feature.value) {
        acc[feature.feature] = feature.value;
      }
      return acc;
    }, {});

    setItemData((prev) => ({
      ...prev,
      features: updatedFeatures,
    }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    setItemData((prev) => ({
      ...prev,
      [actionMeta.name]: selectedOption.value,
    }));
  };

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
      setFilterFormVisibility(false);
      setLoading(false);

      setItems((prevItems) => [...prevItems, response.data.newItem]);
      setFilteredItems((prevItems) => [...prevItems, response.data.newItem]); // Update filteredItems

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
        setFilteredItems(response.data.items); // Initialize filtered items

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

        const featureResponse = await axios.get(
          "http://localhost:8898/api/feature",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setItemCategory(itemCategoryResponse.data.allData);
        setCategory(categoryResponse.data.category);
        setFeature(featureResponse.data.feature);

        console.log(itemCategory);

        setCategoryOptions(
          categoryResponse.data.category.map((cat) => ({
            value: cat.category_name,
            label: cat.category_name,
          }))
        );

        setItemCategoryOptions(
          itemCategoryResponse.data.allData.map((itemCat) => ({
            value: itemCat.item_category_name,
            label: itemCat.item_category_name,
          }))
        );
        setFeatureOptions(
          featureResponse.data.feature.map((feat) => ({
            value: feat.feature_name,
            label: feat.feature_name,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    getAllItems();
  }, []);

  useEffect(() => {
    const filterItems = () => {
      const lowercasedTerm = searchTerm.toLowerCase();
      const newFilteredItems = items.filter((item) =>
        item.item_name.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredItems(newFilteredItems);
    };

    filterItems();
  }, [searchTerm, items]);

  return (
    <div className=" bg-background flex justify-between h-screen w-screen relative">
      <Sidebar />
      <div className=" m-0 flex flex-col gap-4 items-center relative">
        <Topbar />
        <div className="flex flex-wrap w-[87vw] gap-5 justify-center">
          <div className="bg-white w-[85.5vw] rounded-lg flex flex-col justify-between p-3 gap-3">
            <h3 className="flex ml-4 font-medium">Overall Inventory</h3>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center gap-3">
                <img src={validVendor} alt="" />
                <h4>{category.length}</h4>
                <p>Number of categories</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-3">
                <img src={validVendor} alt="" />
                <h4>{items.length}</h4>
                <p>Number of items</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-3">
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
        <div className="flex flex-col bg-white justify-center items-center w-[85.5vw] p-3 rounded-xl">
          <div className="flex w-[85.8vw] justify-between">
            <div className="text-lg m-4">
              <p>Items</p>
            </div>
            <div className="flex justify-between gap-5 m-4 mr-10">
              <input
                type="text"
                placeholder="Search items"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 px-5 w-80 border-border rounded"
              />
              <button
                className="flex justify-center align-center w-fit px-5 py-2 gap-3 bg-white border-neutral-300 border-2 cursor-pointer rounded"
                aria-label="Menu"
                onClick={displayFilterForm}
              >
                <img
                  className="mt-1 justify-center align-center"
                  src={filterIcon}
                  alt=""
                />
                Filter
              </button>
              <button
                className="flex justify-center bg-button text-white rounded items-center w-fit px-6"
                onClick={displayAddPopup}
              >
                Add Item
              </button>
            </div>
          </div>
          <InventoryTable items={filteredItems} />
        </div>
      </div>

      {addFormVisibility && (
        <form
          onSubmit={handleSubmit}
          className="flex absolute z-50 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded "
        >
          <div className="flex justify-between items-center">
            <p className=" ml-4 font-semibold">Add Item</p>
            <img
              className="rounded-md cursor-pointer p-4"
              src={close}
              alt=""
              onClick={closeAddItemForm}
            />
          </div>
          <div className="flex gap-24 justify-between items-center">
            <div className="flex justify-between flex-row gap-16 items-center w-fit">
              <label className="w-44 p-4" htmlFor="item_name">
                Item Name
              </label>
              <input
                className=" border-2 rounded border-neutral-200 w-[14vw] p-1 py-2"
                type="text"
                placeholder="Enter product name"
                autoFocus="autofocus"
                name="item_name"
                id="item_name"
                value={itemData.item_name}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-between flex-row gap-16 items-center w-fit">
              <label className="w-44 p-4" htmlFor="category">
                Category
              </label>
              <div className="w-[269px]">
                <Select
                  options={categoryOptions}
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, { name: "category" })
                  }
                  value={categoryOptions.find(
                    (option) => option.value === itemData.category
                  )}
                  placeholder="Choose Category"
                  styles={customStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-16 justify-between items-center">
            <div className="flex justify-between flex-row gap-16 items-center w-fit">
              <label className="w-44 p-4" htmlFor="item_category">
                Item Category
              </label>
              <div className="w-[269px]">
                <Select
                  options={itemCategoryOptions}
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, { name: "itemCategory" })
                  }
                  value={itemCategoryOptions.find(
                    (option) => option.value === itemData.itemCategory
                  )}
                  placeholder="Choose Item Category"
                  styles={customStyles}
                  classNamePrefix="react-select"
                />
              </div>
            </div>
            <div className="flex justify-between flex-row gap-16 items-center w-fit">
              <label className="w-44 p-4" htmlFor="measuring_unit">
                Measuring Unit
              </label>
              <input
                className="border-2 rounded border-neutral-200 w-[14vw] p-1 py-2"
                type="text"
                placeholder="Enter measuring unit"
                name="measuring_unit"
                id="measuring_unit"
                value={itemData.measuring_unit}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex gap-24 justify-between items-center">
            <div className="flex justify-between flex-row gap-16 items-center w-fit">
              <label className="w-44 p-4" htmlFor="low_limit">
                Low Limit
              </label>
              <input
                className="border-2 rounded border-neutral-200 w-[14vw] p-1 py-2"
                type="number"
                placeholder="Enter low limit"
                name="low_limit"
                id="low_limit"
                value={itemData.low_limit}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* features form  */}
          <div className="flex gap-16 items-center">
            <label className="w-44 p-4" htmlFor="">
              Feature
            </label>
            <div className="">
              {selectedFeatures.map((feature, index) => (
                <div key={index} className="flex gap-28 ">
                  <div className="flex justify-between flex-row gap-16 items-center w-fit">
                    <div className="w-[269px]">
                      <Select
                        options={featureOptions}
                        onChange={(selectedOption) =>
                          handleFeatureChange(
                            index,
                            "feature",
                            selectedOption.value
                          )
                        }
                        value={featureOptions.find(
                          (option) => option.value === feature.feature
                        )}
                        placeholder="Choose Feature"
                        styles={customStyles}
                        className="w-[269px]"
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <input
                      className="border-2 rounded border-neutral-200 w-[14vw] p-1 py-2"
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
              {selectedFeatures.length < featureOptions.length && (
                <button type="button" onClick={addFeatureField}>
                  Add more field
                </button>
              )}
            </div>
          </div>

          {error && <span className="text-red-500">{error}</span>}

          <div className="flex justify-end gap-8 grid-cols-2">
            <button
              type="submit"
              className="flex justify-center bg-button text-white rounded items-center w-fit p-2 px-6"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      )}
      {filterFormVisibility && (
        <form className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white z-50 p-8 flex flex-col w-fit h-fit gap-4">
          <div className="flex justify-between">
            <h2 className="font-semibold text-l"> Select Filtering Option</h2>
            <button
              type="button"
              className="mr-5 mt-5 absolute rounded-md cursor-pointer p-4"
              onClick={closeFilterForm}
            >
              <img src={close} alt="" />
            </button>
          </div>
          <label>Select Category</label>
          <div className="flex gap-6">
            <Select
              options={categoryOptions}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, { name: "feature" })
              }
              value={categoryOptions.find(
                (option) => option.value === itemData.category
              )}
              placeholder="Choose Category"
              styles={customStyles}
              className="w-[269px]"
              classNamePrefix="react-select"
            />
            <Select
              options={itemCategoryOptions}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, { name: "itemCategory" })
              }
              value={itemCategoryOptions.find(
                (option) => option.value === itemData.itemCategory
              )}
              placeholder="Choose Item Category"
              styles={customStyles}
              className="w-[269px]"
              classNamePrefix="react-select"
            />
            <Select
              options={productCategoryOptions}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, { name: "productCategory" })
              }
              value={productCategoryOptions.find(
                (option) => option.value === itemData.productCategory
              )}
              placeholder="Choose Item Category"
              styles={customStyles}
              className="w-[269px]"
              classNamePrefix="react-select"
            />
          </div>
          <label>Select Date:</label>
          <input type="date" placeholder=" from" />
          <input type="date" placeholder="to" />
        </form>
      )}
      {addFormVisibility && (
        <div
          className="bg-overlay absolute w-screen h-screen z-40"
          onClick={closeAddItemForm}
        ></div>
      )}
      {filterFormVisibility && (
        <div
          className="bg-overlay absolute w-screen h-screen z-40"
          onCick={closeFilterForm}
        >
          {" "}
        </div>
      )}
      {/* <ToastContainer pauseOnHover theme="light" /> */}
    </div>
  );
};

export default Inventory;
