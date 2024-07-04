import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/category.css";
import axios from "axios";

const Category = () => {
    const [category,setCategory] = useState({
      category_name:"",

    });

    const [addFormVisibility, setAddFormVisibility] = useState(false);

    const displayAddPopup = () => {
      setAddFormVisibility(true);
    };
  
    const closeCategoryForm = () => {
      setAddFormVisibility(false);
    };

    const handleChange = (e) => {
      setCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      console.log(e.target.value);
    };
  
    const handlesubmit = async (event) => {
      event.preventDefault();
  
      try {
        const response = await axios.post(
          "http://localhost:8898/api/addCategory",
          category
        );
  
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(()=>{},[])
  return (
    <div className="category">
      <Sidebar />
      <div className="category-main">
        <Topbar />
        <div className="main-container">
          <div className="first">
           <div className="category-title">
           <p> Category</p>
           </div>

           <div className="icon-action">

            <button className="add-button" onClick={displayAddPopup}>
                Category
              </button>
              </div>

              <div className="tables">
            <table>
              <thead>
                <tr>
                  <th scope="col">SN</th>
                  <th scope="col">Category Name</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Chris</th>
                  <td>HTML tables</td>
                  <td>22</td>
                </tr>
                <tr>
                  <th scope="row">Dennis</th>
                  <td>Web accessibility</td>
                  <td>45</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {addFormVisibility && (
        <form action="" onSubmit={handlesubmit} className="category-form">
          <button
            type="button"
            className="discard-button"
            onClick={closeCategoryForm}
          >
            <img src={close} alt="" />
          </button>
          <p className="title">Add Category</p>
          <div className="field">
            <label htmlFor="category_name">Category Name</label>
            <input
              type="text"
              placeholder="Enter category name"
              name="category_name"
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

      {addFormVisibility && (
        <div className="overlay-category" onClick={closeCategoryForm}></div>
      )}

    </div>
  );
};

export default Category;
