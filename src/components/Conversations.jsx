import React, { useEffect, useState } from "react";

const Converations = (conversation) => {
  const [initials, setInitials] = useState("");

  useEffect(() => {
    console.log(conversation);
    const fullName = conversation.conversation.user_name;
    if (fullName) {
      const nameParts = fullName.trim().split(" ");

      let initials = "";
      if (nameParts.length === 1) {
        // If there's only one name (e.g., "John")
        initials = nameParts[0][0];
      } else if (nameParts.length >= 2) {
        // If there are multiple names (e.g., "John Doe" or "John Michael Doe")
        initials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
      }

      setInitials(initials.toUpperCase());
    }
  }, []);

  return (
    <div className="flex gap-3 items-center h-16 rounded bg-white justify-between hover:bg-blue-200 cursor-pointer w-full px-4 py-">
      <div className="flex gap-6">
        <div className="w-12 h-12 bg-red-400 flex justify-center text-white font-bold items-center rounded-full ">
          {initials}
        </div>
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
