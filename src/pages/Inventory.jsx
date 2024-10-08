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
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { useSelector } from "react-redux";

const Inventory = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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

  const [filterOptions, setFilterOptions] = useState({
    category: "",
    itemCategory: "",
    dateFrom: "",
    dateTo: "",
    priceSort: "",
    measuring_unit: "",
    stockStatus: "",
  });

  const getFilteredFeatureOptions = (index) => {
    const selectedFeatureIds = selectedFeatures.map(
      (feature) => feature.feature
    );
    return featureOptions.filter(
      (option) =>
        !selectedFeatureIds.includes(option.value) ||
        option.value === selectedFeatures[index].feature
    );
  };

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

  const [measuringUnit, setMeasuringUnit] = useState([]);

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
    control: (provided, state) => ({
      ...provided,
      width: "100%",
      border: state.isFocused ? "2px solid #94a3b8" : "2px solid #e5e5e5",
      minHeight: "42px",
      "&:hover": {
        border: state.isFocused ? "2px solid #94a3b8" : "2px solid #e5e5e5",
      },
      boxShadow: "none",
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

  const featureStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "200px",
      padding: "3px 0",
      marginLeft: "4px",
      borderColor: state.isFocused ? "#94a3b8" : "#e5e5e5", // outline-slate-400 when focused, neutral-200 otherwise
      borderWidth: "1px",
      borderStyle: "solid",
      boxShadow: state.isFocused ? "0 0 0 1px #94a3b8" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#94a3b8" : "#e5e5e5",
      },
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

  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo.token;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(`${apiBaseUrl}/api/addItem`, itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      setError(error.response.data.error);
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/bill/exportItem`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

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
    } catch (error) {
      console.error("Error downloading the file:", error.message);
    }
  };

  useEffect(() => {
    const getAllItems = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/items`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setItems(response.data);
        setFilteredItems(response.data);

        const categoryResponse = await axios.get(`${apiBaseUrl}/api/category`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const itemCategoryResponse = await axios.get(
          `${apiBaseUrl}/api/itemCategory`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const featureResponse = await axios.get(`${apiBaseUrl}/api/feature`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const unitResponse = await axios.get(`${apiBaseUrl}/api/units`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMeasuringUnit(unitResponse.data.measuring_unit);
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

  const handleDateChange = (name) => (date) => {
    setFilterOptions((prev) => ({ ...prev, [name]: date }));
  };

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

  const applyFilters = () => {
    let filteredResults = [...items];

    if (filterOptions.category) {
      filteredResults = filteredResults.filter(
        (item) => item.category === filterOptions.category
      );
    }

    if (filterOptions.itemCategory) {
      filteredResults = filteredResults.filter(
        (item) => item.itemCategory === filterOptions.itemCategory
      );
    }

    if (filterOptions.dateFrom && filterOptions.dateTo) {
      filteredResults = filteredResults.filter((item) => {
        const itemDate = item.recent_purchase;
        return (
          itemDate >= new Date(filterOptions.dateFrom) &&
          itemDate <= new Date(filterOptions.dateTo)
        );
      });
    }
    if (filterOptions.priceSort) {
      filteredResults.sort((a, b) => {
        if (filterOptions.priceSort === "low-to-high") {
          return b.unit_price - a.unit_price;
        } else if (filterOptions.priceSort === "high-to-low") {
          return a.unit_price - b.unit_price;
        }
        return 0;
      });
    }

    if (filterOptions.measuring_unit) {
      filteredResults = filteredResults.filter(
        (item) => item.measuring_unit === filterOptions.measuring_unit
      );
    }

    if (filterOptions.stockStatus) {
      filteredResults = filteredResults.filter(
        (item) => item.stockStatus === filterOptions.stockStatus
      );
    }

    setFilteredItems(filteredResults);
    setFilterFormVisibility(false);
  };

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
                className="border-2 px-5 w-80 border-border rounded focus:outline-slate-400"
              />
              <button
                className="flex justify-center items-center w-fit px-5 py-1.5 gap-3 bg-white border-neutral-300 border-2 cursor-pointer rounded "
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
                className="flex bg-blue-500 px-6  w-fit h-fit py-2 justify-center items-center rounded text-white"
                onClick={displayAddPopup}
              >
                Add Item
              </button>
            </div>
          </div>
          <InventoryTable items={filteredItems} />
        </div>
      </div>

      {/* Adding item form  */}
      {addFormVisibility && (
        <form
          onSubmit={handleSubmit}
          className="flex absolute z-50 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md w-fit"
        >
          <div className="flex justify-between items-center relative overflow-hidden px-9 pt-9">
            <p className="text-xl font-semibold">Add Item</p>
            <img
              className="cursor-pointer h-4 w-4 "
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
                  className="border-2 rounded border-neutral-200 w-[250px] px-2 py-2 focus:outline-slate-400"
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
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: 150, // Adjust this as needed
                        overflowY: "auto", // This ensures only the menu list scrolls
                      }),
                    }}
                    menuPortalTarget={document.body}
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
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: 150, // Adjust this as needed
                        overflowY: "auto", // This ensures only the menu list scrolls
                      }),
                    }}
                    menuPortalTarget={document.body}
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="flex justify-between flex-row  items-center ">
                <label className="" htmlFor="measuring_unit">
                  Measuring Unit
                </label>
                <input
                  className="border-2 rounded border-neutral-200 w-[250px] px-2 py-2 focus:outline-slate-400"
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
                  className="border-2 rounded border-neutral-200 w-[250px] px-2 py-2 focus:outline-slate-400"
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

              <div className="flex flex-col gap-4 w-full max-h-[200px] overflow-auto ">
                {selectedFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-4 w-full items-center">
                    <div className="flex justify-between gap-4 flex-row items-center w-full mt-1">
                      <Select
                        options={getFilteredFeatureOptions(index)}
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
                          ...featureStyles,
                          menuPortal: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                          menuList: (provided) => ({
                            ...provided,
                            maxHeight: 150,
                            overflowY: "auto",
                          }),
                        }}
                        menuPortalTarget={document.body}
                      />
                      <input
                        className="border-2 rounded border-neutral-200 w-[200px] p-2 focus:outline-slate-400"
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
                  <span
                    type="button"
                    onClick={addFeatureField}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors hover:underline w-fit cursor-pointer"
                  >
                    Add more Feature
                  </span>
                )}
              </div>
            </div>
            {error && <span className="text-red-500">{error}</span>}

            <button
              type="submit"
              className="flex justify-center bg-blue-500 text-white rounded items-center p-2 px-6 "
              disabled={loading}
            >
              {loading ? "Adding..." : "ADD "}
            </button>
          </div>
        </form>
      )}

      {/* Filter form */}
      {filterFormVisibility && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white flex flex-col z-50 px-12 py-8 w-fit h-fit gap-8"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-xl "> Filtering Option</h2>
            <button type="button" className="p-2" onClick={closeFilterForm}>
              <img src={close} alt="" className="cursor-pointer w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-medium">By Category: </label>
            <div className="flex gap-8">
              <Select
                options={categoryOptions}
                onChange={(selectedOption) =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    category: selectedOption.value,
                  }))
                }
                value={categoryOptions.find(
                  (option) => option.value === filterOptions.category
                )}
                placeholder="Choose Category"
                styles={customStyles}
                classNamePrefix="react-select"
                autoFocus
              />
              <Select
                options={itemCategoryOptions}
                onChange={(selectedOption) =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    itemCategory: selectedOption.value, // Update `itemCategory` here
                  }))
                }
                value={itemCategoryOptions.find(
                  (option) => option.value === filterOptions.itemCategory // Ensure value matches the selected category
                )}
                placeholder="Choose Item Category"
                styles={customStyles}
                classNamePrefix="react-select"
              />
            </div>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col gap-3">
              <label htmlFor="" className="font-medium">
                Purchase From:
              </label>
              <NepaliDatePicker
                inputClassName="form-control focus:outline-none"
                className="border-2 border-neutral-300 p-2 w-[250px] pl-3 rounded-md focus:outline-slate-400"
                value={filterOptions.dateFrom}
                onChange={handleDateChange("dateFrom")}
                options={{ calenderLocale: "en", valueLocale: "en" }}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="" className="font-medium">
                Purchase To:
              </label>
              <NepaliDatePicker
                inputClassName="form-control focus:outline-none"
                className="border-2 border-neutral-300 p-2 w-[250px] pl-3 rounded-md focus:outline-slate-400"
                value={filterOptions.dateTo}
                onChange={handleDateChange("dateTo")}
                options={{ calenderLocale: "en", valueLocale: "en" }}
              />
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex flex-col gap-3">
              <label htmlFor="" className="font-medium">
                {" "}
                By Price:{" "}
              </label>
              <div>
                <select
                  className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                  value={filterOptions.unit_price}
                  onChange={(e) =>
                    setFilterOptions((prev) => ({
                      ...prev,
                      priceSort: e.target.value,
                    }))
                  }
                >
                  <option value="">Select an option</option>
                  <option value="high-to-low">High to Low</option>
                  <option value="low-to-high">Low to High</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="" className="font-medium">
                By Unit:
              </label>
              <div>
                <select
                  className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                  value={filterOptions.measuring_unit}
                  onChange={(e) => {
                    setFilterOptions((prev) => ({
                      ...prev,
                      measuring_unit: e.target.value,
                    }));
                  }}
                >
                  <option value="">Select an option</option>
                  {measuringUnit.map((unit) => (
                    <option value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="" className="font-medium">
              By Status:
            </label>
            <select
              className="border-2 rounded border-neutral-300 p-2 w-full focus:outline-slate-400"
              value={filterOptions.stockStatus}
              onChange={(e) =>
                setFilterOptions((prev) => ({
                  ...prev,
                  stockStatus: e.target.value,
                }))
              }
            >
              <option value="">Stock Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
            </select>
          </div>
          <button
            className="flex bg-blue-600 text-white rounded p-3 items-center justify-center mt-3 text-lg font-medium"
            onClick={applyFilters}
          >
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
