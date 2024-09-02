import React from "react";
import logo from "../assets/Top.png";
import userprofile from "../assets/userProfile.svg";
import { NavLink } from "react-router-dom";
import notificationIcon from "../assets/notification.svg"
import userProfile from "../assets/userProfile.svg"

const Navbar = () => {
  return (
    <nav className="flex items-center w-screen p-5 justify-around">
      <img src={logo} alt="" />
      {/* Nav items */}
      <div className="flex gap-14 text-lg px-10 font-medium">
        <NavLink to="/userHome">Home</NavLink>
        <NavLink to="/userRequest">Request</NavLink>
        <NavLink to="/userHistory">History</NavLink>
        <NavLink to="/userHowto" >How to?</NavLink>

      </div>
      <div className="flex gap-5">
        <img src={notificationIcon} alt="" />
        <img src={userProfile} alt="" />
      </div>
    </nav>
  );
};

export default Navbar;
