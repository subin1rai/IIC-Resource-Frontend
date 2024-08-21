import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import filterIcon from "../assets/filter.svg";
import close from "../assets/close.svg";
import InventoryTable from "../components/InventoryTable";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import addIcon from "../assets/addIcon.svg";
import low from "../assets/lowstock.png";
import removeIcon from "../assets/removeIcon.svg";
import item from "../assets/item.png";
import categoryIcon from "../assets/categoryno.png";
import exportIcon from "../assets/export.svg";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [itemData, setItemData] = useState({
    item_name: "",
    category: "",
    itemCategory: "",
    measuring_unit: "",
    low_limit: 0,
    features: {},
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [itemCategory, setItemCategory] = useState([]);
  const [feature, setFeature] = useState([]);

  const [categoryOptions, setCategoryOptions] = useState([]);
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
      minHeight: "42px",
    }),
    menu: (provided) => ({
      ...provided,
      width: "100%",
    }),
    container: (provided) => ({
      ...provided,
      width: "250px",
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

      toast.success(`${itemData.item_name} added successfully!`);
      setAddFormVisibility(false);
      setFilterFormVisibility(false);
      setLoading(false);

      setItems((prevItems) => [...prevItems, response.data.newItem]);
      setFilteredItems((prevItems) => [...prevItems, response.data.newItem]);

      setItemData({
        item_name: "",
        category: "",
        itemCategory: "",
        measuring_unit: "",
        low_limit: 0,
        features: {},
      });
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8898/api/bill/exportItem",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "items.xlsx";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      console.log("File saved successfully!");
    } catch (error) {
      console.error("Error downloading the file:", error.message);
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

        setItems(response.data);
        setFilteredItems(response.data);

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
    <div className="bg-background flex justify-between h-screen w-screen relative">
      <Sidebar />
      <div className="m-0 flex flex-col gap-4 items-center relative">
        <Topbar />
        <div className="flex flex-wrap w-[87vw] gap-5 justify-center">
          <div className="bg-white w-[85.5vw] rounded-lg flex flex-col justify-between p-3 gap-3">
            <h3 className="flex text-lg font-bold m-3">Overall Inventory</h3>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={categoryIcon} alt="" />
                <h4>{category.length}</h4>
                <p className="font-medium">Number of categories</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={item} alt="" />
                <h4>{items.length}</h4>
                <p className="font-medium">Number of items</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={low} alt="" />
                <h4>
                  {
                    items.filter((item) => item.stockStatus === "Low Stock")
                      .length
                  }
                </h4>
                <p className="font-medium">Number of low stock</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white justify-center items-center w-[85.5vw] p-3 rounded-xl">
          <div className="flex w-[85.8vw] justify-between">
            <div className="text-lg m-4">
              <p className="flex text-lg font-bold m-3">Items</p>
            </div>
            <div className="flex justify-between gap-5 m-4 mr-10 h-fit">
              <input
                type="text"
                placeholder="Search items"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 px-5 w-80 border-border rounded"
              />
              <button
                className="flex justify-center items-center w-fit px-5 py-2 gap-3 bg-white border-neutral-300 border-2 cursor-pointer rounded"
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
                className="flex bg-transparent border-2 h-fit py-1.5 border-green-500 px-6 text-green-600 font-regular w-fit justify-center items-center rounded gap-2"
                aria-label="Menu"
                onClick={handleExport}
              >
                <img src={exportIcon} alt="export icon" className="h-6 w-6" />
                Export
              </button>
              <button
                className="flex justify-center bg-blue-500 text-white rounded items-center w-fit px-6"
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
          className="flex absolute z-50 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md w-fit"
        >
          <div className="flex justify-between items-center relative overflow-hidden px-9 pt-9">
            <p className="text-xl font-semibold">Add Item</p>
            <img
              className="rounded-md cursor-pointer h-5 w-5"
              src={close}
              alt=""
              onClick={closeAddItemForm}
            />
          </div>
          <div className="flex flex-col gap-10 p-9  ">
            <div className="flex flex-col gap-6 justify-between">
              <div className="flex justify-between  items-center h-fit ">
                <label className="" htmlFor="item_name">
                  Item Name
                </label>
                <input
                  className="border-2 rounded border-neutral-200 w-[250px] p-1 py-2"
                  type="text"
                  placeholder="Enter product name"
                  autoFocus="autofocus"
                  name="item_name"
                  id="item_name"
                  value={itemData.item_name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between flex-row  items-center ">
                <label className="" htmlFor="category">
                  Category
                </label>
                <div className="w-[250px]">
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
              <div className="flex justify-between flex-row  items-center ">
                <label className="" htmlFor="item_category">
                  Item Category
                </label>
                <div className="w-[250px]">
                  <Select
                    options={itemCategoryOptions}
                    onChange={(selectedOption) =>
                      handleSelectChange(selectedOption, {
                        name: "itemCategory",
                      })
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
              <div className="flex justify-between flex-row  items-center ">
                <label className="" htmlFor="measuring_unit">
                  Measuring Unit
                </label>
                <input
                  className="border-2 rounded border-neutral-200 w-[250px] p-1 py-2"
                  type="text"
                  placeholder="Enter measuring unit"
                  name="measuring_unit"
                  id="measuring_unit"
                  value={itemData.measuring_unit}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between flex-row  items-center ">
                <label className="" htmlFor="low_limit">
                  Limit
                </label>
                <input
                  className="border-2 rounded border-neutral-200 w-[250px] p-1 py-2"
                  type="number"
                  placeholder="Enter low limit"
                  name="low_limit"
                  id="low_limit"
                  value={itemData.low_limit}
                  onChange={handleChange}
                />
              </div>
              <hr className="text-neutral-200 border-2 w-full"></hr>
              <label
                className="text-xl font-semibold flex self-start"
                htmlFor=""
              >
                Features
              </label>
              {/* features form  */}
              {/* features form  */}
              <div className="flex flex-col gap-4 w-full">
                {selectedFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-4 w-full items-center">
                    <div className="flex justify-between gap-4 flex-row items-center w-full">
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
                        className="w-[200px]"
                        classNamePrefix="react-select"
                      />
                      <input
                        className="border-2 rounded border-neutral-200 w-[200px] px-2 py-2"
                        type="text"
                        placeholder="Enter the value"
                        value={feature.value}
                        onChange={(e) =>
                          handleFeatureChange(index, "value", e.target.value)
                        }
                      />
                    </div>
                    {selectedFeatures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeatureField(index)}
                        className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                      >
                        <img
                          src={removeIcon}
                          className="w-5 h-5"
                          alt="Remove"
                        />
                      </button>
                    )}
                  </div>
                ))}
                {selectedFeatures.length < featureOptions.length && (
                  <button
                    type="button"
                    onClick={addFeatureField}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Add Feature
                  </button>
                )}
              </div>
            </div>
            {error && <span className="text-red-500">{error}</span>}
            <div className="flex justify-end ">
              <button
                type="submit"
                className="flex justify-center bg-blue-600 text-white rounded items-center w-fit p-2 px-6"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Item"}
              </button>
            </div>
          </div>
        </form>
      )}
      {filterFormVisibility && (
        <form className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white flex flex-col z-50 p-8 w-fit h-fit gap-4">
          <div className="flex justify-between">
            <h2 className="font-semibold text-xl"> Filtering Option</h2>
            <img
              src={close}
              alt=""
              className="rounded-md cursor-pointer"
              onClick={closeFilterForm}
            />
          </div>
          <label>Select Category: </label>
          <div className="flex flex-col gap-8">
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
              classNamePrefix="react-select"
            />
          </div>
          <label>Select Date:</label>
          <div className="flex gap-4 ">
            <input
              className="border-2 rounded border-neutral-300 p-2 w-[250px]"
              type="date"
              placeholder=" from"
            />
            <input
              className="border-2 rounded border-neutral-300 p-2 w-[250px]"
              type="date"
              placeholder="to"
            />
          </div>
          <button className="flex self-end bg-blue-600 text-white rounded items-center w-fit p-2 px-6">
            Filter
          </button>
        </form>
      )}
      {(addFormVisibility || filterFormVisibility) && (
        <div className="bg-overlay absolute w-screen h-screen z-40"></div>
      )}
    </div>
  );
};

export default Inventory;
