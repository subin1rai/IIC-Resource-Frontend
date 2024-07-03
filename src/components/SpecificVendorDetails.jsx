import * as React from "react";
import { useEffect, useState } from "react";
import front from "../assets/arrow-right.svg";
import { CgLayoutGrid } from "react-icons/cg";
import axios from 'axios';

const SpecificVendorDetails = () => {
    // const [vendor, setVendor] = useState({
    //     vendor_name: "",
    //     vendor_contact: "",
    //     purchase_amt: "",
    //     last_purchase_date: "",
    //     recent_purchase_date: "",
    //     last_paid_date: "",
    //     payment_duration: "",
    //     tds: "",
    //     total_payment: "",
    //     pending_payment: "",
    //     next_payment_date: "",
    //     payment_status: ""
    // }); 
    
    useEffect(() => {
        const getAllVendor = async () =>{
         console.log("hOOOO")

        try {
            
            const response = await axios.get("http://localhost:8898/api/vendor")
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    getAllVendor()
},[]);

console.log("hi")

    return(
        <div className="main">
            {/* <h3>Vendors <img src={front} alt=""></img></h3>
            <p>{vendor.vendor_name}</p>
            <div className="head">
                <h1>{vendor.vendor_name}</h1>
                <p>Contact: {vendor.vendor_contact}</p>
            </div>
            <div className="content">
            <p>VAT Number: {vendor.vendor_name}</p>
            <p>Purchase Amount: {vendor.purchase_amt}</p>
            <p> Last Purchase Date:{vendor.last_purchase-date}</p>
            <p> Recent Purchase Date: {vendor.recent_purchase_date}</p>
            <p> Last Paid Date: {vendor.last_paid_date}</p>
            <p> Payment Duration: {vendor.payment_duration}</p>
            <p> TDS: {vendor.tds}</p>
            <p> Total Payment: {vendor.total_payment}</p>
            <p> Pending Payment: {vendor.pending_payment}</p>
            <p> Next Payment Date: {vendor.next_payment_date}</p>
            <p> Payment Status: {vendor.payment_status}</p>
            <div className="btn">
                <button>Edit Details</button>
                </div>         
            </div> */}
        </div>
    );
}
export default SpecificVendorDetails;