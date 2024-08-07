import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import axios from "axios";
import deleteIcon from "../assets/deleteIcon.svg";
import Swal from "sweetalert2";


const columns = [
  { id: "sn", label: "SN", maxWidth: 70 },
  { id: "category_name", label: "Category Name", maxWidth: 70 },
  { id: "items", label: "Items", maxWidth: 70 },
  { id: "action", label: "Action", maxWidth: 70 },
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

export default function Itable({ itemCategory, setItemCategory }) {
  
  const token = localStorage.getItem("token");

  const handleDeleteSubmit = async (categoryId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8898/api/deleteItemCategory/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setItemCategory((prevCategory) =>
        prevCategory.filter((cat) => cat.item_category_id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting item category:", error.message);
    }
  };

  const handleShowModal = (categoryId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteSubmit(categoryId);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }
    });
  };

  // Assume each row has a height of 64px
  const rowHeight = 48;
  const maxVisibleRows = 5;
  const maxHeight = rowHeight * maxVisibleRows;

  return (
  
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        <TableContainer sx={{ maxHeight: maxHeight }}>
          <Table stickyHeader aria-label="sticky table" sx={{ tableLayout: "fixed" }}>
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
              {itemCategory.map((cat, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={cat.item_category_id}>
                  <TableCell sx={{ width: columns[0].maxWidth, padding: "8px 16px" }}>{index + 1}</TableCell>
                  <TableCell sx={{ width: columns[1].maxWidth, padding: "8px 22px" }}>{cat.item_category_name}</TableCell>
                  <TableCell sx={{ width: columns[2].maxWidth, padding: "8px 22px" }}>{cat.items.length}</TableCell>
                  <TableCell sx={{ width: columns[3].maxWidth, padding: "8px 22px" }}>
                    <Button
                      sx={{
                        minWidth: "auto",
                        padding: 0,
                      }}
                      onClick={() => handleShowModal(cat.item_category_id)}
                    >
                      <img src={deleteIcon} alt="delete" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
  );
}
