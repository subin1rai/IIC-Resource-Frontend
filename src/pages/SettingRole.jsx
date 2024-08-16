import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "axios";
import ActiveUser from "../components/ActiveUser";
import AllUser from "../components/AllUser";
import activeIcon from "../assets/active.png";
import filterIcon from "../assets/filter.svg";
import closeIcon from "../assets/close.svg";
import socket from "../socket";
import close from "../assets/close.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SettingRole = () => {
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addUserFormVisiblity, setAddUserFormVisiblity] = useState(false);
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [numberOfActiveUsers, setNumberOfActiveUsers] = useState(0);
  const [visibleForm, setVisibleForm] = useState("");
  const [newDepartment, setNewDepartment] = useState({
    department_name: "",
  });

  //for active users
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  //for all users
  const [userSearchTerm, setuserSearchTerm] = useState("");
  const [allFilteredUsers, setallFilteredUsers] = useState([]);

  const [user, setUser] = useState({
    user_name: "",
    user_email: "",
    department: "",
  });

  const displayAddPopup = (formName) => {
    setVisibleForm(formName);
  };

  const closeCategoryForm = () => {
    setError("");
    setVisibleForm("");
  };

  const Token = localStorage.getItem("token");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8898/api/role/allUsers",
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );

        if (response.data && response.data.users) {
          setUsers(response.data.users);
          setNumberOfUsers(response.data.users.length);
          setNumberOfActiveUsers(
            response.data.users.filter((user) => user.isActive === true).length
          );
        } else {
          setError("Unexpected response structure");
        }
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [Token]);

  //function for searching all users
  useEffect(() => {
    const filterAllUsers = () => {
      if (Array.isArray(users)) {
        const lowercasedTerm = userSearchTerm.toLowerCase();
        const newFilteredUsers = users.filter((user) =>
          user.user_name.toLowerCase().includes(lowercasedTerm)
        );
        setallFilteredUsers(newFilteredUsers);
      } else {
        setallFilteredUsers([]);
      }
    };
    filterAllUsers();
  }, [userSearchTerm, users]);

  const handleChange = async (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDepartmentChange = (e) => {
    setNewDepartment((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8898/api/role/addUser",
        user
      );
      toast.success(`${user.user_name} added successfully!`);
      setAddUserFormVisiblity(false);
      setUser({
        user_name: "",
        user_email: "",
        department: "",
      });

      console.log(response);
      setUsers((prev) => [...prev, response.data.newUser]);
      setNumberOfUsers((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("activated_user", (data) => {
      const newActiveUser = data["message"];
      const updatedUser = data["updated"];

      setActiveUsers((prevUsers) => {
        const existingUserIndex = prevUsers.findIndex(
          (user) => user.user_id === newActiveUser.user_id
        );
        if (existingUserIndex === -1) {
          return [...prevUsers, newActiveUser];
        } else {
          return prevUsers.map((user) =>
            user.user_id === newActiveUser.user_id ? newActiveUser : user
          );
        }
      });

      setNumberOfActiveUsers((prev) => prev + 1);
    });

    return () => {
      socket.off("activated_user");
    };
  }, []);

  const handleSubmitDepartment = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8898/api/addDepartment",
        newDepartment,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      toast.success(`${newDepartment.department_name} Added successfully!`);
      setVisibleForm(false);
      setDepartments((prev) => [...prev, response.data.department]);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("Feature name already exists!");
      } else {
        console.log(error);
        setError("Failed to add the new feature!");
      }
    }
  };

  const [departments, setDepartments] = useState();

  useEffect(() => {
    try {
      const getDepartment = async () => {
        const response = await axios.get(
          "http://localhost:8898/api/getDepartment"
        );
        setDepartments(response.data.department);
      };
      getDepartment();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="w-screen h-screen flex justify-between bg-background relative">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto items-center">
        <Topbar />
        <div className="bg-white w-[85.5vw] rounded-lg flex flex-col justify-between p-3 gap-3">
          <h3 className="flex text-lg font-bold m-3">User Summary</h3>
          <div className="flex justify-around">
            <div className="flex flex-col items-center justify-center gap-2">
              <img className="w-8 h-8" src={activeIcon} alt="" />
              <h4>{numberOfActiveUsers}</h4>
              <p className="font-medium">Number of Active Users</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <img className="w-8 h-8" src={activeIcon} alt="" />
              <h4>{numberOfUsers}</h4>
              <p className="font-medium">Number of Users</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white p-5  rounded w-[85.5vw] gap-5">
          {/* <h3 className="font-bold text-2xl">Roles</h3> */}
          {/* <p className="text-button">You can manage user roles here.</p> */}
          {/* <div className="w-full mx-auto bg-button h-1"></div> */}
          <div className="flex justify-between">
            <h3 className="text-xl font-bold">Users List</h3>
            <div className="flex gap-5">
              <input
                type="text"
                placeholder="Search all Users"
                value={userSearchTerm}
                onChange={(e) => setuserSearchTerm(e.target.value)}
                className="border-2 px-2 w-64 border-border rounded py-2"
              />
              <button
                className="bg-button text-white rounded w-fit px-6 py-2"
                onClick={() => setAddUserFormVisiblity(true)}
              >
                Add User
              </button>
              <button
                className="  bg-button text-white rounded items-center px-6 py-2  "
                onClick={() => displayAddPopup("department")}
              >
                Add Department
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center ">
            <AllUser users={allFilteredUsers} className="z-10" />
          </div>
        </div>
      </div>

      {addUserFormVisiblity && (
        <div className="w-screen h-screen bg-overlay absolute z-10 flex justify-center items-center ">
          <form
            onSubmit={handleSubmit}
            action=""
            className="bg-white p-5 rounded flex flex-col gap-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Add User</h3>

              <img
                src={closeIcon}
                alt=""
                className="w-4 h-4 cursor-pointer"
                onClick={() => {
                  setAddUserFormVisiblity(false);
                }}
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center gap-10 ">
                <label htmlFor="user_name" className="w-[120px]">
                  Full Name
                </label>
                <input
                  placeholder="Enter Full name"
                  id="user_name"
                  name="user_name"
                  onChange={handleChange}
                  type="text"
                  className="border-border border-2 rounded px-2 py-2 w-[250px]"
                />
              </div>
              <div className="flex justify-between items-center gap-2 ">
                <label htmlFor="user_name" className="w-[120px]">
                  Email
                </label>
                <input
                  placeholder="Enter Email"
                  id="user_email"
                  name="user_email"
                  onChange={handleChange}
                  type="text"
                  className="border-border border-2 rounded px-2 py-2 w-[250px]"
                />
              </div>
              <div className="flex justify-between items-center gap-2 ">
                <label htmlFor="department" className="w-[120px]">
                  Department
                </label>

                <select
                  id="department"
                  name="department"
                  onChange={handleChange}
                  className="border-border border-2 rounded px-2 py-2 w-[250px]"
                >
                  <option value="" disabled selected>
                    Select department
                  </option>
                  {departments.map((department) => {
                    return (
                      <option
                        key={department.department_id}
                        value={department.department_name}
                      >
                        {department.department_name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button className="bg-button text-white  py-2 w-fit px-4 rounded self-end mt-2">
                Add User{" "}
              </button>
            </div>
          </form>
        </div>
      )}

      {visibleForm === "department" && (
        <div className="flex absolute left-0 top-0 bg-overlay w-screen h-screen z-10 justify-center items-center">
          <form
            onSubmit={handleSubmitDepartment}
            className="flex absolute z-50 bg-white flex-col p-5 gap-6 rounded "
          >
            <div className="flex justify-between items-center">
              <p className=" ml-4 font-semibold">Department</p>
              <img
                className="rounded-md cursor-pointer p-4"
                src={close}
                alt=""
                onClick={closeCategoryForm}
              />
            </div>
            <div className="flex gap-10 justify-between items-center">
              <label className="w-48 p-4 font-medium" htmlFor="department_name">
                Department Name
              </label>
              <input
                className=" border-2 rounded border-neutral-200 w-[14vw] p-2"
                type="text"
                placeholder="e.g IT Academics, SSD, RTE"
                autoFocus="autofocus"
                name="department_name"
                id="department_name"
                onChange={handleDepartmentChange}
              />
            </div>
            {error && <span className="text-red-500 ml-4">{error}</span>}
            <div className="flex justify-between items-center">
              <button
                className="bg-blue-600 text-white py-2 px-3 rounded ml-auto "
                type="submit"
              >
                Add Department
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SettingRole;
