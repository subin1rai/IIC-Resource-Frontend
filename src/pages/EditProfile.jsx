import React, { useRef, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import profile from "../assets/profile.png";
import camera from "../assets/camera.png";
import changePassword from "./changePassword";
import { useSelector } from "react-redux";

const EditProfile = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [image, setImage] = useState(profile);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex bg-background h-screen w-screen">
      {/* Sidebar component */}
      <Sidebar />
      <div className="flex flex-col mx-auto gap-4">
        {/* Topbar component */}
        <Topbar />

        <div className="bg-white w-[99%] mx-auto h-[100%] flex flex-col p-8 rounded-md ">
          <h1 className="text-xl font-semibold"> My Profile</h1>
          <h3 className="font-light text-light mb-8">
            Make changes on your profile details.
          </h3>
          <div className="flex ">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <label className="text-lg font-normal">Full Name:</label>
                <input className="border-2 rounded border-neutral-200 w-[20vw] p-1 py-2" />
              </div>

              {/* Input field for nickname */}

              <div className="flex flex-col gap-4">
                <label className="text-lg font-normal">Email Address:</label>
                <div className="flex flex-col gap">
                  <input className="border-2 rounded border-neutral-200 w-[20vw] p-1 py-2" />
                  <p className="font-light text-sm">
                    This is your primary email address and will be used to send
                    notification emails.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-lg font-normal">Phone Number:</label>
                <input className="border-2 rounded border-neutral-200 w-[20vw] p-1 py-2" />
              </div>
              <button className="flex bg-blue-600 text-white rounded items-center w-fit p-2 px-6">
                Save Changes
              </button>
              <button className="flex bg-blue-600 text-white rounded items-center w-fit py-3 px-6">
                <NavLink to="/changePassword"> Change Password</NavLink>
              </button>
            </div>
            <div className="flex relative">
              <img className="w-28 h-28 z-20 " src={image} alt="Profile" />
              <img
                className="ml-20 w-6 h-6 absolute z-50"
                src={camera}
                alt="Camera"
                onClick={handleImageClick}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
