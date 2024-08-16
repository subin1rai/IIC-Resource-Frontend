import React from "react";

const Message = ({ message, conversation }) => {
  const user_id = conversation.user_id;

  return (
    <div
      className={` p-3 px-5  w-fit rounded-3xl  self-end ${
        message.receiverId === user_id
          ? "bg-button rounded-br-none text-white "
          : "bg-white  rounded-bl-none"
      }`}
    >
      {message.message}
    </div>
  );
};

export default Message;
