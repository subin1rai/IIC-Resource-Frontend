import React, { useEffect, useState, useRef } from "react";
import socket from "../socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import user from "../assets/user.svg";
import notificationIcon from "../assets/notification.svg";
import email from "../assets/email.png";
import phone from "../assets/phone.png";
import profile from "../assets/profile.png";
import empty from "../assets/Emptynoti.svg";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Topbar = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const [notificationPopUp, setNotificationPopUp] = useState(false);
  const [notification, setNotification] = useState([]);
  const [notReadCount, setNotReadCount] = useState(0);
  const [initials, setInitials] = useState("");
  const [bgColor, setBgColor] = useState(() => {
    return localStorage.getItem("initialsBgColor") || getRandomColor();
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotificationPopUp(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo.token;

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

  const navigate = useNavigate();

  const openChangePassword = () => {
    navigate("/changePassword");
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #adb5bd;
        border-radius: 9999px;
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
      setNotification((prevRequests) => [...prevRequests, newNotification]);
      setNotReadCount((prevCount) => prevCount + 1);
    });
    return () => {
      socket.off("newRequest");
    };
  }, []);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/notificaiton`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotification(response.data.notifications || []);
        const unreadCount = response.data.notifications.filter(
          (req) => !req.state
        ).length;
        setNotReadCount(unreadCount);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request Canceled", error.message);
          setNotification([]);
        }
      }
    };
    fetchNotification();
  }, [token]);

  const fullName = userInfo.user_name;

  useEffect(() => {
    if (fullName) {
      const nameParts = fullName.trim().split(" ");

      let initials = "";
      if (nameParts.length === 1) {
        initials = nameParts[0][0];
      } else if (nameParts.length >= 2) {
        initials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
      }

      setInitials(initials.toUpperCase());

      if (!localStorage.getItem("initialsBgColor")) {
        localStorage.setItem("initialsBgColor", bgColor);
      }
    }
  }, [bgColor]);

  const handleState = async () => {
    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/updateNotification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotification((prev) =>
        prev.map((notification) => ({
          ...notification,
          state: true,
        }))
      );
      setNotReadCount(0);

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSingleState = async (notification_id) => {
    const notificationToUpdate = notification.find(
      (notify) => notify.notification_id === notification_id && !notify.state
    );

    if (notificationToUpdate) {
      try {
        const response = await axios.put(
          `${apiBaseUrl}/api/singleNotification/${notification_id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setNotification((prevNotifications) =>
            prevNotifications.map((notify) =>
              notify.notification_id === notification_id
                ? { ...notify, state: true }
                : notify
            )
          );
          setNotReadCount((prevCount) => prevCount - 1);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const formatDate = (dateString) => {
    console.log(dateString);
    const date = new Date(dateString);
    return format(date, "MMMM dd, yyyy 'at' h:mmaaa");
  };

  return (
    <div className="flex w-[86.5vw] h-24 bg-white justify-between px-7 items-center cursor-default">
      <div className="flex pl-5">
        <p className="font-semibold text-xl">
          {greeting}, {userInfo.department}
        </p>
      </div>
      <div className="flex items-center h-full justify-between gap-3">
        <button className="p-5 relative" onClick={popUpNotification}>
          <img src={notificationIcon} alt="" className="w-7 h-7" />

          {notReadCount === 0 ? null : (
            <span className="absolute right-2 text-sm top-3 bg-red-500 rounded-[50%] h-5 w-5 text-white">
              {notReadCount}
            </span>
          )}
        </button>

        <details className="relative">
          <summary className="list-none cursor-pointer ">
            <div
              className="h-9 w-9 rounded-full flex justify-center items-center select-none font-semibold text-white"
              style={{ backgroundColor: bgColor }}
            >
              {initials}
            </div>
          </summary>
          <ul className="absolute right-[50%] bg-white w-[16vw] border-2 border-neutral-300 rounded p-4 top-9 ">
            <div className="flex gap-3 items-center ">
              <div
                className="h-12 w-12 rounded-full flex justify-center items-center select-none font-semibold text-white"
                style={{ backgroundColor: bgColor }}
              >
                {initials}
              </div>
              <div className="flex flex-col">
                <h1 className="font-medium text-xl text-nowrap ">{fullName}</h1>
              </div>
            </div>
            <hr className="border-[1px] border-neutral-300 m-2"></hr>
            <div className="flex flex-col px-4">
              <div className="flex items-center gap-2">
                <img className="w-6 h-6" src={email} alt="" />
                <li className="py-2 text-blue-600">{userInfo.user_email}</li>
              </div>
              <div className="flex items-center gap-2">
                <img className="w-6 h-6" src={phone} alt="" />
                <li className="py-2 text-blue-600">{userInfo.user_contact}</li>
              </div>
              <div className="flex justify-center">
                <button
                  className="w-[100%] bg-blue-600 rounded p-2 mt-2 text-white "
                  onClick={openChangePassword}
                >
                  Change Password
                </button>
              </div>
            </div>
          </ul>
        </details>
        {notificationPopUp && (
          <>
            <div
              ref={dropdownRef}
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
              {notification.length === 0 ? (
                <div className="flex items-center justify-center p-4">
                  <img
                    src={empty}
                    alt="No notifications"
                    className="w-56 h-56"
                  />
                  {/* <p className="text-center text-gray-500">
                    No notifications available
                  </p> */}
                </div>
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
                          {formatDate(notification?.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </>
        )}
        <div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
