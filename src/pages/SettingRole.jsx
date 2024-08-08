import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "axios";
import ActiveUser from "../components/ActiveUser";
import AllUser from "../components/AllUser";
import user from "../assets/active.png";

const SettingRole = () => {
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log(response.data);
        if (response.data && response.data.user) {
          setUsers(response.data.user);
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
        const response = await axios.get("http://localhost:8898/api/activeUsers", {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-screen h-screen flex justify-between bg-background">
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

        <div className="flex flex-col bg-white w-[85.5vw] px-7 py-5 rounded h-[88vh]">
          <h3 className="font-bold text-lg">Roles</h3>
          <div className="flex items-center justify-between ">
            <p className="text-blue-700">You can manage user roles here.</p>

          </div>
          <div className="w-full mx-auto mt-5 bg-blue-600 h-1"></div>

          <div className="flex flex-row gap-6">
            <div className="flex w-fit p-7 justify-between border-2 border-neutral-300 rounded-md mt-3 text-l text-black font-semibold">
              <div className="flex flex-col  mb-6 gap-5">
                <h1 className="text-lg font-bold m-2">Active Users</h1>
                <div className="relative  overflow-x-auto  flex justify-center items-center ">
                  <ActiveUser users={activeUsers} />
                </div>
              </div>
            </div>

            <div className="flex w-fit p-7 border-2 border-neutral-300 rounded-md mt-3">
              <div className="flex flex-col mb-5 gap-4">
                <div className="flex p-2 items-center justify-between">
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
                      <button className="bg-button text-white rounded border w-fit h-fit px-6 py-2">
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
    </div>
  );
};

export default SettingRole;
