import React from "react";
import logo from "../assets/Top.png";
import userprofile from "../assets/userProfile.svg";
import { Link } from "react-router-dom";
import notificationIcon from "../assets/notification.svg"

const Navbar = () => {
  return (
    <nav className="flex items-center w-screen p-5 justify-around">
      <img src={logo} alt="" />
      {/* Nav items */}
      <div className="flex gap-14 text-lg px-10 font-medium">
        <p>Home</p>
        <p>Request</p>
        <p>History</p>
        <p>How to?</p>
      </div>
      <div className="flex gap-4">
        <img src={notificationIcon} alt="" />
        <div className="h-9 w-9 rounded-full bg-slate-500">

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
