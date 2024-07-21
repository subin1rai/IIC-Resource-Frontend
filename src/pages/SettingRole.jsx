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
        <div className="bg-white w-[85.5vw] mx-auto  h-screen flex p-5 rounded-md  relative ">
          <div className="justify-between gap-4">
            <div className="gap-12">
              <SettingsSide />
            </div>
          </div>
          <div className="  h w-[75vw]">
            <div className="head px-10 pt-10  flex justify-between ">
              <div className="title">
                <h1 className="text-3xl font-semibold ">Roles</h1>
                <p className="text-sm font-medium">Manage user roles</p>
              </div>
              <div className="bg-blue-600 p-3 item-center flex items-center rounded-md">
                <button
                  className=" text-white flex justify-center items-center gap-3 px-2 "
                  onClick={""}
                >
                  {""}
                  <i class="fa-solid fa-plus"></i> Add User
                </button>
              </div>
            </div>
            <hr className=" mt-5 h-1 bg-gray border-none  mx-auto w-[95%]" />
            <div className="p-8">
            <div class="relative overflow-x-auto flex justify-center items-center ">
    <table class="w-[95%] text-sm text-center text-gray-500 dark:text-gray-400">
        <thead class="text-xs border-b border-gray-200 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-10 py-3">
                    S.No.
                </th>
                <th scope="col" class="px-10 py-3">
                    User Name
                </th>
                <th scope="col" class="px-10 py-3">
                    Email Address
                </th>
                <th scope="col" class="px-10 py-3">
                    Role
                </th>
                <th scope="col" class="px-10 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-10 py-4 font-medium text-gray-900 whitespace-nowrap ">
                   1
                </th>
                <td class="px-10 py-4">
                    Subin Rai
                </td>
                <td class="px-10 py-4">
                    NP05CPA220125@iic.edu.np
                </td>
                <td class="px-10 py-4">
                    user
                </td>
                <td class="px-10 py-4">
                   <button><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </td>
            </tr>
            <tr class="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-10 py-4 font-medium text-gray-900 whitespace-nowrap ">
                   2
                </th>
                <td class="px-10 py-4">
                    Anir Jung Thapa
                </td>
                <td class="px-10 py-4">
                    NP05CPA220125@iic.edu.np
                </td>
                <td class="px-10 py-4">
                    user
                </td>
                <td class="px-10 py-4">
                   <button><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </td>
            </tr>
            <tr class="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-10 py-4 font-medium text-gray-900 whitespace-nowrap">
                   3
                </th>
                <td class="px-10 py-4">
                   Mahima Gurung
                </td>
                <td class="px-10 py-4">
                    NP05CPA220125@iic.edu.np
                </td>
                <td class="px-10 py-4">
                    Admin
                </td>
                <td class="px-10 py-4">
                <button><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </td>
            </tr>
            <tr class="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-10 py-4 font-medium text-gray-900 whitespace-nowrap">
                   4
                </th>
                <td class="px-10 py-4">
                   Lizan Shrestha
                </td>
                <td class="px-10 py-4">
                    NP05CPA220125@iic.edu.np
                </td>
                <td class="px-10 py-4">
                    Admin
                </td>
                <td class="px-10 py-4">
                <button><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
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
