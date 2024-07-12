import React from "react";
import "../styles/navtable.css";
import academics from "../assets/academics.png";
import sports from "../assets/sports.png";
import stationaries from "../assets/stationaries.png";
import electronics from "../assets/electronics.png";
import events from "../assets/events.png";
import { NavLink, useNavigate } from "react-router-dom";

const NavTable = () =>{
    const setActiveClass = ({ isActive }) =>
        isActive ? "active item-text" : "item-text";
    
      const navigate = useNavigate();
    
    //   const handleLogin = async () => {
    //     try {
    //       const response = await axios.post(" http://localhost:8898/api/login");
    //       navigate("/");
    //       console.log(response);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   };

    //   const handleLogin = async () => {
    //     try {
    //       const response = await axios.post(" http://localhost:8898/api/login");
    //       navigate("/");
    //       console.log(response);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   };
    return(
        <div className="navtable">
        <div className="item">
        <img src ={academics} alt="academicicon" />
        <NavLink to="/userrequest" className = {setActiveClass}> Academics </NavLink>
        </div>
        <div className="item">
        <img src ={sports} alt="sportsicon" />
        <NavLink to ="/sports" className = {setActiveClass}> Sports </NavLink>
        </div>
        <div className="item">
        <img src = {stationaries} alt="stationaryicon" />
         <NavLink to ="/stationaries" className = {setActiveClass}> Stationaries </NavLink>
         </div>
         <div className="item">
         <img src ={electronics} alt="electronicsicon" />
         <NavLink to ="/electronics" className = {setActiveClass}> Electronics </NavLink>
         </div>
         <div className="item">
         <img src ={events} alt="eventsicon" />
         <NavLink to ="/events" className = {setActiveClass}> Events </NavLink>
         </div>
        </div>
    );
}
export default NavTable;