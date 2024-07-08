import React from "react";
import "../styles/userhome.css";
import Navbar from "../components/Navbar";


const UserHome =() =>{
    return(
        <div className="homecontainer">
            <Navbar />
            <div className="homecontent">
                <h1> Find Resources For You</h1>
                <h3>We are the bridge</h3>
                <input type="text" placeholder="Search resources..."/>
                <div className="btn">
                    <button>Request</button>
                </div>
            </div>
        </div>
    );
}
export default UserHome;