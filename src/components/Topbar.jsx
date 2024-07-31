import React, { useEffect, useState } from "react";
import "../styles/topbar.css";
import socket from "../socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Topbar = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const [notificationPopUp, setNotificationPopUp] = useState(false);
  const [requests, setRequests] = useState([]);
const [notification, setNotification] = useState([]);

const token = localStorage.getItem("token");
  const morningStart = 5;
  const afternoonStart = 12;
  const eveningStart = 17;

  let greeting;
  if (currentHour >= morningStart && currentHour < afternoonStart) {
    greeting = "Good Morning";
  } else if (currentHour >= afternoonStart && currentHour < eveningStart) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const popUpNotification = () => {
    setNotificationPopUp(true);
  };


  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #adb5bd; /* Gray color */
        border-radius: 9999px; /* Rounded corners */
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Listen for the newRequest event
    socket.on("newRequest", (data) => {
    
    const newNotification = data['message']

   setNotification((prevRequests) => [ newNotification,...prevRequests ]);
      toast.success(data.message);
    });
    return () => {
      // Clean up the socket listener on component unmount
      socket.off("newRequest");
    };
  }, []);

  useEffect(()=>{
const fetchNotification =async ()=>{
    try {
      const response = await axios.get("http://localhost:8898/api/notificaiton",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setNotification(response.data.notification || []);
      console.log("hii"+ notification)
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request Canceled", error.message);
        setNotification([]);
      }
    }
} 
fetchNotification()
  },[])


  return (
    <div className="topbar">
      <div className="topbar-left">
        <p className="greetings">{greeting}, Admin</p>
      </div>
      <div className="topbar-right">
        <button
          className="text-2xl text-neutral-600 p-5 relative"
          onClick={popUpNotification}
        >
          <i className="fa-regular fa-bell"></i>
        </button>
        <img className="profile" src="../assets/adminuser.png" alt="" />
      </div>
      {notificationPopUp && (
        <>
          <div
            className="absolute border-[1px] border-neutral-300 rounded-md top-16 right-24 w-1/4 h-1/2 bg-purple-50 z-20 overflow-y-scroll custom-scrollbar"
            style={{ overflowY: "scroll" }}
          >
            <div className="flex px-4 py-3 text-xl gap-2 items-center justify-between bg-white">
              <h2>Notification</h2>
              <p className="text-sm text-blue-600">12 Messages</p>
            </div>

            {/* Example message list, you may replace with dynamic content */}
            {notification.length === 0 ? (
              <div className="px-6 py-3">No requests found.</div>
            ) : (
              notification.slice().reverse().map((notification) => (
                <div
                  key={notification.notification_id}
                  className="border-b border-neutral-300 px-6 py-3 bg-purple-100"
                >
                  <h3 className="text-sml font-medium">
                  {notification.message}
                  </h3>
                  <p className="text-[0.8rem] py-1 text-neutral-500">
                    July 29, 2024 at 1:03PM
                  </p>
                </div>
              ))
            )}
          </div>
          <div
            className="absolute z-10 w-screen h-screen transform -translate-x-60 translate-y-96"
            onClick={() => setNotificationPopUp(false)}
          ></div>
        </>
      )}

    </div>
  );
};

export default Topbar;
