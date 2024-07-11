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
            <h1>Request Resources</h1>
            
                <NavTable />
        </div>
        </div>

    );
}
export default UserRequest;