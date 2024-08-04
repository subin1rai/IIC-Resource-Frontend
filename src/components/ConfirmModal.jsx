import React from "react";

const ConfirmModal = ({ show, onClose, onConfirm }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-overlay bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[30%] h-[27%] text-center">
        <h2 className="text-2xl font-semibold mb-4">Confirm to delete</h2>
        <p className="mt-7 text-xl">Are you sure you want to delete this category?</p>
        <div className="flex justify-around mt-9 w-[100%]">
          <button 
            className="bg-blue-600 w-[30%] text-white text-lg py-2 px-4 rounded"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button 
            className="bg-red-500 w-[30%] text-white py-2 text-lg px-4 rounded"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
