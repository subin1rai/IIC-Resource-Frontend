import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/forgorPassword.css";
import { IoChevronBackOutline } from "react-icons/io5";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [emailBoxVisiblity, setEmailFormVisiblity] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const navigate = useNavigate();

  const handleChange = (index, event) => {
    const { value } = event.target;
    if (/^\d?$/.test(value)) {
      const otpArray = otp.split("");
      otpArray[index] = value;
      setOtp(otpArray.join(""));

      if (value && index < inputRefs.length - 1) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8898/api/requestOTP`,
        { email },
        { withCredentials: true }
      );

      setEmailFormVisiblity(false);
      setShowOtp(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    if (emailBoxVisiblity && !showOtp) {
      navigate("/");
    } else if (!emailBoxVisiblity && showOtp) {
      setEmailFormVisiblity(true);
      setShowOtp(false);
      setOtp(""); // Reset OTP state
      // Clear OTP input fields
      inputRefs.forEach((ref) => ref.current && (ref.current.value = ""));
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8898/api/submitOTP`,
        { otp, email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/reset", { state: { email } });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center relative ">
      <button
        className="absolute left-16 top-16 bg-white border-2 border-button flex justify-center items-center px-6 py-2 text-xl font-medium text-button gap-2"
        onClick={handleBack}
      >
        <IoChevronBackOutline /> Back
      </button>

      {emailBoxVisiblity && (
        <form
          onSubmit={handleEmailSubmit}
          className="flex flex-col gap-6 items-center w-[25%]"
        >
          <h2 className="font-extrabold text-3xl">Forgot Password?</h2>
          <h3 className="text-l text-slate-600">
            Enter the email address you used to register
          </h3>
          <input
            type="email"
            placeholder="Enter your email..."
            autoFocus
            onChange={handleEmailChange}
            className="w-full border-border border-2 px-6 py-3 rounded-lg"
            required
          />
          <button
            className="border-none outline-none bg-button rounded text-white px-6 py-3"
            disabled={loading}
          >
            Request OTP
          </button>
        </form>
      )}

      {showOtp && (
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-xl">Enter the OTP sent to your email</h1>
          <form className="flex flex-col gap-4" onSubmit={handleOTPSubmit}>
            <div className="flex gap-6">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  className="w-14 h-14 border-2 border-border outline-none text-2xl text-center"
                  type="text"
                  value={otp[index] || ""}
                  onChange={(event) => handleChange(index, event)}
                  maxLength="1"
                />
              ))}
            </div>

            <p className="text-red-500">* Your OTP expires in 1 minute</p>

            <button
              className="bg-button text-white w-fit px-6 py-3 rounded flex self-center"
              type="submit"
            >
              Verify OTP
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
