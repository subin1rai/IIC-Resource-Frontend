import * as React from "react";
import front from "../assets/arrow-right.svg";
import close from "../assets/close.svg";
import "../styles/specificbill.css";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

const SpecificBill = () =>{
    return(
        <div className="billside">
            <Sidebar />
            <div className="billtop">
                <Topbar />
                <div className="billcontainer">
                <div className="billcontent">
            <>
            <div className="title">
            <h3> Bill </h3> <img src={front} alt=""></img> <p> Bill no : 423 </p>
            </div>
            <div className="head">
                    <h1>Bill no: 423, Lizan suppliers</h1>
                </div>
                <hr className="line" />
                <div className="content">
                    <div className="left">
                        <p> Bill Number:  </p>
                        <p> Bill Date: </p>
                        <p> Voucher Number:</p>
                        <p> Vendor:</p>
                        </div>
                        <div className="right">
                        <p> Total Amount: </p>
                        <p> Paid Amount: </p>
                        <p> Pending Amount: </p>
                        </div>
                    </div></>
                    <div className="btn">
                            <button className= "edit">Edit details</button>
                    </div>
        </div>
                </div>
                </div>
            </div>
    
    );
}
export default SpecificBill;