import React, {useRef, useState} from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SettingsSide from "../components/SettingsSide";
import img from "../assets/img.png";

const Settings = () => {
  const [profileImg, setProfileImg] = useState(img);
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
    <div className="flex">
    <Sidebar />
    <div className ="settop">
        <Topbar />
        <div className = "p-5 ml-12 mt-20"> 
            <h1 className="font-bold text-xl"> Settings </h1>
            <div className="flex gap-12">
            <SettingsSide />
            <div className="flex p-10 flex-col w-[55vw]">
                <p className = "font-semibold text-3xl " >Profile</p>
                <hr className = " h-1  bg-blue-100"></hr>
                <div className="flex gap-10 justify-between">
                <div className="flex flex-col gap-3">
                <label className=" font-medium text-xl pt-3">Full Name</label>
                <input className="p-3 w-[18vw]  border-2 rounded-md " />
                <label className="font-medium text-xl">Email</label>
                <input className="p-3 w-[18vw]  border-2 rounded-md"/>
                <label className="font-medium text-xl"> Department</label>
                <input className="p-3 w-[18vw] border-2 rounded-md"/>
                <label className="font-medium text-xl">Phone Number</label>
                <input className="p-3 w-[18vw]  border-2 rounded-md"/>
                <button className="bg-blue-900 text-white w-[10vw] p-3 rounded-md">Save Changes</button>
                </div>
                <div className="image">
                <img className=" rounded-full mr-12 p-4" src={profileImg} alt ="" onClick = {uploadFile} />
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </div>
                
                </div>
                </div>
                </div>
                </div>
        </div>
        </div>
  );
};

export default Settings;
