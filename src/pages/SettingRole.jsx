import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SettingsSide from "../components/SettingsSide";


const SettingRole = () => {
  return (
    <div className="flex bg-background h-screen w-screen gap-1">

      <Sidebar /> {/* Rendering Sidebar component */}
      <div className="flex flex-col mx-auto gap-3">
        <Topbar /> {/* Rendering Topbar component */}


        {/* Start of top container */}
        <div className="bg-white w-[85.5vw] mx-auto  h-[100vh] flex p-5 rounded-md  relative ">
          <div className="justify-between gap-4">
            <h1 className="font-bold text-xl"> Settings </h1>
            <div className="gap-12">
              <SettingsSide />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingRole;
