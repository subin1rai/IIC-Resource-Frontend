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

import "/src/App.css";

const columns = [
  { id: "sn", label: "SN", width: 70 },
  { id: "feature_name", label: "Feature Name", width: 40 },
  { id: "action", label: "Action", width: 150 },
];

export default function Ftable({ feature = [], setFeature }) {
 
  const token = localStorage.getItem("token");

  const handleDeleteSubmit = async (featureId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8898/api/deleteFeature/${featureId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setFeature((prevFeature) =>
        prevFeature.filter((feat) => feat.feature_id !== featureId)
      );
    } catch (error) {
      console.error("Error deleting feature:", error);
    }
  };

  const handleShowModal = (featureId) => {
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
        handleDeleteSubmit(featureId);
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
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={{ width: column.width, padding: "8px 14px" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {feature.map((feat, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={feat.feature_id}>
                  <TableCell sx={{ width: columns[0].width, padding: "8px 16px" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ width: columns[1].width, padding: "8px 22px" }}>
                    {feat.feature_name}
                  </TableCell>
                  <TableCell sx={{ width: columns[2].width, padding: "8px 22px" }}>
                    <Button
                      sx={{
                        minWidth: "auto",
                        padding: 0,
                      }}
                      onClick={() => handleShowModal(feat.feature_id)}
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
