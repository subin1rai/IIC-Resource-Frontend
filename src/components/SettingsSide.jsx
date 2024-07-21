import React from "react";
import profile from "../assets/adminuser.png";
import manage from "../assets/manage.png";
import help from "../assets/help.png";
import user from "../assets/user.svg";
import notify from "../assets/notify.png";
import {NavLink} from "react-router-dom";

const SettingsSide =() =>{
    return(
        <div className="bg-blue-50 rounded-xl w-fit h-[32vw] p-5 mt-4">
          <div className="flex gap-3">
          <img className= "h-20 w-20" src ={user}></img>
            <div className="flex flex-col">
            <p className=" font-semibold text-3xl"> Mahima Gurung </p>
            <p className=" font-light text-xl"> Your Personal Account</p>
            </div>
            </div>
            <div className="sidebar-items">
          <div className="flex items-center gap-5">
            <img src={profile} alt="" />
            <NavLink to="/settings" >
              Profile
            </NavLink>
          </div>
          <div className="flex items-center gap-5">
            <img src={manage} alt="" />
            <NavLink to="/manageroles" >
              Manage Roles
            </NavLink>
          </div>
          <div className="flex items-center gap-5">
            <img src={help} alt="" />
            <NavLink to="/help" >
              Help & Support
            </NavLink>
          </div>
          <div className="flex items-center gap-5">
            <img src={notify} alt="" />
            <NavLink to="/notify" >
              Notification
            </NavLink>
        </div>
        </div>
        </div>
    );
}
export default SettingsSide;