import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import axios from "axios";

const SettingRole = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const Token = localStorage.getItem("token");

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
      <div className="flex flex-col gap-4 mx-auto  items-center">
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

              <div className="p-8">
                <div className="relative overflow-x-auto flex justify-center items-center">
                  <table className="w-[95%] text-sm text-center text-gray-500 dark:text-gray-400">
                    <thead className="text-xs border-b border-gray-200 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-10 py-3">
                          S.No.
                        </th>
                        <th scope="col" className="px-10 py-3">
                          User Name
                        </th>
                        <th scope="col" className="px-10 py-3">
                          Email Address
                        </th>
                        <th scope="col" className="px-10 py-3">
                          Role
                        </th>
                        <th scope="col" className="px-10 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr
                          key={user.id}
                          className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                        >
                          <th
                            scope="row"
                            className="px-10 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {index + 1}
                          </th>
                          <td className="px-10 py-4">{user.user_name}</td>
                          <td className="px-10 py-4">{user.user_email}</td>
                          <td className="px-10 py-4">{user.role}</td>
                          <td className="px-10 py-4">
                            <button>
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          
      </div>{" "}
      {/* End of flex-grow div */}
    </div>
    
  );
};

export default SettingRole;
