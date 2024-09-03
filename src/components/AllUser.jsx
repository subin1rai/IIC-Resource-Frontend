import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import Swal from "sweetalert2";
import close from "../assets/close.svg";
import empty from "../assets/Emptyuser.svg"
import Box from "@mui/material/Box";

const columns = [
  { id: "user_name", label: "User Name", maxWidth: 70, align: "left" },
  { id: "user_email", label: "Email Address", maxWidth: 70, align: "left" },
  { id: "contact", label: "Contact Number", maxWidth: 70, align: "left" },
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

const DropdownMenu = ({
  user,
  updateUserStatus,
  setAllUsers,
  handlePopupForm,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to set this user as active?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, set active",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const response = await axios.put(
            `http://localhost:8898/api/role/activateUser/${user_id}`
          );
          if (response.status === 200) {
            Swal.fire("User Activated", "", "success");
            setAllUsers((prevUsers) =>
              prevUsers.map((u) =>
                u.user_id === user_id ? { ...u, isActive: true } : u
              )
            );
            setIsOpen(false);
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "An error occurred while activating the user.",
            "error"
          );
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleSetInActive = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, deactivate it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        axios
          .put(`http://localhost:8898/api/role/deactivateUser/${user_id}`)
          .then((response) => {
            if (response.status === 200) {
              Swal.fire({
                title: "Deactivated!",
                text: "The user has been deactivated.",
                icon: "success",
              });
              setAllUsers((prevUsers) =>
                prevUsers.map((u) =>
                  u.user_id === user_id ? { ...u, isActive: false } : u
                )
              );
              setIsOpen(false);
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: "An error occurred while deactivating the user.",
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleRoleUpdate = async (role) => {
    Swal.fire({
      // title: "Are you sure?",
      text: `Do you want to set the role to ${role}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, set ${role}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const response = await axios.put(
            `http://localhost:8898/api/role/updateRole/${user_id}`,
            { role }
          );
          if (response.status === 200) {
            Swal.fire(`Role Updated`, `User role set to ${role}`, "success");
            setAllUsers((prevUsers) =>
              prevUsers.map((u) => (u.user_id === user_id ? { ...u, role } : u))
            );
            setIsOpen(false);
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "An error occurred while updating the role.",
            "error"
          );
        } finally {
          setLoading(false);
        }
      }
    });
  };


  const dropdownContent = (
    <div
      ref={dropdownRef}
      className="bg-white border-border border-2 rounded absolute z-50 flex flex-col w-[190px] text-black text-sm"
      style={{
        top: `${buttonRef.current?.getBoundingClientRect().bottom + window.scrollY
          }px`,
        left: `${buttonRef.current?.getBoundingClientRect().left + window.scrollX - 120
          }px`,
      }}
    >
      {user.isActive ? (
        <>
          <span
            className={`hover:bg-background w-full p-3 cursor-pointer ${loading ? "pointer-events-none opacity-50" : ""
              }`}
            onClick={handleSetInActive}
          >
            Set Inactive
          </span>
          <span
            className={`hover:bg-background w-full p-3 cursor-pointer ${loading ? "pointer-events-none opacity-50" : ""
              }`}
            onClick={() => handleRoleUpdate("superadmin")}
          >
            Set Super Admin
          </span>
          <span
            className={`hover:bg-background w-full p-3 cursor-pointer ${loading ? "pointer-events-none opacity-50" : ""
              }`}
            onClick={() => handleRoleUpdate("admin")}
          >
            Set Admin
          </span>
          <span
            className={`hover:bg-background w-full p-3 cursor-pointer ${loading ? "pointer-events-none opacity-50" : ""
              }`}
            onClick={() => handleRoleUpdate("departmenthead")}
          >
            Set Department Head
          </span>
        </>
      ) : (
        <>
          <span
            className={`hover:bg-background w-full p-3 cursor-pointer ${loading ? "pointer-events-none opacity-50" : ""
              }`}
            onClick={handleSetActive}
          >
            Set Active
          </span>
          <span
            className={`hover:bg-background w-full p-3 cursor-pointer ${loading ? "pointer-events-none opacity-50" : ""
              }`}
            onClick={() => setIsOpen(false)}
          >
            Remove user
          </span>

        </>
      )}{" "}
      <span
        className={`hover:bg-background w-full p-3 cursor-pointer ${loading ? "pointer-events-none opacity-50" : ""
          }`}
        onClick={() => {
          setIsOpen(false);
          handlePopupForm();
        }}
      >
        Edit user
      </span>
    </div>
  );

  return (
    <div className="relative z-20">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-center items-center w-full"
        disabled={loading}
      >
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </button>
      {isOpen && ReactDOM.createPortal(dropdownContent, document.body)}
    </div>
  );
};

const AllUser = ({ users: initialUsers }) => {
  const [allUsers, setAllUsers] = useState(initialUsers);

  const [contactError, setContactError] = useState("");
  const [error, setError] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  const [editedUser, setEditedUser] = useState({
    user_id: null,
    user_name: "",
    user_email: "",
    contact: "",
    department: "",
  });
  const [editFormVisibility, setEditFormVisibility] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    setAllUsers(initialUsers);
  }, [initialUsers]);

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



  const roles = {
    user: "User",
    superadmin: "Super Admin",
    departmenthead: "Department Head",
    admin: "Admin",
  };


  const validateContact = (contact) => {
    const contactNumber = parseInt(contact);
    if (isNaN(contactNumber) || contactNumber < 9700000000 || contactNumber > 9899999999) {
      setContactError("Please enter a valid 10-digit contact number starting with 97, 98, or 99.");
      return false;
    }
    setContactError("");
    return true;
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const updateUserStatus = (userId, isActive) => {
    setAllUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.user_id === userId ? { ...user, isActive } : user
      )
    );
  };

  const handlePopupForm = (user) => {
    setEditedUser({
      user_id: user.user_id,
      user_name: user.user_name || "",
      user_email: user.user_email || "",
      contact: user.contact || "",
      department: user.department_name || "",
    });
    setEditFormVisibility(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });

    if (name === 'contact') {
      validateContact(value);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateContact(editedUser.contact)) {
      setError("Please correct the contact number.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8898/api/role/editUser/${editedUser.user_id}`,
        {
          user_name: editedUser.user_name,
          user_email: editedUser.user_email,
          contact: editedUser.contact,
          department: editedUser.department,
        }
      );

      if (response.status === 200) {
        // Update the specific user in the local state
        setAllUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.user_id === editedUser.user_id ? { ...u, ...editedUser } : u
          )
        );
        setEditFormVisibility(false);
        setError(null);
        setContactError("");

      } else {
        console.error("Failed to update the user:", response.data.message);
      }
    } catch (error) {
      console.error("An error occurred while updating the user:", error);
    }
  };



  const visibleRows = React.useMemo(
    () => allUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [allUsers, page, rowsPerPage]
  );

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
        <Table stickyHeader aria-label="sticky table">
          <TableHead className="z-0">
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.maxWidth,
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
            {(!visibleRows || visibleRows.length === 0) ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "370px",
                      width: "100%",
                    }}
                  >
                    <img
                      src={empty}
                      alt="No users"
                      className="h-72 w-72"
                      style={{ maxWidth: "300px", marginBottom: "20px" }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((user) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={user.user_id}>
                  <TableCell>{user.user_name}</TableCell>
                  <TableCell>{user.user_email}</TableCell>
                  <TableCell>{user.contact}</TableCell>
                  <TableCell>{roles[user.role]}</TableCell>
                  <TableCell>{user.department_name}</TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: "#d4edda", // Green for active
                          fontWeight: "normal",
                          textAlign: "center",
                          color: "#155724", // Dark green text for active
                        }}
                      >
                        Active
                      </span>
                    ) : (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: "#fff3cd", // Yellow for inactive
                          fontWeight: "normal",
                          textAlign: "center",
                          color: "#856404", // Dark yellow text for inactive
                        }}
                      >
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="flex">
                    <DropdownMenu
                      user={user}
                      updateUserStatus={updateUserStatus}
                      setAllUsers={setAllUsers}
                      handlePopupForm={() => handlePopupForm(user)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </TableContainer>

      {/* edit form */}
      {editFormVisibility && (
        <div className="w-screen h-screen bg-overlay absolute z-10 top-0 left-0 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-[30rem] px-8 py-5 rounded flex flex-col gap-8"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Edit User</h3>
              <img
                src={close}
                alt="Close"

                className="w-4 h-4 cursor-pointer"
                onClick={() => {
                  setEditFormVisibility(false);
                  setError(null);
                }}
              />
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-center ">
                <label htmlFor="user_name" className="w-[120px] font-medium">
                  Full Name
                </label>
                <input
                  placeholder="Enter Full name"
                  autoFocus="autofocus"
                  id="user_name"
                  name="user_name"
                  value={editedUser.user_name}
                  onChange={handleChange}
                  type="text"
                  className="border-border border-2 rounded px-2 py-2 w-[250px] focus:outline-slate-400"
                />
              </div>
              <div className="flex justify-between items-center ">
                <label htmlFor="contact" className="w-[120px] font-medium">
                  Contact
                </label>
                <input
                  placeholder="Enter contact number"
                  id="contact"
                  autoFocus="autofocus"
                  name="contact"
                  value={editedUser.contact}
                  onChange={handleChange}
                  type="text"
                  className="border-border border-2 rounded px-2 py-2 w-[250px] focus:outline-slate-400"

                />
              </div>

              <div className="flex justify-between items-center gap-2">
                <label htmlFor="user_email" className="w-[120px]">
                  Email
                </label>
                <input
                  placeholder="Enter Email"
                  autoFocus="autofocus"
                  id="user_email"
                  name="user_email"
                  value={editedUser.user_email}
                  onChange={handleChange}
                  type="text"
                  className="border-border border-2 rounded px-2 py-2 w-[250px] focus:outline-slate-400"
                />
              </div>
              <div className="flex justify-between items-center gap-2">
                <label htmlFor="department" className="w-[120px]">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  autoFocus="autofocus"
                  value={editedUser.department}
                  onChange={handleChange}
                  className="border-border border-2 rounded px-2 py-2 w-[250px] focus:outline-slate-400"
                >
                  <option value="" disabled>
                    Select department
                  </option>
                  {departments.map((department) => (
                    <option
                      key={department.department_id}
                      value={department.department_name}
                    >
                      {department.department_name}
                    </option>
                  ))}
                </select>
              </div>
              {error && <div className="text-red-500  self-start">{error}</div>}
              <button type="submit" className="bg-button text-white py-2 w-fit px-4 rounded self-end mt-2">
                Edit User
              </button>
            </div>

          </form>
          <div className="" onClick={() => {
            setEditFormVisibility(false);
            setError(null);
            setContactError("");
          }}></div>
        </div>
      )}
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={allUsers && Array.isArray(allUsers) ? allUsers.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) =>
          count === 0 ? 'No records' : `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
      />
    </Paper>
  );
};

export default AllUser;
