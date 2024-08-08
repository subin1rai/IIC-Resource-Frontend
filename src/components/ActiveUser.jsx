import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "user_name", label: "User Name", maxWidth: 70, align: "center" },
  { id: "user_email", label: "Email Address", maxWidth: 70, align: "center" },
  { id: "department", label: "Department", maxWidth: 70 },
  { id: "role", label: "Role", maxWidth: 70, align: "center" },
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

const ActiveUser = ({ users }) => {
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
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className="px-10 py-3"
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
            {users.map((user, index) => (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={user.id}
                className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
              >
                <TableCell className="px-10 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {index + 1}
                </TableCell>
                <TableCell className="px-10 py-4">{user.user_name}</TableCell>
                <TableCell className="px-10 py-4">{user.user_email}</TableCell>
                <TableCell className="px-10 py-4">{user.role}</TableCell>
                <TableCell className="px-10 py-4 ">
                  <button className="flex justify-center w-full">
                    <details>
                      <summary className="list-none">
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </summary>
                      <span>Set Inactive</span>
                    </details>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ActiveUser;
