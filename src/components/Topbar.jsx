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
  return (
    <div className="topbar">
      <div className="topbar-left">
        <p className="greetings">{greeting}, Admin</p>
      </div>
      <div className="topbar-right">
        <button
          className="text-3xl text-blue-600 p-5 relative "
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
        <div className="absolute border-[1px] border-neutral-300 rounded-md top-16 right-24 w-1/4 h-1/2 bg-purple-100 z-20 overflow-scroll">
  <div className=" flex px-4 py-3 text-xl gap-2 items-center justify-between bg-white">
    <h2>Notification</h2>
    <p className=" text-sm text-blue-600">12 Messages</p>
  </div>

  {/* message */}
  <div className="border-b border-neutral-300  px-6 py-3" >
    <h3 className="text-sml font-medium">New item requested by Mahima !</h3>
    <p className="text-[0.8rem] py-1 text-neutral-500">July 29, 2024 at 1:03PM</p>
  </div>
  <div className="border-b border-neutral-300  px-6 py-3" >
    <h3 className="text-sml font-medium">New item requested by Mahima !</h3>
    <p className="text-[0.8rem] py-1 text-neutral-500">July 29, 2024 at 1:03PM</p>
  </div>
  <div className="border-b border-neutral-300  px-6 py-3" >
    <h3 className="text-sml font-medium">New item requested by Mahima !</h3>
    <p className="text-[0.8rem] py-1 text-neutral-500">July 29, 2024 at 1:03PM</p>
  </div>
  <div className="border-b border-neutral-300  px-6 py-3" >
    <h3 className="text-sml font-medium">New item requested by Mahima !</h3>
    <p className="text-[0.8rem] py-1 text-neutral-500">July 29, 2024 at 1:03PM</p>
  </div>
  <div className="border-b border-neutral-300  px-6 py-3" >
    <h3 className="text-sml font-medium">New item requested by Mahima !</h3>
    <p className="text-[0.8rem] py-1 text-neutral-500">July 29, 2024 at 1:03PM</p>
  </div>
  <div className="border-b border-neutral-300  px-6 py-3" >
    <h3 className="text-sml font-medium">New item requested by Mahima !</h3>
    <p className="text-[0.8rem] py-1 text-neutral-500">July 29, 2024 at 1:03PM</p>
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
