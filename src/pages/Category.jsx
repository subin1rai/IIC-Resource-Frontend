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
      <div className="w-screen h-screen flex bg-background gap-1">
      <Sidebar />
      {/* top bar div */}
      <div className='flex flex-col gap-4'>
        <Topbar />
  
          <CategoryTable />
          <ItemCategoryTable />
      
          <Features />
     
      </div>
    </div>
  );
};

export default Category;