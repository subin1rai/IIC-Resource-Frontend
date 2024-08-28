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
import { format } from "date-fns";
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
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const [notificationPopUp, setNotificationPopUp] = useState(false);
  const [notification, setNotification] = useState([]);
  const [notReadCount, setNotReadCount] = useState(0);
  const [initials, setInitials] = useState("");
  const [bgColor, setBgColor] = useState(() => {
    // Try to get the color from localStorage, or generate a new one if not found
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

  const navigate = useNavigate();

  const openEditProfile = () => {
    navigate("/editProfile");
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
        const response = await axios.get(
          "http://localhost:8898/api/notificaiton",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotification(response.data.notification || []);
        const unreadCount = response.data.notification.filter(
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

  const fullName = localStorage.getItem("user_name");
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

      // Save the color to localStorage
      if (!localStorage.getItem("initialsBgColor")) {
        localStorage.setItem("initialsBgColor", bgColor);
      }
    }
  }, [bgColor]);

  const handleState = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8898/api/updateNotification`,
        {},
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
    const notificationToUpdate = notification.find(
      (notify) => notify.notification_id === notification_id && !notify.state
    );

    if (notificationToUpdate) {
      try {
        const response = await axios.put(
          `http://localhost:8898/api/singleNotification/${notification_id}`,
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
    const date = new Date(dateString);
    return format(date, "MMMM dd, yyyy 'at' h:mmaaa");
  };

  return (
    <div className="flex w-[86.5vw] h-24 bg-white justify-between px-7 items-center cursor-default">
      <div className="flex pl-5">
        <p className="font-semibold text-xl">{greeting}, Admin</p>
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
                <li className="py-2 text-blue-600">sample@iic.edu.np</li>
              </div>
              <div className="flex items-center gap-2">
                <img className="w-6 h-6" src={phone} alt="" />
                <li className="py-2 text-blue-600">9800000000</li>
              </div>
              <div className="flex justify-center">
                <button
                  className="w-[100%] bg-blue-600 rounded p-2 mt-2 text-white "
                  onClick={openEditProfile}
                >
                  Edit profile
                </button>
              </div>
            </div>
          </ul>
        </details>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Topbar;
