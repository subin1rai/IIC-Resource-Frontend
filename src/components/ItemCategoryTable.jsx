import React, { useEffect, useState } from "react";
import "../styles/category.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [Itemcategory, setItemCategory] = useState([]);
  const [newItemCategory, setItemNewCategory] = useState({item_category_name: ""});
  const [deleteItemCategory, setDeleteItemCategory] = useState('');
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const response = await axios.get('http://localhost:8898/api/itemCategory');
        console.log(response.data);
        setItemCategory(response.data.allData || []);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request Canceled', error.message);
          return;
        }
      }
    })();
    return () => {
      controller.abort();
    }
  }, []);

  const displayAddPopup = () => {
    setAddFormVisibility(true);
  };

  const closeCategoryForm = () => {
    setAddFormVisibility(false);
  };

  const handleChange = (e) => {
    setItemNewCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(e.target.value);
  };

  const handleDeleteSubmit = async (categoryId) => {
    try {
      const response = await axios.delete(`http://localhost:8898/api/deleteItemCategory/${categoryId}`);
      console.log(response.data);
      setItemCategory((prevCategory) => prevCategory.filter(cat => cat.category_id !== categoryId));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request Canceled', error.message);
        return;
      }
    }
    window.location.reload();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8898/api/addItemCategory",
        newItemCategory
      );
      console.log(response);
      setItemCategory((prevCategory) => [...prevCategory, response.data.allData]);
      closeCategoryForm();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
   
          <div className="first">
            <div className="head">
              <p>Item Category</p>
              <button className="add-buttons" onClick={displayAddPopup}> 
                Add Category
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
                  {Itemcategory.map((cat, index) => (
                    <tr key={cat.item_category_id}>
                      <th scope="row">{index + 1}</th>
                      <td>{cat.item_category_name}</td>
                      <td>
                        <button onClick={() => handleDeleteSubmit(cat.item_category_id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
    

      {addFormVisibility && (
        <form action="" onSubmit={handleSubmit} className="category-form">
          <button
            type="button"
            className="discard-button"
            onClick={closeCategoryForm}
          >
            <img src={"../assets/close.svg"} alt="Close" />
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

      {addFormVisibility && (
        <div className="overlay-category" onClick={closeCategoryForm}></div>
      )}
    </div>
  );
};

export default Category;
