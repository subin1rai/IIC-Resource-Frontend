import * as React from "react";
import SpecificVendorDetails from "../components/SpecificVendorDetails";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/specificVendor.css";

const SpecificVendor = () => {
    return(
        <div className="side">
            <Sidebar />
            <div className="top">
            <Topbar />
            <div className="container">
                <div className="entry">
                    <SpecificVendorDetails />
                </div>
            </div>
            </div>
        </div>
    );
};
export default SpecificVendor;