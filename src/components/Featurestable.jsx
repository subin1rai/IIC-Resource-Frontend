import React from "react";
import edit from "../assets/editIcon.png";
import empty from "../assets/Emptycate.svg"


const Featurestable = ({
  feature,
  setEditFormVIsiblity,
  setEditId,
  setEditedValue,
  setName,
}) => {
  const handleformVisiblity = (feat) => {
    setEditFormVIsiblity(true);
    setEditId(feat.feature_id);
    setEditedValue({ type: "Feature", name: feat.feature_name });
  };
  return (
    <div className="flex flex-col bg-white items-center pb-4 rounded-b-md overflow-auto ">
      {feature.length > 0 ? (

        feature.map((feat) => (
          <div className="w-full flex flex-col items-center">
            <div className="w-[80%] py-4">
              <div className="flex w-full justify-between items-center">
                <p className="text-lg">{feat.feature_name}</p>
                <img
                  src={edit}
                  alt=""
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => handleformVisiblity(feat)}
                />
              </div>
            </div>
            <hr className="h-1 w-[85%] border-neutral-300" />
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <img src={empty} alt="No categories" className="h-32 w-32 mb-4" />
          <p className="text-gray-500">No features added yet !</p>
        </div>
      )
      }
    </div>
  );
};

export default Featurestable;
