import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../components/Navbar";

const RequestHistory = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [approvedHistory, setApprovedHistory] = useState([]);
  const [pendingHistory, setPendingHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const token = useSelector((state) => state.user.userInfo.token);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/requestHistory`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Pending History:", response.data.requestPending);
        console.log("Approved History:", response.data.requestApproved);
        console.log("Approved Requests Length:", response.data.requestApproved.length);
        setApprovedHistory(response.data.requestApproved || []);
        setPendingHistory(response.data.requestPending || []);
      } catch (error) {
        console.error("Error fetching history:", error);
        setApprovedHistory([]);
        setPendingHistory([]);
      }
    };
    getHistory();
  }, [token]);
  
  const RequestTable = ({ items }) => (
    <table className="min-w-full table-fixed border-collapse">
      <thead>
        <tr className="bg-neutral-200">
          <th className="p-2 text-center border-b border-neutral-100 font-medium">
            S.No.
          </th>
          <th className="p-2 text-center border-b border-neutral-100 font-medium">
            Item Name
          </th>
          <th className="p-2 text-center border-b border-neutral-100 font-medium">
            Quantity
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={item.id}>
            <td className="p-2 text-center border-b border-neutral-200">
              {index + 1}
            </td>
            <td className="p-2 text-center border-b border-neutral-200">
              {item.item_name}
            </td>
            <td className="p-2 text-center border-b border-neutral-200">
              {item.quantity}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const RequestCard = ({ item }) => {
    console.log("Request Items for this card:", item.requestItems);
    
    return (
      <div className="flex flex-col bg-neutral-50 w-full md:w-[48%] p-5 rounded-lg gap-4 mb-4">
        <h1 className="text-lg font-bold">Request ID: {item.request_id}</h1>
        <div className="flex justify-between">
          <p className="font-medium">
            Requested for: <span className="font-normal">{item.requested_for || "N/A"}</span>
          </p>
          <p className="font-medium">
            Purpose: <span className="font-normal">{item.purpose || "N/A"}</span>
          </p>
          <div
            className={`flex justify-center items-center ${
              item.status === "Delivered" ? "text-green-500" : "text-yellow-500"
            }`}
          >
            {item.status}
          </div>
        </div>
        {item.requestItems.length > 0 ? (
          <RequestTable items={item.requestItems} />
        ) : (
          <p className="text-center text-gray-500">No items found.</p>
        )}
      </div>
    );
  };
  
  
  const TabButton = ({ label, isActive, onClick }) => (
    <button
      className={`px-4 py-2 font-medium rounded-t-lg ${
        isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center p-8">
        <div className=" w-[60vw] mb-8">
          <h1 className="font-medium text-2xl">Request History</h1>
          <p>View your pending and approved requests here.</p>
          <hr className="mt-4 border-2 border-neutral-400" />
        </div>
        <div className="w-[60vw]">
          <div className="flex mb-4">
            <TabButton
              label="Pending Requests"
              isActive={activeTab === "pending"}
              onClick={() => setActiveTab("pending")}
            />
            <TabButton
              label="Approved Requests"
              isActive={activeTab === "approved"}
              onClick={() => setActiveTab("approved")}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            {activeTab === "pending"
              ? pendingHistory.map((item, index) => (
                  <RequestCard key={index} item={item} />
                ))
              : approvedHistory.map((item, index) => (
                  <RequestCard key={index} item={item} />
                ))}
          </div>
          {((activeTab === "pending" && pendingHistory.length === 0) ||
            (activeTab === "approved" && approvedHistory.length === 0)) && (
            <p className="text-center text-gray-500 mt-4">No requests found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestHistory;
