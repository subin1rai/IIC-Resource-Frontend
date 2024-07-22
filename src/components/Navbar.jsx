import React from "react";
import logo from "../assets/Top.png";
import userprofile from "../assets/user.svg";

const Navbar = () => {
  return (
    <>
      {/* navbar main container */}
      <nav className="w-screen bg-white h-28 flex justify-around items-center px-10 shadow-md gap-48">
        <img className="" src={logo} />
        {/* Nav items */}
        <div className="flex justify-between items-center gap-20 text-xl font-normal text-black">
          <span>Home</span>
          <span>Request</span>

          <div className="flex gap-10 ">
            <img src={userprofile} alt="userProfile" className="h-8 w-8 " />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
