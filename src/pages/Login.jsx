import React from "react";
import "../styles/login.css";
import Logo from '../assets/Logo.png'

const Login = () => {
  return (
    <div className="login">
      <div className="left-side">
        <img src={Logo} alt="Logo" className="logos" />
      </div>
      <div className="right-side">
        <div className="login-container">
          <img src={Logo} alt="Logo" className="logo" />
          <h2>Log in to your account</h2>
          <p>Welcome back! Please enter your details.</p>
          <form>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>
            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
