import React from "react";
import "../styles/userhome.css";
import Navbar from "../components/Navbar";
import big from "../assets/biglayout.png";
import small from "../assets/smalllayout.png";
import search from "../assets/search.png";
import person from "../assets/person.png";


const UserHome =() =>{
    return(
        <div className="homecontainer">
            <Navbar />
            <div className="homecontent">
                <div className="content">
                <h1> Find Resources For You</h1>
                <h3>We are the bridge</h3>
                {/* <input type="te xt" placeholder="Search resources..."> 
                {/* <img src={search} alt ="searchicon" />                 
                </input> */}
                <div className="btn">
                    <button>Request</button>
                </div>
                </div>
                <div className="right2">
                    <img className="big" src ={big} alt="biglayout" />
                    <img className= "small" src ={small} alt="smalllayout" />
                    <img className = "person" src={person} alt ="person-image" />
                </div>
            </div>
        </div>
    );
}
export default UserHome;