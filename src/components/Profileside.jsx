import React from "react";
import "../styles/profileside.css";
import profile from "../assets/profile.png";
import lock from "../assets/lock.png";
import theme from "../assets/theme.png";
import logout from "../assets/logout.svg";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate from React Router
import axios from "axios";

const ProfileSide =() => {
    const setActiveClass = ({ isActive }) =>
        isActive ? "active item-text" : "item-text";
    
      const navigate = useNavigate();
    
      const handleLogout = async () => {
        try {
          const response = await axios.post(" http://localhost:8898/api/logout");
          navigate("/");
          console.log(response);
        } catch (error) {
          console.log(error);  
        }
      };
    return(
        <div className="bar">
            <h1> My Profile </h1>
            <div className="sidebar-items">
          <div className="item">
            <img src={profile} alt="" />
            <NavLink to="/userprofile" className={setActiveClass}>
              Basic Information
            </NavLink>
          </div>
          <div className="item">
            <img src={lock} alt="" />
            <NavLink to="/password" className={setActiveClass}>
              Password
            </NavLink>
          </div>
          <div className="item">
            <img src={theme} alt="" />
            <NavLink to="/darktheme" className={setActiveClass}>
              Dark Theme
            </NavLink>
          </div>
          <div className="item">
            <img src={logout} alt="" />
            <NavLink to="/logout" onClick = {handleLogout} className={setActiveClass}>
              Logout
            </NavLink>
        </div>
        </div>
        </div>
    );
}
export default ProfileSide;