import React, { useEffect, useState } from "react";
import "../styles/topbar.css";

const Topbar = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const [notificationPopUp, setNotificationPopUp] = useState(false);

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

  return (
    <div className="topbar">
      <div className="topbar-left">
        <p className="greetings">{greeting}, Admin</p>
      </div>
      <div className="topbar-right">
        <button
          className="text-3xl text-blue-600 p-5 relative"
          onClick={popUpNotification}
        >
          <i className="fa-regular fa-bell"></i>
        </button>
        <img className="profile" src="" alt="" />
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
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="border-b border-neutral-300 px-6 py-3 bg-purple-100"
              >
                <h3 className="text-sml font-medium">
                  New item requested by Mahima!
                </h3>
                <p className="text-[0.8rem] py-1 text-neutral-500">
                  July 29, 2024 at 1:03PM
                </p>
              </div>
            ))}
          </div>
          <div
            className="absolute z-10 w-screen h-screen transform -translate-x-60 translate-y-96 mt-20"
            onClick={() => setNotificationPopUp(false)}
          ></div>
        </>
      )}
    </div>
  );
};

export default Topbar;
