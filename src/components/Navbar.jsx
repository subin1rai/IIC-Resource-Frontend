import React from "react";
import "../styles/navbar.css";
import logo from "../assets/Top.png";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const setActiveClass = ({ isActive }) =>
    isActive ? "active item-text" : "item-text";

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(" http://localhost:8898/api/login");
      navigate("/");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const token = localStorage.getItem("token");
  console.log(token);
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
        <NavLink to="/aboutus" className={setActiveClass}>
          {" "}
          Request History{" "}
        </NavLink>
        {!token ? (
          <button className="btn">
            <NavLink to="/" onClick={handleLogin} className={setActiveClass}>
              {" "}
              Login{" "}
            </NavLink>
          </button>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
};
export default Navbar;
