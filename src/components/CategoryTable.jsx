import React, { useEffect, useState } from "react";
import "../styles/category.css";
import Ctable from "../components/Ctable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import close from "../assets/close.svg";

const Category = () => {
  const [category, setCategory] = useState([]);
  const [newCategory, setNewCategory] = useState({ category_name: "" });
  const [deleteCategory, setDeleteCategory] = useState("");
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/category");
        console.log(response.data);
        setCategory(response.data.category || []);
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
    setNewCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(e.target.value);
  };

  const handleDeleteSubmit = async (categoryId) => {
    try {
      const response = await axios.delete(
        "http://localhost:8898/api/deleteCategory/${categoryId}"
      );
      console.log(response.data);
      setCategory((prevCategory) =>
        prevCategory.filter((cat) => cat.category_id !== categoryId)
      );
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request Canceled", error.message);
        return;
      }
    }
    window.location.reload();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8898/api/addCategory",
        newCategory
      );
      console.log(response);
      setCategory((prevCategory) => [...prevCategory, response.data.category]);
      closeCategoryForm();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="overall-category">
        <h3 className="category-title">Categories</h3>
      </div>

      <div className="first">
        <div className="head">
          <div className="container">
            <p>Category</p>
          </div>

          <div className="icons">
            <button className="add-buttons" onClick={displayAddPopup}>
              Add Category
            </button>
          </div>
        </div>
        <Ctable category={category} />

        {addFormVisibility && (
          <form action="" onSubmit={handleSubmit} className="category-form">
            <button
              type="button"
              className="discard-button"
              onClick={closeCategoryForm}
            >
              <img src={close} alt="Close" />
            </button>
            <p className="title">Add Category</p>
            <div className="field">
              <label htmlFor="category_name">Category</label>
              <input
                type="text"
                placeholder="eg:Assets/Consumables/Returnable"
                name="category_name"
                autoFocus="autofocus"
                id="category_name"
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
