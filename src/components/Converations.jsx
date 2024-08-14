import React from "react";

const Converations = () => {
  return (
    <div className="flex gap-3 items-center h-16 bg-green-400 hover:bg-background cursor-pointer w-full px-4 py-6">
      <div className="w-12 h-12 bg-red-400 rounded-full "></div>
      <div className="flex flex-col">
        <h3 className="font-medium">Anir Jung Thapa</h3>
        <p className="font-light text-sm">I am okay with that.</p>
      </div>
      <p className="text-xs flex self-end ">delevered</p>
    </div>
  );
};

export default Converations;
