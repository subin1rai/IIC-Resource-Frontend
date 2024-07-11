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
  const [deleteItemCategory, setDeleteItemCategory] = useState("");
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
    try {
      const response = await axios.delete(
        `http://localhost:8898/api/deleteItemCategory/${categoryId}`
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

  const handleSUBmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8898/api/addItemCategory",
        newItemCategory
      );
      console.log(response);
      setNewItemCategory((prevCategory) => [
        ...prevCategory,
        response.data.category,
      ]);
      closeCategoryForm();
      window.location.reload();
    } catch (error) {
      console.log(error);
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
            <p className="title">Add Category</p>
            <div className="field">
              <label htmlFor="item_category_name">Category Name</label>
              <input
                type="text"
                placeholder="Enter category name"
                name="item_category_name"
                id="item_category_name"
                onChange={handleChange}
              />
            </div>
            <div className="buttons">
              <button type="submit" className="add-buttons">
                Add Category
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Category;
