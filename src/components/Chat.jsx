import React, { useState } from 'react';      
import chat from "../assets/chat.svg";

const Chat = () =>{
  return (
    <div className="flex absolute h-[98vh] w-[85vw] justify-end items-end">
        <img className="h-20 w-20 z-50" src={chat} alt ="chat icon"/>
    </div>
  );
};

export default Chat;
