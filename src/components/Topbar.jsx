import React, { useEffect, useState } from "react";
import "../styles/topbar.css";

const Topbar = () => {
  let currentTime = new Date();

  let currentHour = currentTime.getHours();
  const [NotificationPopUp, SetNotificationPopUp] = useState(false);
  const morningStart = 5;
  const afternoonStart = 12;
  const eveningStart = 17;

  let greeting;
  if (currentHour >= morningStart && currentHour < afternoonStart) {
    greeting = "Good Morning";
  } else if (currentHour >= afternoonStart && currentHour < eveningStart) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  const popUpNotifcation = () => {
    SetNotificationPopUp(true);

  };
  // const closeNotification = () => {
  //   SetNotificationPopUp(false);
  // };
  return (
    <div className="topbar">
      <div className="topbar-left">
        <p className="greetings">{greeting}, Admin</p>
      </div>
      <div className="topbar-right">
        <button
          className="text-3xl text-neutral-700 p-5 relative"
          onClick={popUpNotifcation}
        >
          <i className="fa-regular fa-bell "></i>
        </button>

        <img
          className="profile"
            src=""
            alt=""
        />
      </div>

      {NotificationPopUp && <>
        <div className="absolute border-[1px] border-neutral-300 rounded-md top-16 right-24 w-1/4 h-1/2 bg-purple-50 z-20">
  <div className=" flex p-4 text-xl gap-2">
    <h2>Notification</h2>
    <p className=" text-sm p-1 bg-red-200 rounded-full">12</p>
  </div>
</div>

      
      </>}

       {NotificationPopUp &&(
          <div className=" absolute z-10 w-screen h-screen transform -translate-x-60 translate-y-96 mt-20" onClick={()=>SetNotificationPopUp(false)}>

            
          </div>
       )}
    </div>
  );
};

export default Topbar;
