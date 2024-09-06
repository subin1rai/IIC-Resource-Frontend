import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/reset.css";
import { IoChevronBackOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const Reset = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const location = useLocation();
  const { email } = location.state || {};

  // State to handle password and confirm password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/changePassword`,
        { email, newPassword },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccess("Password changed successfully.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError("An error occurred while changing the password.");
    }
  };

  return (
    <div className="reset">
      <button className="back-btn">
        <Link to={"/"} className="redirect">
          <IoChevronBackOutline /> Back
        </Link>
      </button>
      <form className="resetform" onSubmit={handleSubmit}>
        <h2>Set New Password</h2>
        <label>New Password:</label>
        <input
          type="password"
          placeholder="Enter your new password"
          autoFocus
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Reset;
