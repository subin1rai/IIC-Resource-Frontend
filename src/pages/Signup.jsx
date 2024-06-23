import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import '../styles/signup.css';
import logo from '../assets/Logo.png';
import Logo1 from '../assets/logo1.png';
import logo1 from "../assets/logo1.png";

const Signup = () => {
  const [user, setUser] = useState({
    user_name: "",
    user_email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      const updatedUser = { ...prev, [e.target.name]: e.target.value };
      console.log(updatedUser); // Log the updated state
      return updatedUser;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8898/api/signup`, user);
      navigate("/");
    } catch (error) {
      console.error("Error Signing up:", error);
    }
  };

  return (
    <div className="sign-up-page">
      <div className="left-side">
        <img
          src={logo}
          alt="Resource Department Logo"
          className="logo"
        />
      </div>
      <div className="right-side">
        <img
          src={Logo11}
          alt="Small Logo"
          className="small-logo"
        />
        <h2>Create an account</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              placeholder="Enter your name"
              required
              name="user_name"
              value={user.user_name}
              onChange={handleChange}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              placeholder="Enter your email"
              required
              name="user_email"
              value={user.user_email}
              onChange={handleChange}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="Create a password"
              required
              name="password"
              value={user.password}
              onChange={handleChange}
            />
          </label>
          <p className="password-hint">Must be at least 8 characters.</p>
          <button type="submit">Get started</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
