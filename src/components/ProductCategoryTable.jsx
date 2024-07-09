import React, { useEffect, useState } from "react";
import "../styles/category.css";
import Ptable from "../components/Ptable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import close from "../assets/close.svg";

const Category = () => {
  const [productCategory, setProductCategory] = useState([]);
  const [newProductCategory, setNewProductCategory] = useState({ product_category_name: "" });
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/productCategory");
        console.log(response.data);
        setProductCategory(response.data.allData || []);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request Canceled", error.message);
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
    setNewProductCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDeleteSubmit = async (categoryId) => {
    try {
      await axios.delete(
        `http://localhost:8898/api/deleteProductCategory/${categoryId}`
      );
      setProductCategory((prevCategory) =>
        prevCategory.filter((cat) => cat.product_category_id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8898/api/addProductCategory",
        newProductCategory
      );
      setProductCategory((prevCategory) => [...prevCategory, response.data.category]);
      closeCategoryForm();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="overall-category"></div>
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
        <Ptable productCategory={productCategory} setProductCategory={setProductCategory} />
        {addFormVisibility && (
          <form onSubmit={handleSubmit} className="category-form">
            <button
              type="button"
              className="discard-button"
              onClick={closeCategoryForm}
            >
              <img src={close} alt="Close" />
            </button>
            <p className="title">Add Category</p>
            <div className="field">
              <label htmlFor="product_category_name">Category Name</label>
              <input
                type="text"
                placeholder="Enter category name"
                name="product_category_name"
                id="product_category_name"
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

        {addFormVisibility && (
          <div className="overlay-category" onClick={closeCategoryForm}></div>
        )}
      </div>
    </>
  );
};

export default Category;
