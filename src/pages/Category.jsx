import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CategoryTable from "../components/CategoryTable";
import ItemCategoryTable from "../components/ItemCategoryTable";
import ProductCategoryTable from "../components/ProductCategoryTable";
import "../styles/category.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Category = () => {
  return (
    <div className="category">
      <Sidebar />
      <div className="category-main">
        <Topbar />
        <div className="main-container">
          <CategoryTable />
          <ItemCategoryTable />
          <ProductCategoryTable />
        </div>
      </div>
    </div>
  );
};

export default Category;
