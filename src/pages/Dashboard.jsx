import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import returneditems from "../assets/returned.png";
import items from "../assets/item.png";
import lowstock from "../assets/lowstock.png";
import categoryno from "../assets/categoryno.png";
import vendors from "../assets/vendor.svg";
import vendorcount from "../assets/vendorcount.png";
import blacklist from "../assets/blacklist.png";
import issuesno from "../assets/issuesno.png";
import pendingreq from "../assets/pendingreq.png";
import pendingpay from "../assets/pending.png";
import records from "../assets/records.png";
import totpay from "../assets/totalpay.png";
import axios from "axios";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [dashboard, setDashboard] = useState("");
  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo.token;

  useEffect(() => {
    const getdashDetails = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboard(response.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    getdashDetails();
  }, [token]);

  return (
    // main div
    <div className="w-screen h-screen flex bg-background gap-1">
      <Sidebar />
      {/* top bar div */}
      <div className="flex flex-col gap-4">
        <Topbar />
        {/* main container */}
        <div className="flex flex-col w-[98.5%] mx-auto gap-4">
          {/* inventory summary container */}
          <div className="flex flex-col bg-white rounded-lg gap-7">
            <h1 className="text-lg font-bold m-5">Inventory Summary</h1>
            <div className="flex justify-around mb-5">
              {/* single summary */}
              <div className="flex flex-col items-center ">
                <img src={items} alt="items" className="w-8 h-8" />
                <p>{dashboard?.itemsCount}</p>
                <p className="font-medium">Number of items</p>
              </div>
              <div className="flex flex-col items-center ">
                <img src={categoryno} alt="items" className="w-8 h-8" />
                <p>{dashboard?.categoryCount}</p>
                <p className="font-medium">Number of categories</p>
              </div>
              <div className="flex flex-col items-center ">
                <img src={returneditems} alt="items" className="w-8 h-8" />
                <p>{dashboard?.itemsCount}</p>
                <p className="font-medium">Number of returned items</p>
              </div>
              <div className="flex flex-col items-center ">
                <img src={lowstock} alt="items" className="w-8 h-8" />
                <p>{dashboard?.lowStockCount}</p>
                <p className="font-medium">Number of low stock items</p>
              </div>
            </div>
          </div>

          {/* vendor and issue summary */}
          <div className="flex justify-around gap-5">
            {/* vendor summary */}
            <div className="flex flex-col bg-white w-[50%] gap-4 rounded">
              <h1 className="text-lg font-bold m-5">Vendor Overview</h1>
              <div className="flex justify-around mb-5">
                <div className="flex flex-col items-center ">
                  <img src={vendorcount} alt="items" className="w-8 h-8" />
                  <p>{dashboard?.vendorCount}</p>
                  <p className="font-medium">Number of vendors</p>
                </div>
                <div className="flex flex-col items-center ">
                  <img src={blacklist} alt="items" className="w-8 h-8" />
                  <p>{dashboard?.black_listed}</p>
                  <p className="font-medium">Number of blacklisted vendors</p>
                </div>
              </div>
            </div>

            {/* issue Summary */}
            <div className="flex flex-col bg-white w-[50%] gap-4 rounded">
              <h1 className="text-lg font-bold m-5">Issue Summary</h1>
              <div className="flex justify-around mb-5">
                <div className="flex flex-col items-center ">
                  <img src={issuesno} alt="items" className="w-8 h-8" />
                  <p>{dashboard?.issueCount}</p>
                  <p className="font-medium">Number of issues</p>
                </div>
                <div className="flex flex-col items-center ">
                  <img src={pendingreq} alt="items" className="w-8 h-8" />
                  <p>{dashboard?.itemsCount}</p>
                  <p className="font-medium">Number of pending requests</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-around gap-5">
            {/* Bill summary */}
            <div className="flex flex-col bg-white w-[50%] gap-4 rounded">
              <h1 className="text-lg font-bold m-5">Bill Overview</h1>
              <div className="flex justify-around mb-5">
                <div className="flex flex-col items-center ">
                  <img src={records} alt="items" className="w-8 h-8" />
                  <p>{dashboard?.billsCount}</p>
                  <p className="font-medium">Number of records</p>
                </div>
                <div className="flex flex-col items-center ">
                  <img src={pendingpay} alt="items" className="w-8 h-8" />
                  <p>{dashboard?.pendingPaymentCount}</p>
                  <p className="font-medium">Number of pending payments</p>
                </div>
              </div>
            </div>

            {/* Request Summary */}
            <div className="flex flex-col bg-white w-[50%] gap-4 rounded">
              <h1 className="text-lg font-bold m-5">Request Summary</h1>
              <div className="flex justify-around mb-5">
                <div className="flex flex-col items-center ">
                  <img src={totpay} alt="items" className="w-8 h-8" />
                  <p>{dashboard?.requestCount}</p>
                  <p className="font-medium">Number of Requests</p>
                </div>
                <div className="flex flex-col items-center ">
                  <img src={pendingpay} alt="items" className="w-8 h-8" />
                  <p>{dashboard?.pendingRequestCount}</p>
                  <p className="font-medium">Number of pending requests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
