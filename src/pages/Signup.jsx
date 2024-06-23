import React from 'react';
import '../styles/signup.css';
import logo from '../assets/Logo.png';
import Logo1 from '.../assets/logo1.png';

const Signup = () => {
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
          src={Logo1}
          alt="Small Logo"
          className="small-logo"
        />
        <h2>Create an account</h2>
        <form>
          <label>
            Name
            <input type="text" placeholder="Enter your name" required />
          </label>
          <label>
            Email
            <input type="email" placeholder="Enter your email" required />
          </label>
          <label>
            Password
            <input type="password" placeholder="Create a password" required />
          </label>
          <p className="password-hint">Must be at least 8 characters.</p>
          <button type="submit">Get started</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
