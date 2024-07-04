import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/category.css";
import axios from "axios";

const Category = () => {
  const [category, setCategory] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);  
  useEffect(() => {

    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await axios.get('http://localhost:8898/api/category');
        console.log(response.data);
        setCategory(response.data.category ||[]);
        setLoading(false);
      } catch (error) {
        if(axios.isCancel(error)){
          log('Request Canceled',error.message);
          return;
        }
        setError(true);
        setLoading(false);
      }
    })();
    //cleanup code
    return () =>{
      controller.abort();
    }
  }, []);

  if (error) {
    return <h1>Something went wrong</h1>;
  }
  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="category">
      <Sidebar />
      <div className="category-main">
        <Topbar />
        <div className="main">
          <p className="title">Categories</p>
          <div className="first">
            <div className="head">
              <p>Category</p>
              <button>Add Category</button>
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
                  {category.map((cat, index) => (
                    <tr key={cat.category_id}>
                      <th scope="row">{index + 1}</th>
                      <td>{cat.category_name}</td>
                      <td>
                        <button>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;

