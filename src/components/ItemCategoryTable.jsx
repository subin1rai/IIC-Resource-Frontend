import React, { useEffect, useState } from "react";
import "../styles/category.css";
import Itable from "../components/Itable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import close from "../assets/close.svg";

const Category = () => {
  const [itemCategory, setItemCategory] = useState([]);
  const [newItemCategory, setNewItemCategory] = useState({
    item_category_name: "",
  });
  const [error, setError] = useState(""); 
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const response = await axios.get(
          "http://localhost:8898/api/itemCategory"
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

  const displayAddPopup = () => {
    setAddFormVisibility(true);
  };

  const closeCategoryForm = () => {
    setError("");
    setAddFormVisibility(false);
  };

  const handleChange = (e) => {
    setNewItemCategory((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    console.log(e.target.value);
  };

  const handleDeleteSUBmit = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
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
      if (axios.isCancel(error)) {
        console.log("Request Canceled", error.message);
        return;
      }
    }
    window.location.reload();
  };
  const token = localStorage.getCategory("token");
  const handleSUBmit = async (event) => {
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
      window.location.reload();
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };

  return (
    <>
      <div className="first">
        <div className="head">
          <div className="container">
            <p>Item Category</p>
          </div>
          <div className="icons">
            <button className="add-buttons" onClick={displayAddPopup}>
              Add Category
            </button>
          </div>
        </div>
        <Itable itemCategory={itemCategory} setItemCategory={setItemCategory} />
        {addFormVisibility && (
          <form action="" onSubmit={handleSUBmit} className="category-form">
            <button
              type="button"
              className="discard-button"
              onClick={closeCategoryForm}
            >
              <img src={close} alt="Close" />
            </button>
            <p className="title">Add Item Category</p>
            <h2>Example: Electronics, Stationary</h2>
           
            <div className="field">
              <label htmlFor="item_category_name">Item Category</label>

              
             
              <input
                type="text"
                placeholder=""
                autoFocus="autofocus"
                name="item_category_name"
                id="item_category_name"
                onChange={handleChange}
              />
              
            </div>
            {error && <span className="text-red-500 ml-4">{error}</span>}
            <div className="buttons">
              <button type="submit" className="add-buttons">
                Add Category
              </button>
            </div>
          </form>
        )}
           
      {addFormVisibility && (
        <div className="overlay-category" onClick={closeCategoryForm}></div>
      )}
      </div>
    </>
  );
};

export default Category;
