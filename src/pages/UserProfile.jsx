import React from "react";
import "../styles/userprofile.css";
import Navbar from "../components/Navbar";
import ProfileSide from "../components/Profileside";
import img from "../assets/img.png";

const UserProfile = () => {
    return(
        <div className="top">
            <Navbar />
        <div className="profileside">
        <ProfileSide />
       <div className="content">
            <form>
            <div className="maincontent">
                <div className="field">
                <label> Full Name: </label>
                <input type ="text" autoFocus="autofocus"></input>
                </div>
                <div className="field">
                <label> Email Address: </label>
                <input type= "email" ></input>
                </div>
                <div className="field">
                <label>Phone Number:</label>
                <input type= "text"></input>
            </div>
            <button>Save Changes</button>
            </div>
            <div className="image">
                <img src={img} alt =""/>
            </div>
            </form>
            </div>
    </div>
    </div>
    );
}
export default UserProfile;