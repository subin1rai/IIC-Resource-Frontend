
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/payment.css";
import Topbar from "../components/Topbar";
import PaymentTable from "../components/PaymentTable";
import payment from "../assets/user.svg";
import filterIcon from "../assets/filter.svg";
import axios from "axios";

const Payment = () => {

  return (
    <div className="payment">
    <Sidebar />
    <div className="payment-main">
      <Topbar />
      <div className="flex w-[99.5%] justify-center  h-[16%]">
      <div className="bg-white w-[99.5%] flex flex-col rounded-xl  p-2 ">
      <h3 className="font-md text-xl ml-3">Summary</h3>
      <div className="flex justify-around ">
      <div className="flex flex-col items-center justify-center gap-3 ">
                <img src={payment} alt="" />
                <h4>{payment.length}</h4>
                <p>Total Pending Payment</p>
              </div>
        </div>
        </div>
          </div>
          <div className=" w-[99.5%] rounded-xl items-center bg-white p-3" >
          <div className=" flex justify-between w-[99.5%] rounded-xl items-center bg-white">
            <div className=" font-md text-xl ml-4">
              <p>Payments</p>
            </div>
            <div className=" flex gap-10">
              <button className=" flex bg-white-800 border-slate-200 border-2 rounded-md p-2 px-5 items-center gap-2 text-grey mr-4">
                {" "}
                <img src={filterIcon} alt="" />
                Filters
              </button>
            </div>
          </div>
          <PaymentTable />
          </div>
          </div>
          </div>

  );
};

export default Payment;

