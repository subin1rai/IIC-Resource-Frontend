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
    <div className="w-screen h-screen flex bg-background">
    <Sidebar />
    <div className="flex flex-col gap-4 mx-auto  items-center  w-full">
      <Topbar />
        <div className='flex flex-col mx-auto gap-5'>
          {/* importing category tables from components */}
          <CategoryTable />
          <ItemCategoryTable />

          <Features />
      </div>
      </div>
    </div>
  );
};

export default Category;