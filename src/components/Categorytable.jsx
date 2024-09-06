import React from "react";
import edit from "../assets/editIcon.png";
import empty from "../assets/Emptycate.svg";

const Categorytable = ({
  category,
  setEditFormVIsiblity,
  setEditId,
  setEditedValue,
  setName,
}) => {
  const handleformVisiblity = (cat) => {
    setEditFormVIsiblity(true);
    setEditId(cat.category_id);
    setEditedValue({ type: "category", name: cat.category_name });
  };

  return (
    <div className="flex flex-col bg-white items-center pb-4 rounded-b-md overflow-auto ">
      {category.length > 0 ? (
        category.map((cat) => (
          <div className="w-full flex flex-col items-center">
            <div className="w-[80%] py-4">
              <div className="flex w-full justify-between items-center">
                <p className="text-lg">{cat.category_name}</p>

                <img
                  src={edit}
                  alt=""
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => handleformVisiblity(cat)}
                />
              </div>
            </div>
            <hr className="h-1 w-[85%] border-neutral-300" />
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <img src={empty} alt="No categories" className="h-32 w-32 mb-4" />
          <p className="text-gray-500">No categories added yet !</p>
        </div>
      )}
    </div>
  );
};

export default Categorytable;
