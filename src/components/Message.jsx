import React from "react";

const Message = ({ message }) => {
  console.log(message);
  return (
    <div className="bg-button p-3 w-fit rounded self-end">
      {message.message}
    </div>
  );
};

export default Message;
