import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Help = () => {
    return(
        <div className="flex">
            <Sidebar />
            <div className="flex">
                <Topbar />
            </div>
        </div>
    );
}
export default Help;