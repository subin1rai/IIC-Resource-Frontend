import React, { useState } from "react";
import "../styles/login.css";
import Logo from "../assets/logo.png";
import Logo1 from "../assets/logo1.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState({
    user_email: "",
    password: "",
  });

  const navigate = useNavigate();

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
      const response = await axios.post(
        `http://localhost:8898/api/login`,
        user
      );
      console.log("Login successful:", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="login">
      <div className="left-side">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="right-side">
        <div className="login-container">
          <img src={Logo1} alt="Logo" />
          <h2>Log in to your account</h2>
          <p>Welcome back! Please enter your details.</p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="user_email"
                placeholder="Enter your email"
                value={user.user_email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={user.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="forgot-password">
              <Link to={"/forgotPassword"}>Forgot password?</Link>
            </div>
            <button type="submit">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
