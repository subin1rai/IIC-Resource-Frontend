import React from "react";
import NavTable from "../components/NavTable";
// import search from "../assets/search.png";
import "../styles/userrequest.css";
import Navbar from "../components/Navbar";


const UserRequest = () =>{
    return(
        <div className="nav">
        <Navbar/>
        <div className="requestcontent">
            <form action="" className="request-form">
                <h1>Request Resource</h1>
                <h5>You can request the resource of your choice</h5>
                

            </form>
        </div>
        </div>

    );
}
export default UserRequest;