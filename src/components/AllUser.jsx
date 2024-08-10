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
  { id: "department", label: "Department", maxWidth: 70, align: "center" },
  { id: "status", label: "Status", maxWidth: 70, align: "center" },
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

const AllUser = ({ users }) => {
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
              <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
                <TableCell className="">{user.user_name}</TableCell>
                <TableCell className="">{user.user_email}</TableCell>
                <TableCell className="">{user.department}</TableCell>
                <TableCell className="">{user.status}</TableCell>
                <TableCell className="">
                  <details className="relative">
                    <summary className="list-none">
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </summary>
                    <ul className="absolute list-none bg-white rounded border-2 border-neutral-800 gap-2">
                        <li className="p-5 cursor-pointer hover:bg-slate-300 w-40 flex gap-2 items-center justify-center ">
                          <i class="fa-solid fa-signal"></i>
                          Set Active
                        </li>
                      
                      <li className="p-5 cursor-pointer hover:bg-slate-300 w-40 flex gap-2 items-center justify-center ">
                        <i class="fa-solid fa-trash"></i>
                        Remove
                      </li>
                    </ul>
                  </details>


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
