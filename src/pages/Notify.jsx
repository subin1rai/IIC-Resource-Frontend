import React from"react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Notify = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex">
                <Topbar />
            </div>
        </div>
    );
}
export default Notify;
