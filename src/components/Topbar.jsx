import React, { useEffect, useState } from "react";
// import "../styles/topbar.css";
import socket from "../socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import user from "../assets/user.svg";
import { format } from "date-fns";

const Topbar = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const [notificationPopUp, setNotificationPopUp] = useState(false);
  const [notification, setNotification] = useState([]);
  const [notREadCount, setNotReadCount] = useState(0);

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
    socket.on("newRequest", (data) => {
      const newNotification = data["message"];
      setNotification((prevRequests) => [newNotification, ...prevRequests]);
      setNotReadCount((prevCount) => prevCount + 1);
    });
    return () => {
      socket.off("newRequest");

    };
  }, []);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8898/api/notificaiton",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotification(response.data.notification || []);
        const a = response.data.notification.filter((req) => !req.state).length;
        setNotReadCount(a);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request Canceled", error.message);
          setNotification([]);
        }
      }
    };
    fetchNotification();
  }, []);

  const handleState = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8898/api/updateNotification`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  socket.on("all_request", (data) => {
    const newNotification = data["message"];
    setNotification(newNotification);
    setNotReadCount(0);
  });

  const handleSingleState = async (notification_id) => {
    try {
      const response = await axios.put(
        `http://localhost:8898/api/singleNotification/${notification_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotification((prevNotifications) =>
        prevNotifications.map((notify) =>
          notify.notification_id === notification_id
            ? { ...notify, state: false }
            : notify
        )
      );
     setNotReadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMMM dd, yyyy 'at' h:mmaaa");
  };

  return (
    <div className="flex w-[86.5vw] h-24 bg-white justify-between px-7 items-center  cursor-default">
      <div className="flex pl-5">
        <p className="font-semibold text-xl">{greeting}, Admin</p>
      </div>
      <div className="flex items-center h-full justify-between gap-3">
        <button
          className="text-2xl text-neutral-600 p-5 relative"
          onClick={popUpNotification}
        >
          <i className="fa-regular fa-bell"></i>

          {notREadCount == 0 ? (
            <></>
          ) : (
            <span className="absolute right-2 text-sm top-3 bg-red-500 rounded-[50%] h-5 w-5 text-white">
              {notREadCount}
            </span>
          )}
        </button>
        <img className="profile" src={user} alt="" />
      </div>
      {notificationPopUp && (
        <>
          <div
            className="absolute border-[1px] border-neutral-300 rounded-md top-16 right-24 w-1/4 h-1/2 bg-white z-20 overflow-y-scroll custom-scrollbar"
            style={{ overflowY: "scroll" }}
          >
            <div className="flex px-4 py-3 text-xl gap-2 items-center justify-between bg-white ">
              <h2>Notification</h2>
              <button
                className="text-sm text-blue-600 cursor-default "
                onClick={handleState}
              >
                Mark all as read
              </button>
            </div>
            <div className="w-full m-auto bg-background h-0.5"></div>
            {/* Example message list, you may replace with dynamic content */}

            {notification.length === 0 ? (
              <div className="px-6 py-3">No notifications found.</div>
            ) : (
              notification
                .slice()
                .reverse()
                .map((notification) => (
                  <div
                    key={notification.notification_id}
                    className={`border-b border-neutral-300 px-6 py-3  ${
                      notification.state
                        ? "bg-white"
                        : "bg-purple-100 cursor-default"
                    }`}
                  >
                    <div
                      onClick={() =>
                        handleSingleState(notification.notification_id)
                      }
                    >
                      <h3 className="text-sml font-medium">
                        {notification.message}
                      </h3>

                      <p className="text-[0.8rem] py-1 text-neutral-500">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>
          <div
            className="absolute z-10 w-[99%] h-[100%] mt-16 mr-16 transform -translate-x-60 translate-y-96 "
            onClick={() => setNotificationPopUp(false)}
          ></div>
        </>
      )}

      <div className="absolute">
        <ToastContainer pauseOnHover theme="dark" className="relative" />
      </div>
    </div>
  );
};

export default Topbar;
