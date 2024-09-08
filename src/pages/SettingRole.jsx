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
import add from "../assets/addCategory.svg";
import edit from "../assets/editIcon.png";
import Close from "../assets/Close.png";
import { useSelector } from "react-redux";

const SettingRole = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addUserFormVisibility, setAddUserFormVisibility] = useState(false);
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [numberOfActiveUsers, setNumberOfActiveUsers] = useState(0);
  const [isDepartmentListVisible, setIsDepartmentListVisible] = useState(false);
  const [isAddDepartmentVisible, setIsAddDepartmentVisible] = useState(false);
  const [filterFormVisibility, setFilterFormVisibility] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(false);

  const [newDepartment, setNewDepartment] = useState({ department_name: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [allFilteredUsers, setAllFilteredUsers] = useState([]);
  const [editFormVisibility, setEditFormVisibility] = useState(false);
  const [contactError, setContactError] = useState("");

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

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

  const [departments, setDepartments] = useState([]);
  const [editedDepartment, setEditedDepartment] = useState({
    department_id: null,
    department_name: "",
  });
  const [activeUser, setActiveUser] = useState([]);

  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo.token;

  const displayFilterForm = () => {
    setFilterFormVisibility(true);
  };

  const closeFilterForm = () => {
    setFilterFormVisibility(false);
  };
  const closeDepartmentForms = () => {
    setIsDepartmentListVisible(true);
    setIsAddDepartmentVisible(false);
    setError(null); // Clear error when closing the forms
  };
  const closeDepartment = () => {
    setIsDepartmentListVisible(true);
    setEditFormVisibility(false);
    setError(null); // Clear error when closing the forms
  };

  const displayAddPopup = (formName) => {
    setIsDepartmentListVisible(false);
    setIsAddDepartmentVisible(true);
  };

  // Fetch users and departments data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, departmentResponse] = await Promise.all([
          axios.get(`${apiBaseUrl}/api/role/allUsers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiBaseUrl}/api/getDepartment`),
        ]);

        const users = userResponse.data.users || [];
        setUsers(users);
        setNumberOfUsers(users.length);
        setDepartments(departmentResponse.data.department || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

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

  // filter handle
  const handleFilter = () => {
    let filtered = users;
    console.log(filtered);
    console.log(selectedDepartment.value);

    let filteredByDepartment = filtered;
    if (selectedDepartment) {
      filteredByDepartment = filtered.filter(
        (user) => user.department_name === selectedDepartment.value
      );
    }
    filtered = filteredByDepartment;

    let filteredByRole = filtered;
    if (selectedRole) {
      filteredByRole = filtered.filter((user) => user.role === selectedRole);
    }
    filtered = filteredByRole;

    let filteredByStatus = filtered;
    if (selectedStatus) {
      filteredByStatus = filtered.filter((user) => {
        const userStatus = user.isActive ? "active" : "inactive";
        return userStatus === selectedStatus;
      });
    }
    filtered = filteredByStatus;
    setAllFilteredUsers(filtered);
    setFilterFormVisibility(false); // Close filter form after applying filters
  };

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
    if (
      isNaN(contactNumber) ||
      contactNumber < 9700000000 ||
      contactNumber > 9899999999
    ) {
      setContactError(
        "Contact number must be between 9700000000 and 9899999999."
      );
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
    setEditedDepartment((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        `${apiBaseUrl}/api/role/addUser`,
        user,
        {
          headers: { Authorization: `Bearer ${token}` },
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
        `${apiBaseUrl}/api/addDepartment`,
        newDepartment,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`${newDepartment.department_name} added successfully!`);
      closeDepartmentForms();
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

  const handleEditDepartment = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/editDepartment/${editedDepartment.department_id}`,
        editedDepartment,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // Update the departments list with the edited department
        setDepartments((prevDepartments) =>
          prevDepartments.map((department) =>
            department.id === editedDepartment.department_id
              ? {
                ...department,
                department_name: editedDepartment.department_name,
              }
              : department
          )
        );
        setEditFormVisibility(false);
        setIsDepartmentListVisible(true);
        setError(null);
        toast.success("Department updated successfully");
      } else {
        setError("Failed to update the department");
      }
    } catch (error) {
      console.error("An error occurred while updating the department:", error);
      setError(
        error.response?.data?.message ||
        "An error occurred while updating the department"
      );
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
              <h4>{activeUser}</h4>
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
                  setIsDepartmentListVisible(true);
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

      {/* add form  */}
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
                  maxLength={10} // Limit input to 10 characters
                  pattern="[0-9]*"
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
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="border-2 rounded border-neutral-300 p-2 w-[250px] focus:outline-slate-400"
                  autoFocus
                >
                  <option value="">Select a role</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="departmenthead">Department Head</option>
                </select>
              </div>
              <div className="flex gap-7 items-center">
                <label htmlFor="department" className="font-medium">
                  Department:
                </label>
                <Select
                  options={departments.map((department) => ({
                    value: department.department_name,
                    label: department.department_name,
                  }))}
                  value={selectedDepartment}
                  onChange={(option) => setSelectedDepartment(option)}
                  placeholder="Select Department"
                  styles={customStyles}
                />
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
                      className="mr-2"
                      checked={selectedStatus === "active"}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    />
                    Active
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      className="mr-2"
                      checked={selectedStatus === "inactive"}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    />
                    Inactive
                  </label>
                </div>
              </div>
            </div>
            <button
              className="flex bg-blue-600 text-white rounded p-3 items-center justify-center text-lg font-medium"
              onClick={handleFilter}
            >
              Filter
            </button>
          </form>
        </div>
      )}

      {isDepartmentListVisible && (
        <div className="w-screen h-screen bg-overlay absolute z-10 flex justify-center items-center">
          <form
            onSubmit={handleAddDepartment}
            className="w-[86.5vw] flex  justify-center  p-3 h-[65vh]"
          >
            <div className="flex flex-col w-[32%] rounded-lg ">
              <div className="flex bg-blue-500 rounded-t-md justify-between px-10 py-3">
                <h1 className="text-lg font-medium text-white justify-evenly ">
                  Department
                </h1>
                <div className="flex space-x-4">
                  <img
                    src={add}
                    alt="add"
                    onClick={() => displayAddPopup("department")}
                    className="w-8 h-8 cursor-pointer"
                  />
                  <img
                    src={Close}
                    alt="Close"
                    className="w-5 h-5 mt-2 ml-1 cursor-pointer"
                    onClick={() => {
                      setEditFormVisibility(false); // Hide the edit form
                      setIsDepartmentListVisible(false); // Show the department list
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col bg-white items-center pb-4 rounded-b-md overflow-auto ">
                {departments.map((department) => (
                  <div className="w-full flex flex-col items-center">
                    <div className="w-[80%] py-4">
                      <div className="flex w-full justify-between items-center">
                        <p>{department.department_name}</p>

                        <img
                          src={edit}
                          alt="Edit"
                          className="h-5 w-5 cursor-pointer"
                          onClick={() => {
                            setEditFormVisibility(true); // Show the edit form
                            setIsDepartmentListVisible(false); // Hide the department list
                            setEditedDepartment(department); // Load the department data into the form
                          }}
                        />
                      </div>
                    </div>
                    <hr className="h-1 w-[80%] border-neutral-300" />
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      )}

      {isAddDepartmentVisible && (
        <div className="w-screen h-screen  bg-overlay absolute z-10 flex justify-center items-center">
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
                onClick={closeDepartmentForms}
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

      {editFormVisibility && (
        <div className="w-screen h-screen bg-overlay absolute z-10 flex justify-center items-center">
          <form
            onSubmit={handleEditDepartment}
            className="bg-white px-10 py-5 rounded flex flex-col gap-8"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Edit Department</h3>
              <img
                src={closeIcon}
                alt="Close"
                className="w-4 h-4 cursor-pointer"
                onClick={closeDepartment}
              // Close the form
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
                  value={editedDepartment.department_name}
                  onChange={handleDepartmentChange}
                  type="text"
                  className="border-border border-2 rounded px-2 py-2 w-[300px] focus:outline-slate-400"
                  autoFocus
                />
              </div>
              {error && <div className="text-red-500 self-start">{error}</div>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-button text-white px-4 py-2 rounded"
                >
                  Edit Department
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
