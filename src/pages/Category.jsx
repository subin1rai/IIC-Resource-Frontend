import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/category.css";
import axios from "axios";

const Category = () => {
    const [category,setCategory] = useState([])

    useEffect(()=>{},[])
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
    </div>
  );
};

export default Category;
