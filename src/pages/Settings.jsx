import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Settings = () => {
  return (
    <div class="flex bg-background gap-1">
      <Sidebar />
      <div class="flex flex-col">
        <Topbar />
      </div>
    </div>
  );
};

export default Settings;
