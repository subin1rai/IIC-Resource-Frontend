import {useState} from "react";
import { Link } from "react-router-dom";
import "../styles/forgorPassword.css";
import { IoChevronBackOutline } from "react-icons/io5";
import Otp from "./Otp";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const handleEmail = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    // phone validations
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(email)) {
      alert("Invalid Email");
      return;
    }

    // Call BE API
    // show OTP Field
    setShowOtp(true);
  };
  const onOtpSubmit = (otp) => {
    console.log("Reset Password", otp);
  };

  return (
    <div className="forgotPassword">
      <button className="back-btn">
        {" "}
        <Link to={"/"} className="redirect">
          <IoChevronBackOutline /> Back
        </Link>{" "}
      </button>
      <form onSubmit={handleEmailSubmit} className="forgotForm">
        <h2>Forgot Password?</h2>
        <h3> Enter the email address you used to register</h3>
        <input type="email" placeholder="Enter your email..." autoFocus="autofocus" onChange ={handleEmail} />
        <button className="submit-btn">Request OTP</button>
      </form>
      <div className="verify">
      <Otp length={4} onOtpSubmit={onOtpSubmit} />
      </div>
    </div>
  );
};

export default ForgotPassword;
