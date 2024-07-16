import {useState, React}  from "react";
import "../styles/reset.css";

const Reset = () => {
    return(
        <div className="reset">
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
