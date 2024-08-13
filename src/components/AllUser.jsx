import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";

const columns = [
  { id: "user_name", label: "User Name", maxWidth: 70, align: "left" },
  { id: "user_email", label: "Email Address", maxWidth: 70, align: "left" },
  { id: "role", label: "Role", maxWidth: 70, align: "left" },
  { id: "department", label: "Department", maxWidth: 70, align: "left" },
  { id: "status", label: "Status", maxWidth: 70, align: "left" },
  { id: "action", label: "Action", maxWidth: 70, align: "center" },
];

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

const DropdownMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const user_id = user.user_id;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSetActive = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8898/api/role/activateUser/${user_id}`
      );
      console.log(response.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetInActive = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8898/api/role/deactivateUser/${user_id}`
      );
      console.log(response.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const dropdownContent = (
    <div
      ref={dropdownRef}
      className="bg-white border-border border-2 rounded absolute z-50 flex flex-col w-[190px] text-black"
      style={{
        top: `${
          buttonRef.current?.getBoundingClientRect().bottom + window.scrollY
        }px`,
        left: `${
          buttonRef.current?.getBoundingClientRect().left + window.scrollX - 120
        }px`,
      }}
    >
      {user.isActive ? (
        <>
          <span
            className="hover:bg-background w-full p-3 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Set Super Admin
          </span>
          <span
            className="hover:bg-background w-full p-3 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Set Admin
          </span>
          <span
            className="hover:bg-background w-full p-3 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Set Department Head
          </span>
          <span
            className="hover:bg-background w-full p-3 cursor-pointer"
            onClick={() => {
              handleSetInActive(user_id);
              setIsOpen(false);
            }}
          >
            Set Inactive
          </span>
        </>
      ) : (
        <>
          <span
            className="hover:bg-background w-full p-3 cursor-pointer"
            onClick={() => {
              handleSetActive(user_id);
              setIsOpen(false);
            }}
          >
            Set Active
          </span>
          <span
            className="hover:bg-background w-full p-3 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Remove user
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className="relative z-20">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-center items-center w-full"
      >
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </button>
      {isOpen && ReactDOM.createPortal(dropdownContent, document.body)}
    </div>
  );
};

const AllUser = ({ users }) => {
  console.log(users);
  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        cursor: "pointer",
        fontSize: "18px",
      }}
    >
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 700 }}>
          <TableHead className="z-0">
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    ...headerStyle,
                    ...cellStyle,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={user.user_id}>
                <TableCell>{user.user_name}</TableCell>
                <TableCell>{user.user_email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.department_name}</TableCell>
                <TableCell>
                  {user.isActive === false ? (
                    <span className="text-red-500">Inactive</span>
                  ) : (
                    <span className="text-green-500">Active</span>
                  )}
                </TableCell>
                <TableCell className="flex ">
                  <DropdownMenu user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AllUser;
