import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import close from "../assets/close.svg";
import Topbar from "../components/Topbar";
import PaymentTable from "../components/PaymentTable";
import payment from "../assets/user.svg";
import Select from "react-select";
import filterIcon from "../assets/filter.svg";
import axios from "axios";
import pending from "../assets/pending.png";

const Payment = () => {
  const [payment, setPayment] = "";

  const [filterFormVisibility, setFilterFormVisibility] = useState(false);
  const displayFilterForm = () => {
    setFilterFormVisibility(true);
  };

  const closeFilterForm = () => {
    setFilterFormVisibility(false);
  };

  return (
    <div className="w-screen h-screen flex justify-between bg-background">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto  items-center">
        <Topbar />
        <div className="flex w-[99.5%] justify-center  h-[16%]">
          <div className="bg-white w-[99.5%] flex flex-col rounded-xl  p-2 ">
            <h3 className="font-md text-xl ml-3">Summary</h3>
            <div className="flex justify-around ">
              <div className="flex flex-col items-center justify-center gap-1 ">
                <img className="w-8 h-8" src={pending} alt="" />
                <h4>{payment}</h4>
                <p>Total Pending Payment</p>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-[99.5%] rounded-xl items-center bg-white p-3">
          <div className=" flex justify-between w-[99.5%] rounded-xl items-center bg-white">
            <div className=" font-md text-xl ml-4">
              <p>Payments</p>
            </div>
            <div className=" flex gap-10">
              <button
                className=" flex bg-white-800 border-slate-200 border-2 rounded-md p-2 px-5 items-center gap-2 text-grey mr-4"
                onClick={displayFilterForm}
              >
                {" "}
                <img src={filterIcon} alt="" />
                Filters
              </button>
            </div>
          </div>
          <PaymentTable />
        </div>
      </div>
      {filterFormVisibility && (
        <form className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white z-50 p-8 flex flex-col w-fit h-fit gap-4">
          <div className="flex justify-between">
            <h2 className="font-semibold text-xl"> Select Filtering Option</h2>
            <button
              type="button"
              className="discard-btn"
              onClick={closeFilterForm}
            >
              <img src={close} alt="" />
            </button>
          </div>
          <label>Select Category</label>
          <div className="flex gap-6">
            <Select
            // options={categoryOptions}
            // onChange={(selectedOption) =>
            //   handleSelectChange(selectedOption, { name: "feature" })
            // }
            // value={categoryOptions.find(
            //   (option) => option.value === itemData.category
            // )}
            // placeholder="Choose Category"
            // styles={customStyles}
            // className="react-select-container"
            // classNamePrefix="react-select"
            />
            <Select
            // options={itemCategoryOptions}
            // onChange={(selectedOption) =>
            //   handleSelectChange(selectedOption, { name: "itemCategory" })
            // }
            // value={itemCategoryOptions.find(
            //   (option) => option.value === itemData.itemCategory
            // )}
            // placeholder="Choose Item Category"
            // styles={customStyles}
            // className="react-select-container"
            // classNamePrefix="react-select"
            />
            <Select
            // options={productCategoryOptions}
            // onChange={(selectedOption) =>
            //   handleSelectChange(selectedOption, { name: "productCategory" })
            // }
            // value={productCategoryOptions.find(
            //   (option) => option.value === itemData.productCategory
            // )}
            // placeholder="Choose Product Category"
            // styles={customStyles}
            // className="react-select-container"
            // classNamePrefix="react-select"
            />
          </div>
          <label>Select Date:</label>
          <div className="flex gap-6">
            <input
              className="border-2  border-neutral-200 p-1.5 rounded-md w-[14.4vw]"
              type="date"
              placeholder=" from"
            />
            <input
              className="border-2 border-neutral-200 p-1.5 rounded-md w-[14.4vw]"
              type="date"
              placeholder="to"
            />
          </div>
        </form>
      )}
      {filterFormVisibility && (
        <div
          className="absolute bg-overlay z-20 w-screen h-screen"
          onCick={closeFilterForm}
        >
          {" "}
        </div>
      )}
    </div>
  );
};

export default Payment;
