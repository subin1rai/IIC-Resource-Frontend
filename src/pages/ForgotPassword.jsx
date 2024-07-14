import { Link } from "react-router-dom";
import "../styles/forgorPassword.css";
import { IoChevronBackOutline } from "react-icons/io5";

const ForgotPassword = () => {
  return (
    <div className="forgotPassword">
      <button className="back-btn">
        {" "}
        <Link to={"/"} className="redirect">
          <IoChevronBackOutline /> Back
        </Link>{" "}
      </button>
      <form className="forgotForm">
        <h2>Forgot Password?</h2>
        <h3> Enter the email address you used to register</h3>
        <input type="email" placeholder="Enter your email..." autoFocus="autofocus" />
        <button className="submit-btn">Request OTP</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
