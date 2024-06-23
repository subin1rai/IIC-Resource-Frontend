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
        <h2>Change Password</h2>
        <input type="text" placeholder="Enter your email..." />
        <button className="submit-btn">Send OTP</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
