import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CategoryTable from "../components/CategoryTable";
import Features from "../components/Features";
import ItemCategoryTable from "../components/ItemCategoryTable";
import ProductCategoryTable from "../components/ProductCategoryTable";
import "../styles/category.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Category = () => {
  return (
    <div className="category">
      {/* Importing sidebar */}
      <Sidebar />
      <div className="category-main">
        {/* Importing topbar */}
        <Topbar />
        <div className="main-container">
          {/* importing category tables from components */}
          <CategoryTable />
          <ItemCategoryTable />
          <ProductCategoryTable />
          <Features />
        </div>
      </div>
    </div>
  );
};

export default Category;