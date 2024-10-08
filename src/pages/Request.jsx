import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ReqTable from "../components/ReqTable";
import socket from "../socket";
import filterIcon from "../assets/filter.svg";
import axios from "axios";
import Chat from "../components/Chat";
import req from "../assets/request.svg";
import close from "../assets/close.svg";
import Select from "react-select";
import { useSelector } from "react-redux";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

const Request = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filterFormVisibility, setFilterFormVisibility] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pending, setPending] = useState("");



  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo.token;

  const handleFilterDateChange = (name) => (date) => {
    setFilteredOptions((prev) => ({ ...prev, [name]: date }));

  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      alignSelf: "end",
      border: state.isFocused ? "2px solid #94a3b8" : "2px solid #e5e5e5",
      borderRadius: "4px",
      boxShadow: "none",
      minHeight: "46px",
      "&:hover": {
        border: state.isFocused ? "2px solid #94a3b8" : "2px solid #e5e5e5",
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }),
    input: (provided) => ({
      ...provided,
      width: "200px",
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
        const response = await axios.get(`${apiBaseUrl}/api/request`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data.request);
        const count = response.data.request.filter(
          (req) => req.status === "Pending"
        ).length;
        setPending(count);
        setFilteredRequests(response.data.request); // Initially, all requests are displayed
      } catch (error) {
        console.log(error);
      }
    };

    getRequest();
  }, [token]);

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
          `${apiBaseUrl}/api/getDepartment`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDepartments(departmentResponse.data.department);
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };

    fetchDepartment();
  }, [token]);

  const displayFilterForm = () => {
    setFilterFormVisibility(true);
  };

  const closeFilterForm = () => {
    setFilterFormVisibility(false);
  };

  const [filterOptions, setFilteredOptions] = useState({
    department_name: "",
    dateFrom: "",
    dateTo: "",
    requestStatus: "",
  })

  const applyFilter = (e) => {
    e.preventDefault();
    let filteredResults = [...requests];

    if (filterOptions.department_name) {
      filteredResults = filteredResults.filter(
        (request) => request.department_name === filterOptions.department_name
      )
    }

    if (filterOptions.requestStatus) {
      filtered = filtered.filter(
        (request) => request.status === filterOptions.requestStatus
      );
    }

    if (filterOptions.dateFrom && filterOptions.dateTo) {
      filteredResults = filteredResults.filter((requests) => {
        const requestDate = new Date(requests.request_date);
        return (
          requestDate >= new Date(filterOptions.dateFrom) &&
          requestDate <= new Date(filterOptions.dateTo)
        );
      });
    }


    setFilteredRequests(filteredResults);
    setFilterFormVisibility(false); // Close filter form after applying filters
  };


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
                <h4>{requests.length}</h4>
                <p className="font-medium">Number of Requests</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={req} alt="" />
                <h4>{pending}</h4>
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
                className="border-2 px-2 w-64 border-border rounded py-2 focus:outline-slate-400"
              />
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
          <ReqTable requests={filteredRequests} />
        </div>
      </div>


      {/* filter form */}
      {filterFormVisibility && (
        <div className="bg-overlay absolute left-0 top-0 z-30 w-screen h-screen flex justify-center items-center">
          <form className="rounded-md bg-white z-50 p-8  flex flex-col w-fit h-fit gap-8"
            onSubmit={applyFilter}>
            <div className="flex justify-between">
              <h2 className="font-semibold text-xl">Filtering Option</h2>
              <button type="button" className="" onClick={closeFilterForm}>
                <img src={close} alt="" className="cursor-pointer w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="font-medium">
                    Filter by Department:{" "}
                  </label>
                  <Select
                    options={departments.map((department) => ({
                      value: department.department_name,
                      label: department.department_name,
                    }))}
                    onChange={(selectedOption) => setFilteredOptions((prev) => ({
                      ...prev,
                      department_name: selectedOption.value,
                    }))}
                    placeholder="Select Department"
                    styles={customStyles}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="font-medium">
                    Filter by Status:{" "}
                  </label>
                  <select
                    value={filterOptions.requestStatus}
                    onChange={(e) =>
                      setFilteredOptions((prev) => ({
                        ...prev,
                        requestStatus: e.target.value,
                      }))
                    }
                    className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                  >
                    <option value="">Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="Holding">Holding</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-10">
                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="font-medium">
                    Requested From:
                  </label>

                  <NepaliDatePicker
                    inputClassName="form-control focus:outline-none"
                    className="border-2 border-neutral-300 p-2 w-[250px] pl-3 rounded-md focus:outline-slate-400"
                    value={filterOptions.dateFrom}
                    onChange={handleFilterDateChange("dateFrom")}
                    options={{ calenderLocale: "en", valueLocale: "en" }}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="" className="font-medium">
                    Requested To:
                  </label>
                  <NepaliDatePicker
                    inputClassName="form-control focus:outline-none"
                    className="border-2 border-neutral-300 p-2 w-[250px] pl-3 rounded-md focus:outline-slate-400"
                    value={filterOptions.dateTo}
                    onChange={handleFilterDateChange("dateTo")}
                    options={{ calenderLocale: "en", valueLocale: "en" }}
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
