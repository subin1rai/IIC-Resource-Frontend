import React from "react";

const RequestTable = () => {
    return(
        <div className=" flex w-[85] p-7 justify-between border-2 rounded-md mt-3 text-l text-black font-semibold">
            <div className =" flex flex-col gap-5 ">
           <p> Item:</p> 
            {/* <span className="font-medium">{item.item_name}</span> */}
            <p>  Department:</p> 
            {/* <span className="font-medium">{request.department}</span> */}
            </div>
            <div className="flex flex-col gap-5">
            <p>Quantity:</p>
            {/* <span className="font-medium">{item.item_quantity}</span> */}
            <p>Requested By: </p>
            {/* <span className="font-medium">{request.requested_by}</span> */}
            </div>
            <p className = "flex flex-col gap-5"> Requested Date:</p>
            {/* <span className="font-medium">{request.requested_date}</span> */}
            <div className= "flex gap-7 items-center"> 
            <button className="bg-blue-900  text-white h-fit py-3 px-8 rounded-md "> Accept </button>
            <button className="bg-white text-red-500 border-2  h-fit py-3 px-8 rounded-md border-red-400">Decline</button>
            </div>
        </div>
    );
}
export default RequestTable;