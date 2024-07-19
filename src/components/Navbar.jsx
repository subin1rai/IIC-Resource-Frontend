import React from "react";
import "../styles/navbar.css";
import logo from "../assets/Top.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import userProfile from "../assets/profile.png";
import logout from "../assets/logout.svg";

const Navbar = () => {
  const setActiveClass = ({ isActive }) =>
    isActive ? "active item-text" : "item-text";

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Sending logout request");
      const response = await axios.post(
        "http://localhost:8898/api/logout",
        {},
        {
          withCredentials: true,
        }
      );
      localStorage.clear();
      console.log("Logout response:", response);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const token = localStorage.getItem("token");
  return (
    <div className="navbar">
      <div className="logo">
        <img src={logo} alt="main logo" />
      </div>
      <div className="navright">
        <NavLink to="/userhome" className={setActiveClass}>
          {" "}
          Home{" "}
        </NavLink>
        <NavLink to="/userrequest" className={setActiveClass}>
          {" "}
          Request{" "}
        </NavLink>
        {!token ? (
          <button className="btn">
            <NavLink to="/" onClick={handleLogin} className={setActiveClass}>
              {" "}
              Login{" "}
            </NavLink>
          </button>
        ) : (
          <>
            <Link to="/userProfile">
              <img src={userProfile} alt="" srcset="" className="w-10" />
            </Link>
            <button onClick={handleLogout}>
              <img src={logout} alt="" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default Navbar;
