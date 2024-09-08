import React, { useState, useEffect } from "react";
import logo from "../assets/Top.png";
import userprofile from "../assets/userProfile.svg";
import { NavLink } from "react-router-dom";
import notificationIcon from "../assets/notification.svg";
import userProfile from "../assets/userProfile.svg";
import logout from "../assets/logout.svg";
import axios from "axios";
import email from "../assets/email.png";
import phone from "../assets/phone.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const [bgColor, setBgColor] = useState(() => {
    return localStorage.getItem("initialsBgColor") || getRandomColor();
  });
  const [initials, setInitials] = useState("");

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = async () => {
    try {
      console.log("Sending logout request");
      const response = await axios.post(
        `${apiBaseUrl}/api/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const userInfo = useSelector((state) => state.user.userInfo);
  const fullName = userInfo?.user_name || null;

  useEffect(() => {
    if (fullName) {
      const nameParts = fullName.trim().split(" ");

      let initials = "";
      if (nameParts.length === 1) {
        initials = nameParts[0][0];
      } else if (nameParts.length >= 2) {
        initials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
      }

      setInitials(initials.toUpperCase());

      if (!localStorage.getItem("initialsBgColor")) {
        localStorage.setItem("initialsBgColor", bgColor);
      }
    }
  }, [bgColor]);

  const navigate = useNavigate();

  const openChangePassword = () => {
    navigate("/changePassword");
  };

  return (
    <nav className="flex items-center w-screen p-5 justify-around">
      <img src={logo} alt="" />
      {/* Nav items */}
      <div className="flex gap-14 text-lg px-10 font-medium">
        <NavLink to="/userHome">Home</NavLink>
        <NavLink to="/userRequest">Request</NavLink>
        <NavLink to="/requestHistory">History</NavLink>
      </div>
      <div className="flex gap-5">
        <img src={notificationIcon} alt="" />
        <details className="relative">
          <summary className="list-none cursor-pointer ">
            {/* <img src={userProfile} alt="" /> */}
            <div
              className="h-10 w-10 rounded-full flex justify-center items-center select-none font-semibold text-white"
              style={{ backgroundColor: bgColor }}
            >
              {initials}
            </div>
          </summary>
          <ul className="absolute right-[50%] bg-white w-[16vw] border-2 border-neutral-300 rounded p-4 top-11 ">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <div
                  className="h-10 w-10 rounded-full flex justify-center items-center select-none font-semibold text-white"
                  style={{ backgroundColor: bgColor }}
                >
                  {initials}
                </div>
                <h1 className="font-medium text-xl text-nowrap ">{fullName}</h1>
              </div>
              <hr className="border-[1px] border-neutral-300 mt-2 "></hr>
              <div className="flex items-center gap-2">
                <img className="w-6 h-6" src={email} alt="" />
                <li className="py-2 text-blue-600">{userInfo.user_email}</li>
              </div>
              <div className="flex items-center gap-2">
                <img className="w-6 h-6" src={phone} alt="" />
                <li className="py-2 text-blue-600">{userInfo.contact}</li>
              </div>
              <NavLink to="/" onClick={handleLogout}>
                <div className="flex gap-6">
                  <img src={logout} className="text-black" alt="" />
                  <p> Log out</p>
                </div>
              </NavLink>
              <button
                className="w-[100%] bg-blue-600 rounded p-2 mt-2 text-white "
                onClick={openChangePassword}
              >
                Change Password
              </button>
            </div>
          </ul>
        </details>
      </div>
    </nav>
  );
};

export default Navbar;
