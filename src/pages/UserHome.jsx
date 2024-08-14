import React from "react";
import Navbar from "../components/Navbar";
import resource from "../assets/person.png";
import { Link } from "react-router-dom";
import heroImage from "../assets/heroImage.svg"

const UserHome = () => {
  return (
    <div className="">
      <Navbar />
      <div className="flex items-center justify-center h-[80vh] w-screen gap-44">
        <div className="flex flex-col gap-5 justify-center items-center">
          <h1 className="text-7xl font-extrabold">
            FIND
            <span className=" ml-3 text-blue-900">RESOURCES</span>
          </h1>
          <p className="text-2xl font-medium">Access The Tools You Need, With Just A Click!</p>
          <button className="bg-button px-6 py-4 rounded-lg w-fit text-white mt-4">
            Request Now
          </button>
        </div>
        <img src={heroImage} alt="" />
      </div>
    </div>



  );
};

export default UserHome;
