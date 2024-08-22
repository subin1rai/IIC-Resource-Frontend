import React from "react";
import edit from "../assets/editIcon.svg";

const Featurestable = ({
  feature,
  setEditFormVIsiblity,
  setEditId,
  setEditedValue,
}) => {
  const handleformVisiblity = (category_id) => {
    setEditFormVIsiblity(true);
    setEditId(category_id);
    console.log(category_id);
    setEditedValue({ type: "Feature" });
  };
  return (
    <div className="flex flex-col bg-white items-center pb-4 rounded-b-md">
      {feature.map((feat) => (
        <div className="w-full flex flex-col items-center">
          <div className="w-[80%] py-4">
            <div className="flex w-full justify-between ">
              <p className="text-lg">{feat.feature_name}</p>
              <img
                src={edit}
                alt=""
                className="h-5 w-5"
                onClick={() => handleformVisiblity(feat.feature_id)}
              />

            </div>
          </div>
          <hr className="h-1 w-[85%] border-button" />
        </div>
      ))}
    </div>
  );
};

export default Featurestable;
