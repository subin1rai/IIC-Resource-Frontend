import axios from "axios";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Icon } from "react-icons-kit";
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


const ChangePassword = () => {
  const [password, setPassword] = useState({
    current_password: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState({
    current_password: false,
    password: false,
    confirm_password: false,
  });

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const goBack = () =>{
    navigate("/dashboard")
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:8898/api/changePassword",
        password,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Password changed successfully!");
      goBack();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  

  const handleChange = (e) => {
    setPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="min-h-screen bg-neutral-100 py-8 px-4 flex flex-col">
      <div className="flex justify-start mb-8">
        <button className="bg-blue-600 text-white rounded py-2 px-4">
          <NavLink to="/dashboard" className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </NavLink>
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Change Password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col relative">
                <label
                  htmlFor="current-password"
                  className="text-gray-600 font-semibold mb-2"
                >
                  Current Password
                </label>
                <input
                  id="current-password"
                  type={showPassword.current_password ? "text" : "password"}
                  name="current_password"
                  className="border-2 rounded border-neutral-200 p-3 focus:outline-slate-400 "
                  placeholder="Enter current password"
                  onChange={handleChange}
                  value={password.current_password}
                  autoFocus
                />
                <span
                  className="absolute right-4 top-11  cursor-pointer"
                  onClick={() => togglePasswordVisibility("current_password")}
                >
                  <Icon
                    icon={
                      showPassword.current_password
                        ? eye
                        : eyeOff
                    }
                    size={20}
                    style={{ color: "#9CA3AF" }}
                  />
                </span>
              </div>

              <div className="flex flex-col relative">
                <label
                  htmlFor="new-password"
                  className="text-gray-600 font-semibold mb-2"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type={showPassword.password ? "text" : "password"}
                  name="password"
                  className="border-2 rounded border-neutral-200 p-3 focus:outline-slate-400"
                  placeholder="Enter new password"
                  onChange={handleChange}
                  value={password.password}
                />
                <span
                  className="absolute right-4 top-11 cursor-pointer"
                  onClick={() => togglePasswordVisibility("password")}
                >
                  <Icon
                    icon={
                      showPassword.password ? eye : eyeOff
                    }
                    size={20}
                    style={{ color: "#9CA3AF" }}
                  />
                </span>
              </div>

              <div className="flex flex-col relative">
                <label
                  htmlFor="confirm-password"
                  className="text-gray-600 font-semibold mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type={showPassword.confirm_password ? "text" : "password"}
                  name="confirm_password"
                  className="border-2 rounded border-neutral-200 p-3 focus:outline-slate-400"
                  placeholder="Confirm new password"
                  onChange={handleChange}
                  value={password.confirm_password}
                />
                <span
                  className="absolute right-4 top-11 cursor-pointer"
                  onClick={() => togglePasswordVisibility("confirm_password")}
                >
                  <Icon
                    icon={
                      showPassword.confirm_password
                        ? eye
                        : eyeOff
                    }
                    size={20}
                    style={{ color: "#9CA3AF" }}
                  />
                </span>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-blue-600 text-white rounded py-3 px-6 hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer pauseOnHover theme="light" />
    </div>
  );
};

export default ChangePassword;
