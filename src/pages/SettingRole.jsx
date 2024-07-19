import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "axios";
import { Link } from "react-router-dom";

const SettingRole = () => {
  return (
    <div className="flex bg-background h-screen w-screen gap-1">
      <Sidebar /> {/* Rendering Sidebar component */}
      <div className="flex flex-col mx-auto gap-3">
        <Topbar /> {/* Rendering Topbar component */}
        {/* Start of top container */}
        <div className="bg-white w-[85.5vw] mx-auto  h-[100vh] flex p-5 rounded-md  relative ">
          <div className="flex justify-between gap-4"></div>
        </div>
      </div>
    </div>
  );
};

export default SettingRole;
