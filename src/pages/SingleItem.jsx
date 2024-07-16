import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const SingleItem = () => {
  return (
    <div class="flex bg-background h-screen w-screen gap-1">
      <Sidebar />
      <div class="flex flex-col gap-1 mx-auto">
        <Topbar />
        <div class=" bg-white w-10/12  h-50 ">
          <div class="flex "></div>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
