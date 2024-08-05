import React, { useRef, useState } from "react";
import "../styles/userprofile.css";
import Navbar from "../components/Navbar";
import ProfileSide from "../components/Profileside";


const UserProfile = () => {
  const [profileImg, setProfileImg] = useState();
  const fileInputRef = useRef(null);

  const uploadFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profiletop">
      <Navbar />
      <div className="profileside">
        <ProfileSide />
        <div className="content">
          <form>
            <div className="maincontent">
              <div className="dual">
                <label> Full Name: </label>
                <input type="text" autoFocus="autofocus"></input>
              </div>
              <div className="dual">
                <label> Email Address: </label>
                <input type="email"></input>
              </div>
              <div className="dual">
                <label>Phone Number:</label>
                <input type="text"></input>
              </div>
              <button>Save Changes</button>
            </div>
            <div className="image">
              <img src={profileImg} alt="" onClick={uploadFile} />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UserProfile;
