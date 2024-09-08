import React from "react";
import Navbar from "../components/Navbar";
import resource from "../assets/person.png";

import heroImage from "../assets/heroImage.svg";
import Chat from "../components/Chat";

import { NavLink, Link } from "react-router-dom";

const UserHome = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="absolute">
      <Navbar />
      <div className="flex items-center justify-center h-[80vh] w-screen gap-44">
        <div className="flex flex-col gap-5 justify-center items-center">
          <h1 className="text-7xl font-extrabold">
            FIND
            <span className=" ml-3 text-blue-900">RESOURCES</span>
          </h1>
          <p className="text-2xl font-medium">
            Access The Tools You Need, With Just A Click!
          </p>
          <button className="bg-button px-8 py-4 rounded-lg w-fit text-white mt-4 text-2xl ">
            <Link to="/userRequest">Request Now</Link>
          </button>
        </div>
        <img src={heroImage} alt="" />
      </div>
      <div className="absolute right-12 -bottom-12">
        <Chat />
      </div>
    </div>
  );
};

export default UserHome;
