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

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8898/api/login`,
        user,
        { withCredentials: true }
      );

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };
  console.log(error);

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
            {error && <span class=" mb-2 text-red-500">{error}</span>}
            <button type="submit" class=" mt-3  ">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
