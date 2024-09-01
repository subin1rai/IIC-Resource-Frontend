import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "axios";
import AllUser from "../components/AllUser";
import activeIcon from "../assets/active.png";
import closeIcon from "../assets/close.svg";
import socket from "../socket";
import { ToastContainer, toast } from "react-toastify";
import filterIcon from "../assets/filter.svg";
import Select from "react-select";
import close from "../assets/close.svg";

const SettingRole = () => {
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addUserFormVisibility, setAddUserFormVisibility] = useState(false);
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [numberOfActiveUsers, setNumberOfActiveUsers] = useState(0);
  const [visibleForm, setVisibleForm] = useState("");
  const [filterFormVisibility, setFilterFormVisibility] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ department_name: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [allFilteredUsers, setAllFilteredUsers] = useState([]);
  const [contactError, setContactError] = useState("");

  const [user, setUser] = useState({
    user_name: "",
    contact: "",
    user_email: "",
    department: "",
  });

  const initialUserState = {
    user_name: "",
    contact: "",
    user_email: "",
    department: "",
  };

  

  console.log(user);
  const [departments, setDepartments] = useState([]);

  const Token = localStorage.getItem("token");

  const displayFilterForm = () => {
    setFilterFormVisibility(true);
  };

  const closeFilterForm = () => {
    setFilterFormVisibility(false);
  };

  // Fetch users and departments data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, departmentResponse] = await Promise.all([
          axios.get("http://localhost:8898/api/role/allUsers", {
            headers: { Authorization: `Bearer ${Token}` },
          }),
          axios.get("http://localhost:8898/api/getDepartment"),
        ]);

        const users = userResponse.data.users || [];
        const activeUsers = userResponse.data.activeUsers || [];
        setUsers(users);
        setActiveUsers(activeUsers);
        setNumberOfUsers(users.length);
        setNumberOfActiveUsers(activeUsers.length);
        setDepartments(departmentResponse.data.department || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [Token]);

  // Filter all users by search term
  useEffect(() => {
    const filterAllUsers = () => {
      if (Array.isArray(users)) {
        const lowercasedTerm = userSearchTerm.toLowerCase();
        const newFilteredUsers = users.filter((user) =>
          user.user_name.toLowerCase().includes(lowercasedTerm)
        );
        setAllFilteredUsers(newFilteredUsers);
      } else {
        setAllFilteredUsers([]);
      }
    };
    filterAllUsers();
  }, [userSearchTerm, users]);

  // Socket listener for activated users
  useEffect(() => {
    socket.on("activated_user", (data) => {
      const newActiveUser = data.message;
      setActiveUsers((prevUsers) => [...prevUsers, newActiveUser]);
      setNumberOfActiveUsers((prev) => prev + 1);
    });

    return () => {
      socket.off("activated_user");
    };
  }, []);

  const validateContact = (contact) => {
    const contactNumber = parseInt(contact);
    if (isNaN(contactNumber) || contactNumber < 9700000000 || contactNumber > 9899999999) {
      setContactError("Contact number must be between 9700000000 and 9899999999.");
      return false;
    }
    setContactError("");
    return true;
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    if (name === "contact") {
      validateContact(value);
    }
  };


  const handleDepartmentChange = (e) => {
    setNewDepartment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddUser = async (event) => {
    event.preventDefault();
    
    if (!validateContact(user.contact)) {
      setError("Please correct the contact number.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8898/api/role/addUser",
        user,
        {
          headers: { Authorization: `Bearer ${Token}` },
        }
      );
      toast.success(`${user.user_name} added successfully!`);
      setAddUserFormVisibility(false);
      setError(null);
      setUsers((prev) => [...prev, response.data.newUser]);
      setNumberOfUsers((prev) => prev + 1);
      setUser(initialUserState);
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.error || "Failed to add user");
    }
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

  const handleAddDepartment = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8898/api/addDepartment",
        newDepartment,
        {
          headers: { Authorization: `Bearer ${Token}` },
        }
      );
      toast.success(`${newDepartment.department_name} added successfully!`);
      setVisibleForm("");
      setError(null); // Clear error when form is closed
      setDepartments((prev) => [...prev, response.data.department]);
    } catch (error) {
      if (error.response?.status === 409) {
        setError("Department name already exists!");
      } else {
        console.error(error);
        setError(
          error?.response?.data?.error || "Failed to add the new department!"
        );
      }
    }
  };

  return (
    <div className="w-screen h-screen flex justify-between bg-background relative">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto items-center">
        <Topbar />
        <div className="bg-white w-[85.5vw] rounded-lg flex flex-col justify-between p-3 gap-3">
          <h3 className="flex text-lg font-bold m-3">User Summary</h3>
          <div className="flex justify-around">
            <div className="flex flex-col items-center justify-center gap-2">
              <img className="w-8 h-8" src={activeIcon} alt="Active Users" />
              <h4>{numberOfActiveUsers}</h4>
              <p className="font-medium">Number of Active Users</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <img className="w-8 h-8" src={activeIcon} alt="Total Users" />
              <h4>{numberOfUsers}</h4>
              <p className="font-medium">Number of Users</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white p-5 rounded-xl w-[85.5vw] gap-5 ">
          <div className="flex justify-between">
            <h3 className="text-lg font-bold m-1">Users List</h3>
            <div className="flex gap-5">
              <input
                type="text"
                placeholder="Search all Users"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="border-2 px-2 w-64 border-border rounded py-2 focus:outline-slate-400"
              />
              {/* filter button */}
              <button
                className="flex justify-center items-center w-fit px-5 py-1.5 gap-3 bg-white border-neutral-300 border-2 cursor-pointer rounded"
                aria-label="Menu"
                onClick={displayFilterForm}
              >
                <img src={filterIcon} alt="filter icon" />
                Filter
              </button>
              {/* Add user button */}
              <button
                className="bg-button text-white rounded w-fit px-6 py-2"
                onClick={() => {
                  setAddUserFormVisibility(true);
                  setError(null); // Clear error when opening the form
                }}
              >
                Add User
              </button>
              {/* Add department button */}
              <button
                className="bg-button text-white rounded items-center px-6 py-2"
                onClick={() => {
                  setVisibleForm("department");
                  setError(null); // Clear error when opening the form
                }}
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

      {addUserFormVisibility && (
        <div className="w-screen h-screen bg-overlay absolute z-10 flex justify-center items-center">
          <form
            onSubmit={handleAddUser}
            className="bg-white rounded flex flex-col gap-9 px-10 py-7"
          >
            <div className="flex justify-between items-center ">
              <h3 className="text-xl font-semibold">Add User</h3>
              <img
                src={closeIcon}
                alt="Close"
                className="w-4 h-4 cursor-pointer"
                onClick={() => {
                  setAddUserFormVisibility(false);
                  setError(null); // Clear error when closing the form
                }}
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center gap-10">
                <label htmlFor="user_name" className="w-[120px] font-medium">
                  Full Name
                </label>
                <input
                  placeholder="Enter Full name"
                  id="user_name"
                  name="user_name"
                  value={user.user_name}
                  onChange={handleInputChange}
                  type="text"
                  className="border-border border-2 rounded px-2 py-2 w-[300px] focus:outline-slate-400"
                  autoFocus
                />
              </div>
              <div className="flex justify-between items-center gap-10">
                <label htmlFor="contact" className="w-[120px] font-medium">
                  Contact
                </label>
                <input
                  placeholder="Enter user contact"
                  id="contact"
                  name="contact"
                  value={user.contact}
                  onChange={handleInputChange}
                  type="text"
                  className="border-border border-2 rounded px-2 py-2 w-[300px] focus:outline-slate-400"
                />
              </div>
              <div className="flex justify-between items-center gap-10">
                <label htmlFor="user_email" className="w-[120px] font-medium">
                  Email
                </label>
                <input
                  placeholder="Enter Email"
                  id="user_email"
                  name="user_email"
                  value={user.user_email}
                  onChange={handleInputChange}
                  type="email"
                  className="border-border border-2 rounded px-2 py-2 w-[300px] focus:outline-slate-400"
                />
              </div>
              <div className="flex justify-between items-center gap-10">
                <label htmlFor="department" className="w-[120px] font-medium">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={user.department}
                  onChange={handleInputChange}
                  className="border-border border-2 rounded px-2 py-2 w-[300px] focus:outline-slate-400"
                >
                  <option value="" disabled>
                    Select Department
                  </option>
                  {departments.map((department) => (
                    <option
                      key={department.id}
                      value={department.department_name}
                    >
                      {department.department_name}
                    </option>
                  ))}
                </select>
              </div>
              {error && <div className="text-red-500 self-start">{error}</div>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-button text-white px-4 py-2 rounded w-[150px]"
                >
                  Add User
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* filter form */}
      {filterFormVisibility && (
        <div className="bg-overlay absolute left-0 top-0 z-30 w-screen h-screen flex justify-center items-center">
          <form className="rounded-md bg-white z-50 p-8  flex flex-col w-fit h-fit gap-8">
            <div className="flex justify-between">
              <h2 className="font-semibold text-xl"> Filtering Option</h2>
              <button type="button" className="" onClick={closeFilterForm}>
                <img src={close} alt="" className="cursor-pointer w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-8 ">
              <div className="flex gap-6   items-center">
                <label htmlFor="" className="font-medium">
                  Filter by Role:{" "}
                </label>
                <select
                  name=""
                  id=""
                  className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                  autoFocus
                >
                  <option value="">Select a role</option>
                  <option value="">Super Admin</option>
                  <option value="">Admin</option>
                  <option value="">User</option>
                  <option value="">Department Head</option>
                </select>
              </div>
              <div className="flex gap-7 items-center">
                <label htmlFor="department" className="font-medium">
                  Department:
                </label>
                <select
                  id="department"
                  name="department"
                  value={user.department}
                  onChange={handleInputChange}
                  className="border-border border-2 rounded p-2 w-[250px] focus:outline-slate-400"
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option
                      key={department.id}
                      value={department.department_name}
                    >
                      {department.department_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-20">
                <label htmlFor="" className="font-medium">
                  Status:
                </label>
                <div className="flex gap-8">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      class="mr-2"
                    />
                    Active
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      class="mr-2"
                    />
                    Inactive
                  </label>
                </div>
              </div>
            </div>
            <button className="flex bg-blue-600 text-white rounded p-3 items-center justify-center text-lg font-medium">
              Filter
            </button>
          </form>
        </div>
      )}

      {visibleForm === "department" && (
        <div className="w-screen h-screen bg-overlay absolute z-10 flex justify-center items-center">
          <form
            onSubmit={handleAddDepartment}
            className="bg-white  px-10 py-5 rounded flex flex-col gap-8"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Add Department</h3>
              <img
                src={closeIcon}
                alt="Close"
                className="w-4 h-4 cursor-pointer"
                onClick={() => {
                  setVisibleForm("");
                  setError(null); 
                }}
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center gap-10">
                <label
                  htmlFor="department_name"
                  className="w-[100px] font-medium"
                >
                  Name
                </label>
                <input
                  placeholder="Enter Department name"
                  id="department_name"
                  name="department_name"
                  value={newDepartment.department_name}
                  onChange={handleDepartmentChange}
                  type="text"
                  className="border-border border-2 rounded px-2 py-2 w-[300px] focus:outline-slate-400"
                  autoFocus
                />
              </div>
              {error && <div className="text-red-500  self-start">{error}</div>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-button text-white px-4 py-2 rounded"
                >
                  Add Department
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SettingRole;
