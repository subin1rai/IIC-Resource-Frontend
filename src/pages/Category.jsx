import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "axios";
import Ctable from "../components/Categorytable";
import Itable from "../components/Itable";
import Ftable from "../components/Featurestable";
import { useNavigate } from "react-router-dom";
import close from "../assets/close.svg";
import itemcat from "../assets/itemcat.png";
import categoryicon from "../assets/categoryno.png";
import featureicon from "../assets/feature.png";
import Chat from "../components/Chat";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Main Category component
const Category = () => {

   // State to store the categories, item categories, and features
  const [category, setCategory] = useState([]);
  const [newCategory, setNewCategory] = useState({ category_name: "" });
  const [itemCategory, setItemCategory] = useState([]);
  const [newItemCategory, setNewItemCategory] = useState({
    item_category_name: "",
  });
  const [feature, setFeature] = useState([]);
  const [newFeature, setNewFeature] = useState({ feature_name: "" });
  const [visibleForm, setVisibleForm] = useState("");
  const [error, setError] = useState("");
  


   // Get the token from local storage
  const token = localStorage.getItem("token");

  // Fetch categories from the API on component mount
  useEffect(() => {
    const controller =async () => {
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
      toast.success(`${newCategory.category_name} Added successfully!`);
      setVisibleForm(false);
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };

  const handleDeleteItemCategory = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item category?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:8898/api/deleteItemCategory/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setItemCategory((prevCategory) =>
        prevCategory.filter((cat) => cat.item_category_id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
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
        `${newItemCategory.item_category_name} Added successfully!`
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

      toast.success(`${newFeature.feature_name} Added successfully!`);
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

  return (
    //category

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

        <div className="w-[87vw] flex flex-wrap justify-between gap-5 ">
          <div className="flex flex-col bg-white w-[48%] rounded-lg p-3 ml-3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-lg font-bold m-2">Category</h1>
              <button
                className=" bg-button text-white rounded border items-center px-6 py-2 ml-auto w-[21%]"
                onClick={() => displayAddPopup("category")}
              >
                Add Category
              </button>
            </div>
            <Ctable category={category} setCategory={setCategory} />
          </div>

          <div className="flex flex-col bg-white w-[48%] rounded-lg p-3 mr-3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-lg font-bold m-2">Item Category</h1>
              <button
                className=" bg-button text-white rounded border items-center px-6 py-2 ml-auto w-[22%] "
                onClick={() => displayAddPopup("itemCategory")}
              >
                Item Category
              </button>
            </div>
            <Itable
              itemCategory={itemCategory}
              setItemCategory={setItemCategory}
            />
          </div>

          <div className="flex flex-col bg-white w-[48%] rounded-lg p-3 ml-3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-lg font-bold m-2">Feature</h1>
              <button
                className="  bg-button text-white rounded border items-center px-6 py-2 ml-auto w-[21%] "
                onClick={() => displayAddPopup("feature")}
              >
                Add Feature
              </button>
            </div>
            <Ftable feature={feature} setFeature={setFeature} />
          </div>
        </div>
      </div>

      {visibleForm === "category" && (
        <form
          onSubmit={handleSubmit}
          className="flex absolute z-50 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded "
        >
          <div className="flex justify-between items-center">
            <p className=" ml-4 font-semibold">Add Category</p>
            <img
              className="rounded-md cursor-pointer p-4"
              src={close}
              alt=""
              onClick={closeCategoryForm}
            />
          </div>
          <div className="flex gap-24 justify-between items-center">
            <label className="w-44 p-4" htmlFor="category_name">
              Category Name
            </label>
            <input
              className=" border-2 rounded border-neutral-200 w-[14vw] p-1 py-2"
              type="text"
              placeholder="Enter product name"
              autoFocus="autofocus"
              name="category_name"
              id="category_name"
              onChange={handleChange}
            />
          </div>
          {error && <span className="text-red-500 ml-4">{error}</span>}
          <div className="flex justify-between items-center mb-6">
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
          className="flex absolute z-50 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded "
        >
          <div className="flex justify-between items-center">
            <p className=" ml-4 font-semibold">Item Category</p>
            <img
              className="rounded-md cursor-pointer p-4"
              src={close}
              alt=""
              onClick={closeCategoryForm}
            />
          </div>
          <div className="flex gap-24 justify-between items-center">
            <label className="w-44 p-4" htmlFor="item_category_name">
              Category Name
            </label>
            <input
              className=" border-2 rounded border-neutral-200 w-[14vw] p-1 py-2"
              type="text"
              placeholder="Enter item category name"
              autoFocus="autofocus"
              name="item_category_name"
              id="item_category_name"
              onChange={handleItemCategoryChange}
            />
          </div>
          {error && <span className="text-red-500 ml-4">{error}</span>}
          <div className="flex justify-between items-center mb-6">
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
          className="flex absolute z-50 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded "
        >
          <div className="flex justify-between items-center">
            <p className=" ml-4 font-semibold">Feature</p>
            <img
              className="rounded-md cursor-pointer p-4"
              src={close}
              alt=""
              onClick={closeCategoryForm}
            />
          </div>
          <div className="flex gap-24 justify-between items-center">
            <label className="w-44 p-4" htmlFor="feature_name">
              Feature Name
            </label>
            <input
              className=" border-2 rounded border-neutral-200 w-[14vw] p-1 py-2"
              type="text"
              placeholder="Enter feature name"
              autoFocus="autofocus"
              name="feature_name"
              id="feature_name"
              onChange={handleFeatureChange}
            />
          </div>
          {error && <span className="text-red-500 ml-4">{error}</span>}
          <div className="flex justify-between items-center mb-6">
            <button
              className="bg-blue-600 text-white py-2 px-3 rounded ml-auto "
              type="submit"
            >
              Add Feature
            </button>
          </div>
        </form>
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
