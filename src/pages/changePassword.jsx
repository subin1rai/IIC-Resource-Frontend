import React from "react";
import { NavLink } from "react-router-dom";

const ChangePassword = () => {
  return (
    <div className="min-h-screen bg-neutral-100 py-8 px-4 flex flex-col">
      <div className="flex justify-start mb-8">
        <button className="bg-blue-600 text-white rounded py-2 px-4">
          <NavLink to="/dashboard" className="flex items-center">
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </NavLink>
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Change Password</h1>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="current-password" className="text-gray-600 font-semibold mb-2">Current Password</label>
              <input
                id="current-password"
                type="password"
                className="bg-gray-100 border border-neutral-500 rounded-lg px-4 py-3 focus:outline-blue-500 focus:border-blue-500"
                placeholder="Enter current password"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="new-password" className="text-gray-600 font-semibold mb-2">New Password</label>
              <input
                id="new-password"
                type="password"
                className="bg-gray-100 border border-neutral-500 rounded-lg px-4 py-3 focus:outline-blue-500 focus:border-blue-500"
                placeholder="Enter new password"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="confirm-password" className="text-gray-600 font-semibold mb-2">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                className="bg-gray-100 border border-neutral-500 rounded-lg px-4 py-3 focus:outline-blue-500 focus:border-blue-500"
                placeholder="Confirm new password"
              />
            </div>

            <button className="w-full mt-4 bg-blue-600 text-white rounded py-3 px-6 hover:bg-blue-700 transition-colors">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
