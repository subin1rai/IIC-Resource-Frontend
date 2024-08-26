import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "axios";
import Ctable from "../components/Categorytable";
import Itable from "../components/ItemCategoryTable";
import Ftable from "../components/Featurestable";

import { useNavigate } from "react-router-dom";
import close from "../assets/close.svg";
import itemcat from "../assets/itemcat.png";
import categoryicon from "../assets/categoryno.png";
import featureicon from "../assets/feature.png";
import Chat from "../components/Chat";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import add from "../assets/addCategory.svg";

// Main Category component
const Category = () => {
  // State to store the categories, item categories, and features
  const [category, setCategory] = useState([]);
  const [newCategory, setNewCategory] = useState({ category_name: "" });
  const [itemCategory, setItemCategory] = useState([]);
  const [newItemCategory, setNewItemCategory] = useState({
    item_category_name: "",
  });
  const [newDepartment, setNewDepartment] = useState({
    department_name: "",
  });
  const [feature, setFeature] = useState([]);
  const [newFeature, setNewFeature] = useState({ feature_name: "" });
  const [visibleForm, setVisibleForm] = useState("");
  const [error, setError] = useState("");

  // Get the token from local storage
  const token = localStorage.getItem("token");

  // Fetch categories from the API on component mount
  useEffect(() => {
    const controller = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/category", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCategory(response.data.category || []);
      } catch (error) {
        console.log("Request Canceled", error);
        setCatgeory([]);
      }
    };
    controller();
  }, [token]);

  // Fetch item categories from the API on component mount

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const response = await axios.get(
          "http://localhost:8898/api/itemCategory",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setItemCategory(response.data.allData || []);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request Canceled", error.message);
          return;
        }
      }
    })();
    return () => {
      controller.abort();
    };
  }, []);
  // Fetch features from the API on component mount
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/feature", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setFeature(response.data.feature || []);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request Canceled", error.message);
          return;
        }
      }
    })();
    return () => {
      controller.abort();
    };
  }, []);

  // Function to display the form for adding new categories, item categories, or features
  const displayAddPopup = (formName) => {
    setVisibleForm(formName);
  };

  const closeCategoryForm = () => {
    setError("");
    setVisibleForm("");
  };

  const handleChange = (e) => {
    setNewCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(e.target.value);
  };

  const handleItemCategoryChange = (e) => {
    setNewItemCategory((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    console.log(e.target.value);
  };

  const handleFeatureChange = (e) => {
    setNewFeature((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDeleteSubmit = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:8898/api/deleteCategory/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setCategory((prevCategory) =>
        prevCategory.filter((cat) => cat.category_id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting feature:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8898/api/addCategory",
        newCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setCategory((prev) => [...prev, response.data.addData]);
      toast.success(`${newCategory.category_name} added successfully!`);
      setVisibleForm(false);
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };

  const handleSubmitItemCategory = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8898/api/addItemCategory",
        newItemCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      setItemCategory((prev) => [...prev, response.data.addData]);

      toast.success(
        `${newItemCategory.item_category_name} added successfully!`
      );
      setVisibleForm(false);
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };

  const handleSubmitFeature = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8898/api/addFeature",
        newFeature,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeature((prev) => [...prev, response.data.featuresData]);

      toast.success(`${newFeature.feature_name} added successfully!`);
      setVisibleForm(false);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("Feature name already exists!");
      } else {
        console.log(error);
        setError("Failed to add the new feature!");
      }
    }
  };

  const [editFormVisiblity, setEditFormVIsiblity] = useState(false);

  const [editedValue, setEditedValue] = useState({
    name: "",
    type: "",
  });

  console.log(editedValue);

  const handleEditFormChange = (e) => {
    e.preventDefault();
    setEditedValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [editId, setEditId] = useState();

  const handleEditSubmit = async (e) => {
    console.log(editId);
    try {
      const response = await axios.put(
        `http://localhost:8898/api/editCategory/${editId}`,
        editedValue
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" bg-background flex justify-between h-screen w-screen relative">
      <Sidebar />
      <div className=" m-0 flex flex-col gap-4 items-center relative">
        <Topbar />
        <div className="flex flex-wrap w-[87vw] gap-5 justify-center">
          <div className="bg-white w-[85.5vw] rounded-lg flex flex-col justify-between p-3 gap-3">
            <h3 className="flex text-lg font-bold m-3">Category Summary</h3>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={categoryicon} alt="" />
                <h4>{category.length}</h4>
                <p className="font-medium">Number of categories</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={itemcat} alt="" />
                <h4>{itemCategory.length}</h4>
                <p className="font-medium">Number of item Category</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={featureicon} alt="" />
                <h4>{feature.length}</h4>
                <p className="font-medium">Number of Features</p>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="flex absolute top-0 left-0">  <Chat /> */}
        {/* </div> */}

        <div className="w-[86.5vw] flex  justify-between p-3">
          <div className="flex flex-col w-[32%] rounded-lg ">
            <div className="flex  bg-blue-400 rounded-t-md justify-between px-10 py-3">
              <h1 className="text-lg font-medium text-white ">Category</h1>
              <img src={add} alt="add"
                onClick={() => displayAddPopup("category")}
                className="w-8 h-8 mr-2 cursor-pointer"
              />
            </div>
            <Ctable
              category={category}
              setCategory={setCategory}
              setEditFormVIsiblity={setEditFormVIsiblity}
              setEditId={setEditId}
              setEditedValue={setEditedValue}
            />{" "}
          </div>

          <div className="flex flex-col w-[32%] rounded-lg ">
            <div className="flex bg-blue-400  rounded-t-md px-10 py-3 justify-between">
              <h1 className="text-lg font-medium text-white"> Item Category</h1>
              <img src={add} alt="add"
                onClick={() => displayAddPopup("itemCategory")}
                className="w-8 h-8 mr-2 cursor-pointer"
              />
            </div>
            <Itable
              itemCategory={itemCategory}
              setItemCategory={setItemCategory}
              setCategory={setCategory}
              setEditFormVIsiblity={setEditFormVIsiblity}
              setEditId={setEditId}
              setEditedValue={setEditedValue}
            />
          </div>

          <div className="flex flex-col w-[32%] rounded-lg">
            <div className="flex bg-blue-400  rounded-t-md px-10 py-3 justify-between">
              <h1 className="text-lg font-medium text-white"> Features</h1>
              <img src={add} alt="add"
                onClick={() => displayAddPopup("feature")}
                className="w-8 h-8 mr-2 cursor-pointer"
              />
            </div>
            <Ftable
              feature={feature}
              setFeature={setFeature}
              setCategory={setCategory}
              setEditFormVIsiblity={setEditFormVIsiblity}
              setEditId={setEditId}
              setEditedValue={setEditedValue}
            />
          </div>
        </div>
      </div>

      {visibleForm === "category" && (
        <form
          onSubmit={handleSubmit}
          className="flex absolute z-50 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-7 gap-6 rounded "
        >
          <div className="flex justify-between items-center">
            <p className=" ml-4 font-semibold text-lg">Add Category</p>
            <img
              className="rounded-md cursor-pointer h-4 w-4"
              src={close}
              alt=""
              onClick={closeCategoryForm}
            />
          </div>
          <div className="flex gap-10 justify-between items-center">
            <label className="w-44 p-4 font-medium" htmlFor="category_name">
              Name
            </label>
            <input
              className=" border-2 rounded border-neutral-200 w-[14vw] p-2"
              type="text"
              placeholder="e.g assets, consumables"
              autoFocus="autofocus"
              name="category_name"
              id="category_name"
              onChange={handleChange}
            />
          </div>
          {error && <span className="text-red-500 ml-4">{error}</span>}
          <div className="flex justify-between items-center">
            <button
              className="bg-blue-600 text-white py-2 px-3 rounded ml-auto "
              type="submit"
            >
              Add Category
            </button>
          </div>
        </form>
      )}

      {visibleForm === "itemCategory" && (
        <form
          onSubmit={handleSubmitItemCategory}
          className="flex absolute z-50 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-6 p-7 rounded "
        >
          <div className="flex justify-between items-center">
            <p className=" ml-4 font-semibold text-lg">Item Category</p>
            <img
              className="rounded-md cursor-pointer h-4 w-4"
              src={close}
              alt=""
              onClick={closeCategoryForm}
            />
          </div>
          <div className="flex gap-10 justify-between items-center">
            <label
              className="w-44 p-4 font-medium"
              htmlFor="item_category_name"
            >
              Name
            </label>
            <input
              className=" border-2 rounded border-neutral-200 w-[14vw] p-2"
              type="text"
              placeholder="e.g electronics, stationary"
              autoFocus="autofocus"
              name="item_category_name"
              id="item_category_name"
              onChange={handleItemCategoryChange}
            />
          </div>
          {error && <span className="text-red-500 ml-4">{error}</span>}
          <div className="flex justify-between items-center">
            <button
              className="bg-blue-600 text-white py-2 px-3 rounded ml-auto "
              type="submit"
            >
              Add Item Category
            </button>
          </div>
        </form>
      )}

      {visibleForm === "feature" && (
        <form
          onSubmit={handleSubmitFeature}
          className="flex absolute z-50 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 gap-5 rounded "
        >
          <div className="flex justify-between items-center px-4 py-3">
            <p className=" font-semibold text-lg">Feature</p>
            <img
              className="rounded-md cursor-pointer h-4 w-4"
              src={close}
              alt=""
              onClick={closeCategoryForm}
              
            />
          </div>
          <div className="flex gap-16 justify-between items-center px-5">
            <label className="font-medium" htmlFor="feature_name">
              Name:
            </label>
            <input
              className=" border-2 rounded border-neutral-200 w-[14vw] p-2"
              type="text"
              placeholder="e.g brand, size, colour"
              autoFocus="autofocus"
              name="feature_name"
              id="feature_name"
              onChange={handleFeatureChange}
            />
          </div>
          {error && <span className="text-red-500 ml-4">{error}</span>}
          <div className="flex self-end mr-4 mt-4">
            <button
              className="bg-blue-600 text-white py-2 px-3 rounded"
              type="submit"
            >
              Add Feature
            </button>
          </div>
        </form>
      )}

      {editFormVisiblity && (
        <div className="w-screen h-screen bg-overlay absolute left-0 top-0 flex justify-center items-center">
          <form
            action=""
            onSubmit={handleEditSubmit}
            className="bg-white p-4 flex flex-col gap-8 rounded"
          >
            <div className="flex justify-between items-center px-4 py-2">
            <p className="font-semibold text-lg">Edit Category</p>
              <img
                src={close}
                alt=""
                onClick={() => setEditFormVIsiblity(false)}
                className="w-4 h-4"
              />
            </div>
            <div className="flex justify-between items-center gap-12">
              <label className=" p-4 font-medium" htmlFor="name">
                Category Name
              </label>
              <input
                className=" border-2 rounded border-neutral-200 p-2"
                type="text"
                placeholder=""
                autoFocus="autofocus"
                name="name"
                id="name"
                onChange={handleEditFormChange}
              />
            </div>
            <button className="flex self-end bg-button px-4 py-2 rounded text-white">
              Save Change
            </button>
          </form>
        </div>
      )}

      {visibleForm && (
        <div
          className="bg-overlay absolute w-screen h-screen z-40"
          onClick={closeCategoryForm}
        ></div>
      )}
    </div>
  );
};

export default Category;
