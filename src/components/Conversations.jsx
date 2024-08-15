import React from "react";

const Converations = (conversation) => {
  console.log(conversation.conversation.user_name);
  return (
    <div className="flex gap-3 items-center h-16 rounded bg-white justify-between hover:bg-blue-200 cursor-pointer w-full px-4 py-">
      <div className="flex gap-6">
        <div className="w-12 h-12 bg-red-400 rounded-full "></div>
        <div className="flex flex-col">
          <h3 className="font-medium">{conversation.conversation.user_name}</h3>
          {/* <p className="font-light text-sm">I am okay with that.</p> */}
        </div>
      </div>
      {/* <p className="text-xs flex self-end ">delevered</p> */}
    </div>
  );
};

export default Converations;
