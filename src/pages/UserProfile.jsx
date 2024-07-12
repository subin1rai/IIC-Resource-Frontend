import React from "react";
import "../styles/userprofile.css";
import Navbar from "../components/Navbar";
import ProfileSide from "../components/Profileside";

const UserProfile = () => {
    return(
        <div className="side">
        <ProfileSide />
        <div className="top">
            <Navbar />
        <div className="content">
            <div className="main">
            <form>
                <label> Full Name: </label>
                <input type ="text" ></input>
                <label> Email Address: </label>
                <input type= "email" ></input>
                <label>Phone Number:</label>
                <input type= "text"></input>
            </form>
    </div>
    </div>
    </div>
</div>
    );
}
export default UserProfile;