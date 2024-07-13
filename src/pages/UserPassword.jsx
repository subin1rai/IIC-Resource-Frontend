import React from "react";
import "../styles/userpassword.css";
import Navbar from"../components/Navbar";
import ProfileSide from "../components/Profileside";

const UserPassword =() => {
    return(
        <div className="top">
            <Navbar />
            <div className="side">
                <ProfileSide />
                <div className="passcontent">
                <form>
                <div className="dual">
                <label> Current Password: </label>
                <input type ="text" placeholder="Enter your current password" autoFocus="autofocus"></input>
                </div>
                <div className="dual">
                <label> New Password: </label>
                <input type= "email" placeholder="Enter your new password" ></input>
                </div>
                <div className="dual">
                <label>Confirm Password:</label>
                <input type= "text" placeholder="Re-enter your new password"></input>
            </div>
            <button>Save Changes</button>
            </form>
            </div>
                </div>
            </div>

    );
}
export default UserPassword;