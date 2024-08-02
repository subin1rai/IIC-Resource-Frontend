import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CategoryTable from "../components/CategoryTable";
import Features from "../components/Features";
import ItemCategoryTable from "../components/ItemCategoryTable";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Category = () => {
  return (
    <div className="w-screen h-screen flex justify-between bg-background ">
      <Sidebar />
      <div className="flex flex-col">
        <Topbar />
        <div className="flex flex-col w-[86.5vw] gap-5 justify-center mt-5">
          <CategoryTable /> 
          <ItemCategoryTable />
          <Features />
        </div>
        </div>
    </div>
  );
};

export default Category;