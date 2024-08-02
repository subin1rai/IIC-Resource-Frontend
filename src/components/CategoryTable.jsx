import React, { useEffect, useState } from "react";
import Ctable from "../components/Ctable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import close from "../assets/close.svg";

const Category = () => {
  const [category, setCategory] = useState([]);
  const [newCategory, setNewCategory] = useState({ category_name: "" });
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [error, setError] = useState(""); // Move inside the component
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try{
        const response = await axios.get("http://localhost:8898/api/category", 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
    setError("");
    setAddFormVisibility(false);
  };

  const handleChange = (e) => {
    setNewCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(e.target.value);
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
        newCategory,
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
            <div className='flex flex-col bg-white w-[50vw] rounded '>
              <div className="flex  justify-between p-10 ">
            <h1 className="text-lg font-bold ">Category</h1>
            <button className="bg-blue-600 text-white py-2 px-3 rounded" onClick={displayAddPopup}>
              Add Category
            </button>
            </div>
            <Ctable category={category} onDelete={handleDeleteSubmit} />
      </div>

       

        {addFormVisibility && (
          <>
            <div className="overlay-category" onClick={closeCategoryForm}></div>
            <form action="" onSubmit={handleSubmit} className="category-form">
              <button
                type="button"
                className="discard-button"
                onClick={closeCategoryForm}
              >
                <img src={close} alt="Close" />
              </button>
              <p className="title">Add Category</p>
              <h2>Example: Assest, Consumable</h2>
              <div className="field">
                <label htmlFor="category_name">Category</label>
                <input
                  type="text"
                  placeholder=""
                  name="category_name"
                  autoFocus="autofocus"
                  id="category_name"
                  onChange={handleChange}
                />
              </div>

              {error && <span className="text-red-500 ml-4">{error}</span>}
              {/* button  of category */}
              <div className="buttons">
                <button type="submit" className="add-buttons">
                  Add Category
                </button>
              </div>
            </form>
          </>
        )}
    
    </>
  );
};

export default Category;



