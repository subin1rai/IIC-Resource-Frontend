import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "axios";
import ActiveUser from "../components/ActiveUser";
import AllUser from "../components/AllUser";


const SettingRole = () => {
  const [users, setUsers] = useState([]);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-screen h-screen flex justify-between bg-background">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto items-center">
        <Topbar />

        <div className="flex flex-col bg-white w-[85.5vw] px-9 py-5 rounded gap-2 h-[88vh]">
          <h3 className="font-semibold text-2xl">Roles</h3>
          <div className="flex items-center justify-between ">
            <p>You can manage roles here</p>
            <button className="bg-blue-600 text-white py-2 px-3 rounded">
              Add Roles
            </button>
          </div>
          <div className="w-full mx-auto mt-5 bg-blue-600 h-1"></div>


          <div className="flex flex-row gap-6">
          <div className="flex w-fit p-7 justify-between border-2 border-neutral-300 rounded-md mt-3 text-l text-black font-semibold">
            <div className="flex flex-col justify-between mb-6 gap-5">
              <h1 className="text-lg font-bold m-2">Active Users</h1>
              <div className="relative  overflow-x-auto flex justify-center items-center">
                <ActiveUser users={users} />
              </div>
            </div>
          </div>
          
          <div className="flex w-fit p-7 justify-between border-2 border-neutral-300 rounded-md mt-3 text-l text-black font-semibold">
            <div className="flex flex-col justify-between mb-6 gap-5">
              <h1 className="text-lg font-bold m-2">All Users</h1>
              <div className="relative  overflow-x-auto flex justify-center items-center">
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
