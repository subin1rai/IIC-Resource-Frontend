import React, { useState } from "react";
import chat from "../assets/chatIcon.svg";
import Converations from "./Converations";
import closeIcon from "../assets/close.svg";

const Chat = () => {
  const [chatBoxVisiblity, setChatBoxVisiblity] = useState(false);
  const handleChatBoxVisiblity = () => {
    if (chatBoxVisiblity) {
      setChatBoxVisiblity(false);
    } else {
      setChatBoxVisiblity(true);
    }
  };
  return (
    <div className="relative">
      <img
        src={chat}
        alt=""
        className="w-16  h-16 cursor-pointer"
        onClick={handleChatBoxVisiblity}
      />

      {chatBoxVisiblity && (
        <div className="absolute bg-yellow-400 h-[440px] w-[320px] -bottom-0.5 -right-0.5 rounded overflow-hidden ">
          <div className="h-12 w-full bg-blue-600 px-3 flex  justify-between items-center sticky ">
            <h3>Conversations</h3>

            <img src={closeIcon} alt="" className="cursor-pointer" />
          </div>
          <div className="flex w-full h-[400px] flex-col overflow-auto p-2">
            <Converations />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
