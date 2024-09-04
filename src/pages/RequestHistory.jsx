import React from "react";
import Navbar from "../components/Navbar";
import {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const RequestHistory = () => {
      const [approvedHistory, setApprovedHistory] = useState([]);
      const [pendingHistory, setPendingHistory] = useState ([]);

      
  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo.token;
   
  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/requestHistory", {
          headers: {
            Authorization: `Bearer ${token}`,
          } 
        });
        console.log(response)
        setApprovedHistory(response.data.requestApproved || []);
        setPendingHistory(reponse.data.requestPending || []);
      }
      catch (error){
        console.log("Error fetching history:", error);
        setApprovedHistory([]);
        setPendingHistory([]);
      }
      };
      getHistory();
    }, [token])   


  return (
    <div className="h-screen w-screen">
      <Navbar />
      <div className="flex flex-col items-center h-[87.5vh]">
        <div className="w-[78%] p-8 gap-4 ml-5">
          <h1 className="font-medium text-2xl">History</h1>
          <p>You can view your request here.</p>
          <hr className="mt-4 border-2 border-blue-600" />
        </div>

        <div className="flex flex-col w-[78%]">
          <div className="flex flex-wrap gap-8 ml-9">
          {history.map((item, index) => (
            <div key= {index} className="flex flex-col bg-gray w-[48%] p-5 rounded-lg gap-4">
              <h1 className="text-lg font-bold">{item.requestItems}</h1>

              <div className="flex justify-between">
                <div className="flex flex-col gap-4">
                  <p className="font-medium">Issued item:
                  <span className="font-normal  pl-4">
                    {item?.issued_item|| 0}
                  </span>
                  </p>
                  <p className="font-medium">Quantity:
                  <span className="font-normal  pl-4">
                    {history?.requested_for|| 0}
                  </span>
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="font-medium">Requested for:
                  <span className="font-normal  pl-4">
                    {history?.requested_for|| 0}
                  </span>
                  </p>
                  <p className="font-medium">Purpose:
                  <span className="font-normal  pl-4">
                    {history?.requested_for|| 0}
                  </span>
                  </p>
                </div>
                <div className="flex justify-center items-center">Approved</div>
              </div>
            </div>
          ))}

            <div className="flex flex-col bg-gray w-[48%] p-5 rounded-lg gap-4">
              <h1 className="text-lg font-bold">Charger</h1>

              <div className="flex justify-between">
                <div className="flex flex-col gap-4">
                  <p className="font-medium">Issued item:
                  <span className="font-normal  pl-4">
                    {history?.requested_for|| 0}
                  </span>
                  </p>
                  <p className="font-medium">Quantity:
                  <span className="font-normal  pl-4">
                    {history?.requested_for|| 0}
                  </span>
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="font-medium">Requested for:
                  <span className="font-normal  pl-4">
                    {history?.requested_for|| 0}
                  </span>
                  </p>
                  <p className="font-medium">Purpose:
                  <span className="font-normal  pl-4">
                    {history?.requested_for|| 0}
                  </span>
                  </p>
                </div>
                <div className="flex justify-center items-center">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestHistory;
