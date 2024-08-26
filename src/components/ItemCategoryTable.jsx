import React from "react";
import edit from "../assets/editIcon.png";

const ItemCategoryTable = ({
  itemCategory,
  setEditFormVIsiblity,
  setEditId,
  setEditedValue,
  setName,
}) => {
  const handleformVisiblity = (iCat) => {
    setEditFormVIsiblity(true);
    setEditId(iCat.category_id);
    console.log(iCat.category_id);
    setName(iCat.item_category_name);
    SettingsSystemDaydreamRounded();
    setEditedValue({ type: "ItemCategory" });
  };
  return (
    <div className="flex flex-col bg-white items-center pb-4 rounded-b-md">
      {itemCategory.map((iCat) => (
        <div className="w-full flex flex-col items-center">
          <div className="w-[80%] py-4">
            <div className="flex w-full justify-between items-center ">
              <p className="text-lg">{iCat.item_category_name}</p>
              <img
                src={edit}
                alt=""
                className="h-5 w-5 cursor-pointer"
                onClick={() => handleformVisiblity(iCat)}
              />
            </div>
          </div>
          <hr className="h-1 w-[85%] border-button" />
        </div>
      ))}
    </div>
  );
};

export default ItemCategoryTable;
