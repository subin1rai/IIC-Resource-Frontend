import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import arrow from "../assets/arrow-right.svg";
import filter from "../assets/filter.svg";
import close from "../assets/close.svg";
import { Link } from "react-router-dom";
import ItemHistory from "../components/ItemHistory";

const SingleItem = () => {
  const [editFormVisiblity, setEditFormVisiblity] = useState(false);

  const handlePopupForm = () => {
    setEditFormVisiblity(true);
  };

  return (
    <div class="flex bg-background h-screen w-screen gap-1">
      <Sidebar />
      <div class="flex flex-col mx-auto gap-3">
        <Topbar />

        {/* Start of top container */}
        <div class=" bg-white  w-[98%] mx-auto h-50 flex flex-col p-5 rounded-md relative">
          <div class="flex  justify-between w-[98%]">
            <div class="flex flex-col gap-1">
              <div class="flex justify-center items-end gap-2 h-10 p-4">
                {" "}
                <h4 class="text-base font-normal">
                  {" "}
                  <Link class="" to={"/inventory"}>
                    Inventory
                  </Link>{" "}
                </h4>
                <img src={arrow} alt="" />
                <h4 class=" text-base font-normal text-blue-400 ">Item Name</h4>
              </div>
              <h2 class=" font-semibold px-4 text-2xl">Copy</h2>
            </div>
            <div class="flex justify-center items-end">
              <button
                class="bg-blue-600 text-white  py-2 px-6  w-fit h-fit rounded-md"
                onClick={handlePopupForm}
              >
                Edit Item
              </button>
            </div>
          </div>
          <div class="w-[98%] mx-auto mt-5 bg-blue-600 h-1"></div>

          <div class="flex px-11 justify-between  mt-7 w-9/12">
            <div class="flex flex-col gap-5">
              <div class="flex gap-4">
                <p class="font-semibold">Item Name:</p>{" "}
                <span class="font-medium"> Copy </span>
              </div>
              <div class="flex gap-4">
                <p class="font-semibold">Measuring unit :</p>{" "}
                <span class="font-medium"> Pieces </span>
              </div>
              <div class="flex gap-4">
                <p class="font-semibold">Low Limit :</p>{" "}
                <span class="font-medium"> 10 </span>
              </div>
            </div>
            <div class="flex flex-col gap-5">
              <div class="flex gap-4">
                <p class="font-semibold">Category :</p>{" "}
                <span class="font-medium"> Assets </span>
              </div>
              <div class="flex gap-4">
                <p class="font-semibold">Product Category :</p>{" "}
                <span class="font-medium"> Black Pen </span>
              </div>
              <div class="flex gap-4">
                <p class="font-semibold">Item Category :</p>{" "}
                <span class="font-medium"> Stationary </span>
              </div>
            </div>
          </div>
        </div>
        {/* End of top container  */}

        <div class=" bg-white  w-[98%] mx-auto flex flex-col p-5 rounded-md">
          <div class="flex justify-between mb-7">
            <h2 class=" font-semibold px-4 text-2xl">Purchase History</h2>
            <div class="flex gap-5">
              <input
                type="text"
                placeholder="Search for history"
                class="border-2 border-gray p-1 pl-3 rounded-md  w-64"
              />
              <button class="bg-white border-2 rounded-md p-1 px-4 flex justify-between items-center gap-3">
                <img src={filter} alt="" /> Filter{" "}
              </button>
            </div>
          </div>
          {/* <div class="w-[98%] mx-auto mt-5 bg-blue-600 h-1"></div> */}
          <ItemHistory />
        </div>
      </div>

      {editFormVisiblity && (
        <form
          action=""
          class="flex absolute z-10 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-9 gap-7 rounded"
        >
          <button
            class="absolute p-2 top-5 right-5"
            onClick={() => {
              setEditFormVisiblity(false);
            }}
          >
            {" "}
            <img src={close} alt="" class="w-3.5 h-3.5  " />
          </button>
          <h4 class="font-semibold text-xl">Edit Items</h4>
          <div class="flex  justify-between items-center">
            <label htmlFor="item_name">Item Name</label>
            <input
              type="text"
              id="item_name"
              placeholder="Enter item name"
              class="border-2 border-gray p-1 pl-3 rounded-md w-64"
              autoFocus
            />
          </div>
          <div class="flex justify-between items-center ">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              class="border-2 border-gray p-1 pl-3 rounded-md w-64"
            >
              <option value="">Select category</option>
            </select>
          </div>
          <div class="flex justify-between items-center ">
            <label htmlFor="item_category">Item Category</label>
            <select
              id="item_category"
              class="border-2 border-gray p-1 pl-3 rounded-md w-64"
            >
              <option value="">Select item category</option>
            </select>
          </div>
          <div class="flex justify-between items-center gap-9">
            <label htmlFor="product_category">Product Category</label>
            <select
              id="product_category"
              class="border-2 border-gray p-1 pl-3 rounded-md w-64"
            >
              <option value="">Select product category</option>
            </select>
          </div>
          <div class="flex justify-between items-center ">
            <label htmlFor="measuring_unit">Measuring Unit</label>
            <input
              type="text"
              id="measuring_unit"
              placeholder="Enter measuring unit"
              class="border-2 border-gray p-1 pl-3 rounded-md w-64"
            />
          </div>
          <div class="flex justify-between items-center ">
            <label htmlFor="low_limit">Low Limit</label>
            <input
              type="number"
              id="low_limit"
              placeholder="Enter low limit"
              class="border-2 border-gray p-1 pl-3 rounded-md w-64"
            />
          </div>
          <button class="bg-blue-500 w-fit px-5 text-white py-2 rounded self-end">
            Save Edit
          </button>
        </form>
      )}

      {editFormVisiblity && (
        <div
          class="w-screen h-screen bg-overlay cursor-pointer absolute"
          onClick={() => {
            setEditFormVisiblity(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default SingleItem;
