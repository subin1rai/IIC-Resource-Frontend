import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "axios";
import ActiveUser from "../components/ActiveUser";
import AllUser from "../components/AllUser";
import user from "../assets/active.png";
import filterIcon from "../assets/filter.svg";
import closeIcon from "../assets/close.svg";

const SettingRole = () => {
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addUserFormVisiblity, setAddUserFormVisiblity] = useState(false);
  const [user, setUser] = useState({
    user_name: "",
    user_email: "",
    department: "",
  });

  const Token = localStorage.getItem("token");

  const cellStyle = {
    fontSize: "14px",
    padding: "12px 16px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const headerStyle = {
    fontWeight: 600,
    backgroundColor: "#f5f5f5",
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/allUsers", {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        console.log(response.data.users);
        if (response.data && response.data.users) {
          setUsers(response.data.users);
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

  useEffect(() => {
    const getActiveUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8898/api/activeUsers",
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        console.log(response.data);
        if (response.data && response.data.user) {
          setActiveUsers(response.data.user);
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
    getActiveUser();
  }, [Token]);

  const handleChange = async (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8898/api/addUser",
        user
      );
      setAddUserFormVisiblity(false);
      setUser({
        user_name: "",
        user_email: "",
        department: "",
      });
      setUsers((prev) => [...prev, response.data.addNewUser]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-between bg-background relative">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto items-center">
        <Topbar />
        <div className="flex flex-wrap w-[87vw] gap-5 justify-center">
          <div className="bg-white w-[85.5vw] rounded-lg flex flex-col justify-between p-3 gap-3">
            <h3 className="flex text-lg font-bold m-3">User Summary</h3>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={user} alt="" />
                <h4>{activeUsers.length}</h4>
                <p className="font-medium">Number of Active Users</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={user} alt="" />
                <h4>{users.length}</h4>
                <p className="font-medium">Number of Users</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white w-[85.5vw] px-7 py-5 rounded h-[67vh]">
          <h3 className="font-bold text-lg">Roles</h3>
          <div className="flex items-center justify-between ">
            <p className="text-blue-700">You can manage user roles here.</p>
          </div>
          <div className="w-full mx-auto mt-5 bg-blue-600 h-1"></div>

          <div className="flex flex-row gap-6">

            <div className="flex w-fit p-7 justify-between border-2 border-neutral-300 rounded-md mt-3">
              <div className="flex flex-col  mb-6 gap-5">
                <div className="flex justify-between items-center">
                  <h1 className="text-lg font-bold m-2">Active Users</h1>
                  {/* Search button */}
                  <div className="flex gap-4">
                    <div className="flex ">
                      <input
                        type="text"
                        placeholder="Search Users"
                        // onChange={}
                        className="border-2 px-2 w-46 border-border rounded h-fit py-2"
                      />
                    </div>
                    <div className="flex ">
                      <button
                        className="flex justify-center items-center w-fit h-fit px-5 py-2 gap-3 bg-white border-neutral-300 border-2 cursor-pointer rounded"
                        aria-label="Menu"
                      >
                        <img
                          className="mt-1 justify-center align-center"
                          src={filterIcon}
                          alt=""
                        />
                        Filter
                      </button>
                    </div>
                    {/* filter */}
                  </div>
                </div>

                <div className="relative  overflow-x-auto  flex justify-center items-center ">
                  <ActiveUser users={activeUsers} />
                </div>
              </div>
            </div>

            <div className="flex w-fit p-5 border-2 border-neutral-300 rounded-md mt-3">
              <div className="flex flex-col mb-6 gap-5">
                <div className="flex  items-center justify-between">
                  <h1 className="text-lg font-bold ">All Users</h1>
                  <div className="flex gap-4">
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Search Users"
                        // onChange={}
                        className="border-2 px-2 w-46 border-border rounded h-fit py-2"
                      />
                    </div>
                    <div className="flex ">
                      <button
                        className="bg-button text-white rounded border w-fit h-fit px-6 py-2"
                        onClick={() => setAddUserFormVisiblity(true)}
                      >
                        Add User
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-x-auto flex justify-center items-center">
                  <AllUser users={users} />
                </div>
              </div>
            </div>
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
                  <option value="SSD">SSD</option>
                  <option value="BBA academics">BBA academics</option>
                  <option value="BIT academics">BIT academics</option>
                  <option value="BD">BD</option>
                  <option value="Finance">Finance</option>
                  <option value="RTE">RTE</option>
                </select>
              </div>

              <button className="bg-button text-white  py-2 w-fit px-4 rounded self-end mt-2">
                Add User{" "}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SettingRole;
