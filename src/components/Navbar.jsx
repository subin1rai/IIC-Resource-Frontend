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
  return (
        <div className="navbar">
          <div className="logo">
        <img src={logo} alt="main logo" />
      </div>
      <div className="navright">
        <div className="first">
        <NavLink to="/userhome" className = {setActiveClass}> Home </NavLink>
        </div>
        <div className="second">
        <NavLink to ="/userrequest" className = {setActiveClass}> Request </NavLink>
        </div>
        <div className="third">
         <NavLink to ="/requesthistory" className = {setActiveClass}> Request History </NavLink>
         </div>
         <div className="fourth">
         <NavLink to ="/" onClick={handleLogin} className={setActiveClass}> Login </NavLink>
         </div>
        </div>
        </div>
  );     
}
export default Navbar;
