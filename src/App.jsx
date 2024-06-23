import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="left-side">
        <img src="images/logo.png" alt="Logo" className="logos" />
      </div>
      <div className="right-side">
        <div className="login-container">
            <img src="/images/logo1.png" alt="Logo" className="logo" />
          <h2>Log in to your account</h2>
          <p>Welcome back! Please enter your details.</p>
          <form>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" />
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
}

export default App;
