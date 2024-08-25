import React from "react";
import edit from "../assets/editIcon.png";

const Categorytable = ({
  category,
  setEditFormVIsiblity,
  setEditId,
  setEditedValue,
}) => {
  const handleformVisiblity = (category_id) => {
    setEditFormVIsiblity(true);
    setEditId(category_id);
    console.log(category_id);
    setEditedValue({ type: "category" });
  };

  return (
    <div className="flex flex-col bg-white items-center pb-4 rounded-b-md">
      {category.map((cat) => (
        <div className="w-full flex flex-col items-center">
          <div className="w-[80%] py-4">
            <div className="flex w-full justify-between items-center">
              <p className="text-lg">{cat.category_name}</p>

              <img
                src={edit}
                alt=""
                className="h-5 w-5 cursor-pointer"
                onClick={() => handleformVisiblity(cat.category_id)}
              />
            </div>
          </div>
          <hr className="h-1 w-[85%] border-button" />
        </div>
      ))}
    </div>
  );
};

export default Categorytable;
