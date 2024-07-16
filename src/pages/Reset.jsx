import {useState, React}  from "react";
import { Link } from "react-router-dom";
import "../styles/reset.css";
import { IoChevronBackOutline } from "react-icons/io5";

const Reset = () => {
    return(
        <div className="reset">
            <button className="back-btn">
        {" "}
        <Link to={"/"} className="redirect">
          <IoChevronBackOutline /> Back
        </Link>{" "}
      </button>
            <form className="resetform">
                <h2>Set New Password</h2>
                <label>New Password:</label>
                <input type="password" placeholder="Enter your new password" autoFocus="autofocus"/>
                <label>Confirm Password:</label>
                <input type="password" placeholder="Confirm your new password" /> 
                <button type = "submit" className="submit-btn">Submit</button>
        </form>
        </div>
    );
}
export default Reset;
