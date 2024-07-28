
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/inventory.css";
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
              <input
                type="text"
                placeholder="Search items"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-slate-300 rounded"
              />
              <button
                className="filter-btn"
                aria-label="Menu"
                onClick={displayFilterForm}
              >
                <img src={filterIcon} alt="" />
                Filter
              </button>
              <button className="add-btn" onClick={displayAddPopup}>
                Add Item
              </button>
            </div>
          </div>
          <InventoryTable items={filteredItems} />
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
          <div className="double">
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
              <div className="select-wrapper">
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

          <div className="double">
            <div className="field">
              <label htmlFor="item_category">Item Category</label>
              <div className="select-wrapper">
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
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
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
          </div>
          <div className="double">
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
          </div>
          {/* features form  */}
          <label htmlFor="">Feature</label>
          <div className="features">
            {selectedFeatures.map((feature, index) => (
              <div key={index} className="feature-row">
                <div className="field">
                  <div className="select-wrapper">
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
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
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
            {selectedFeatures.length < featureOptions.length && (
              <button type="button" onClick={addFeatureField}>
                Add more field
              </button>
            )}
          </div>

          {error && <span className="text-red-500">{error}</span>}

          <div className="buttons">
            <button type="submit" className="add-btn" disabled={loading}>
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
              className="discard-btn"
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
              className="react-select-container"
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
              className="react-select-container"
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
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <label>Select Date:</label>
          <input type="date" placeholder=" from" />
          <input type="date" placeholder="to" />
        </form>
      )}
      {addFormVisibility && (
        <div className="overlay" onClick={closeAddItemForm}></div>
      )}
      {filterFormVisibility && (
        <div className="overlay" onCick={closeFilterForm}>
          {" "}
        </div>
      )}
      <ToastContainer pauseOnHover theme="light" />
    </div>
  );
};

export default Inventory;
