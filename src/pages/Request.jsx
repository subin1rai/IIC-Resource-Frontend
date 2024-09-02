import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ReqTable from "../components/ReqTable";
import socket from "../socket";
import filterIcon from "../assets/filter.svg";
// import RequestTable from "../components/RequestTable";
import axios from "axios";
import Chat from "../components/Chat";
import req from "../assets/request.svg";
import close from "../assets/close.svg"
import Select from "react-select";

const Request = () => {
  const [requests, setRequests] = useState({
    userId: "",
    for_userId: "",
    request_date: "",
    department: "",
    purpose: "",
    status: "",
    items: [],
  });

  const [filterFormVisibility, setFilterFormVisibility] = useState(false);
  const [departments, setDepartments] = useState([]);


  const displayFilterForm = () => {
    setFilterFormVisibility(true);
  }

  const closeFilterForm = () => {
    setFilterFormVisibility(false);
  };


  const [items, setItems] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);

  const token = localStorage.getItem("token");

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "250px",
      borderRadius: "4px",
      border: "2px solid #d1d5db",
      borderColor: "#d1d5db",
      boxShadow: "none",
      minHeight: "41px",
      color: "black",
      "&:hover": {
        borderColor: "#aaa",
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }),
    input: (provided) => ({
      ...provided,
      width: "45px",
      margin: "0px",
      color: "black",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#757575",
    }),
    container: (provided) => ({
      ...provided,
      width: "100%",
      color: "black",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
      color: "black",
    }),
  };


  useEffect(() => {
    const getRequest = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/request", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data.request);
      } catch (error) {
        console.log(error);
      }
    };

    getRequest();
  }, [token]);

  // console.log(requests);

  useEffect(() => {
    socket.on("newRequest", (data) => {
      toast.success(data.message);
      setRequests((prevRequests) => [...prevRequests, data.requestData]);
    });

    return () => {
      socket.off("newRequest");
    };
  }, []);


  // fetching department
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const departmentResponse = await axios.get(
          "http://localhost:8898/api/getDepartment",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log(departmentResponse);
        setDepartments(departmentResponse.data.department)
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };

    fetchDepartment();
  }, [token]);

  return (
    <div className="w-screen h-screen flex justify-between bg-background reltive">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto  items-center">
        <Topbar />
        <div className="flex flex-wrap w-[87vw] gap-5 justify-center">
          <div className="bg-white w-[85.5vw] rounded-lg flex flex-col justify-between p-3 gap-3">
            <h3 className="flex text-lg font-bold m-3">Request Summary</h3>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={req} alt="" />
                <h4>5</h4>
                <p className="font-medium">Number of Requests</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={req} alt="" />
                <h4>5</h4>
                <p className="font-medium">Number of Pending Requests</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white justify-center items-center w-[85.5vw] p-3 rounded-xl">
          <div className="flex w-[85vw] justify-between p-4">
            <p className="flex text-lg font-bold ">Requests</p>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search requests"
                // value={userSearchTerm}
                // onChange={(e) => setUserSearchTerm(e.target.value)}
                className="border-2 px-2 w-64 border-border rounded py-2 focus:outline-slate-400"
              />
              {/* Filter */}
              <button
                className="flex justify-center items-center w-fit h-fit px-5 py-2 gap-3 bg-white border-neutral-300 border-2 cursor-pointer rounded"
                aria-label="Menu"
                onClick={displayFilterForm}
              >
                <img
                  className="mt-1 justify-center align-center"
                  src={filterIcon}
                  alt=""
                />
                Filter
              </button>
            </div>
          </div>
          {/* <p>You can view your request here</p>
            <div className="w-[100%] mx-auto mt-5 bg-button h-1"></div> */}

          {/* <RequestTable /> */}
          <ReqTable requests={requests} />

        </div>
      </div>

      {/* filter form */}
      {filterFormVisibility && (
        <div className="bg-overlay absolute left-0 top-0 z-30 w-screen h-screen flex justify-center items-center">
          <form className="rounded-md bg-white z-50 p-8  flex flex-col w-fit h-fit gap-8">
            <div className="flex justify-between">
              <h2 className="font-semibold text-xl"> Filtering Option</h2>
              <button
                type="button"
                className=""
                onClick={closeFilterForm}
              >
                <img src={close} alt="" className="cursor-pointer w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {/*div for department and status  */}
              <div className="flex gap-8">
                {/* div for department */}
                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="font-medium">Filter by Departmnent: </label>
                  <Select
                    options={departments.map((department) => ({
                      value: department.department_name,
                      label: department.department_name,
                    }))}


                    placeholder="Select Department"
                    styles={customStyles}
                  />
                </div>

                {/* div for request status */}
                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="font-medium">Filter by Status: </label>
                  <select name="" id=""
                    className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"

                  >
                    <option value="" >Select status</option>
                    <option value="">Pending</option>
                    <option value="">Holding</option>
                    <option value="">Delivered</option>

                  </select>
                </div>

              </div>

              {/* filter by requested date */}
              <div className="flex flex-col gap-3">
                <label htmlFor="" className="font-medium" >By Date:</label>
                <div className="flex gap-8 ">
                  <input
                    className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                    type="date"
                    placeholder=" from"
                  />
                  <input
                    className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                    type="date"
                    placeholder="to"
                  />
                </div>
              </div>
            </div>
            <button
              className="flex bg-blue-600 text-white rounded p-3 items-center justify-center mt-3 text-lg font-medium"

            >
              Filter
            </button>
          </form>
        </div>
      )}

      
    </div>
  );
};

export default Request;
