import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";
import logo from "../assets/logo.png";
import Logo1 from "../assets/logo1.png";

const Signup = () => {
  const [user, setUser] = useState({
    user_name: "",
    user_email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser((prev) => {
      const updatedUser = { ...prev, [e.target.name]: e.target.value };
      console.log(updatedUser);
      return updatedUser;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8898/api/signup`, user);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };

  return (
    // Register user form
    <div className="sign-up-page">
      <div className="left-side">
        <img src={logo} alt="Resource Department Logo" className="logo" />
      </div>
      <div className="right-side">
        <img src={Logo1} alt="Small Logo" className="small-logo" />
        <h2>Create an account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="user_name">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              required
              name="user_name"
              value={user.user_name}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="user_email">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              name="user_email"
              value={user.user_email}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              required
              name="password"
              value={user.password}
              onChange={handleChange}
            />
          </div>
          <p className="password-hint">Must be at least 8 characters.</p>
          <button type="submit">Get started</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
