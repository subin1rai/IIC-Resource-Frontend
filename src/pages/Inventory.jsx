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
import { WrapText } from "@mui/icons-material";
import addIcon from "../assets/addIcon.svg";
import low from "../assets/lowstock.png";
import removeIcon from "../assets/removeIcon.svg";
import item from "../assets/item.png";
import categoryIcon from "../assets/categoryno.png";

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
    features: {}, // Add this line
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);

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
      minHeight: "46px",
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

        console.log(response.data);
        setItems(response.data);
        setFilteredItems(response.data); // Initialize filtered items

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
          className="flex absolute z-50 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  rounded-md w-fit "
        >
          <div className="flex justify-between items-center relative px-9 pt-9">
            <p className=" text-xl font-semibold ">Add Item</p>
            <img
              className="rounded-md cursor-pointer h-5 w-5"
              src={close}
              alt=""
              onClick={closeAddItemForm}
            />
          </div>
          <div className="flex flex-col gap-10 p-9 max-h-[65vh] overflow-auto">
            <div className="flex flex-col gap-6  justify-between  ">
              <div className="flex justify-between gap-16 items-center h-fit w-fit">
                <label className="w-44 " htmlFor="item_name">
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
                <label className="w-44 " htmlFor="category">
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
              <div className="flex justify-between flex-row gap-16 items-center w-fit">
                <label className="w-44 " htmlFor="item_category">
                  Item Category
                </label>
                <div className="w-[269px]">
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
              <div className="flex justify-between flex-row gap-16 items-center w-fit">
                <label className="w-44 " htmlFor="measuring_unit">
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
              <div className="flex justify-between flex-row gap-16 items-center w-fit">
                <label className="w-44 " htmlFor="low_limit">
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
              <hr className="text-neutral-200 border-2 w-full"></hr>
              <label
                className=" text-xl font-semibold flex self-start"
                htmlFor=""
              >
                Features
              </label>
              {/* features form  */}
              <div className="flex gap-2 items-end  w-[100%] justify-start ">
                {" "}
                <div className="flex flex-col gap-4 ">
                  {selectedFeatures.map((feature, index) => (
                    <div key={index} className="flex gap-4 ">
                      <div className="flex justify-between gap-4 flex-row  items-center w-fit">
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
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              maxHeight: "80px",
                              overflowY: "auto",
                            }),
                            menuList: (provided) => ({
                              ...provided,
                              padding: 0,
                            }),
                          }}
                          className="w-[190px] menu:height: 80px"
                          classNamePrefix="react-select"
                        />
                        <input
                          className="border-2 rounded border-neutral-200 w-[210px] px-2 py-2"
                          type="text"
                          placeholder="Enter the value"
                          value={feature.value}
                          onChange={(e) =>
                            handleFeatureChange(index, "value", e.target.value)
                          }
                        />
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureField(index)}
                        >
                          <img src={removeIcon} className="w-8 h-8" alt="" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {selectedFeatures.length < featureOptions.length && (
                  <button type="button" onClick={addFeatureField}>
                    <img
                      src={addIcon}
                      className="w-8 h-8 self-end mb-1.5 text-green-500 fill-current"
                      alt=""
                    />
                  </button>
                )}
              </div>
            </div>
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
          {error && <span className="text-red-500">{error}</span>}
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
                handleSelectChange(selectedOption, { name: "feature" })
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
            <Select
              options={productCategoryOptions}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, { name: "productCategory" })
              }
              value={productCategoryOptions.find(
                (option) => option.value === itemData.productCategory
              )}
              placeholder="Choose Feature"
              styles={customStyles}
              classNamePrefix="react-select"
            />
          </div>
          <label>Select Date:</label>
          <div className="flex gap-4 ">
            <input
              className="border-2 rounded border-neutral-300 p-2 "
              type="date"
              placeholder=" from"
            />
            <input
              className="border-2 rounded border-neutral-300 p-2 "
              type="date"
              placeholder="to"
            />
          </div>
          <button className="flex self-end bg-blue-600 text-white rounded items-center w-fit p-2 px-6">
            Filter
          </button>
        </form>
      )}
      {addFormVisibility && (
        <div className="bg-overlay absolute w-screen h-screen z-40"></div>
      )}
      {filterFormVisibility && (
        <div className="bg-overlay absolute w-screen h-screen z-40"> </div>
      )}
    </div>
  );
};

export default Inventory;
