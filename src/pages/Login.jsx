import React, { useState } from "react";
import "../styles/login.css";
import Logo from "../assets/logo.png";
import Logo1 from "../assets/logo1.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../features/user/userSlice";

const Login = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [user, setUser] = useState({
    user_email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiBaseUrl}/api/login`, user, {
        withCredentials: true,
      });
      dispatch(setUserInfo(response.data.userData));

      localStorage.setItem("userInfo", JSON.stringify(response.data.userData));

      localStorage.setItem("isLoggedIn", "true");

      if (
        response.data.userData.user_role === "admin" ||
        response.data.userData.user_role === "superadmin"
      ) {
        navigate("/dashboard");
      } else if (response.data.userData.user_role === "departmenthead") {
        navigate("/userHome");
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred");
      }
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
            {error && <span className="mb-2 text-red-500">{error}</span>}
            <button type="submit" className="mt-3">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
