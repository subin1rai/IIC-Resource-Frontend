import React from "react";
import logo from "../assets/Top.png";
import userprofile from "../assets/user.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      {/* navbar main container */}
      <nav className="w-screen bg-white h-28 flex justify-around items-center px-10 shadow-md gap-48">
        <img className="" src={logo} />
        {/* Nav items */}
        <div className="flex justify-between items-center gap-20 text-xl font-normal text-black">
          <Link to="/userhome">Home</Link>
          <Link to="/userRequest">Request</Link>

          <div className="flex gap-10 ">

            <Link to="/userProfile">
              <img src={userprofile} alt="userProfile" className="h-8 w-8 " />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
