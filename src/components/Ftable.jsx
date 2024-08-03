import React from "react";
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
  { id: "action", label: "Action", width: 150}
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
      if (axios.isCancel(error)) {
        console.log("Request Canceled", error.message);
        return;
      }
      console.error("Error deleting feature:", error);
    }
  };

  const showDeleteConfirm = (featureId) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this category?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDeleteSubmit(featureId),
          className: 'confirm-yes',
        },
        {
          label: "No",
          onClick: () => {},
          className: 'confirm-no',
        },
      ],
    });
  };

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
                <TableCell key={{ width: columns[0].width, padding: "8px 16px" }}>
                  {index + 1}
                </TableCell>
                <TableCell key={{ width: columns[1].width, padding: "8px 22px" }}>
                  {feat.feature_name}
                </TableCell>
                <TableCell key={{ width: columns[2].width, padding: "8px 22px" }}>
                  <Button
                    sx={{
                      minWidth: "auto", // Adjust button style to your preference
                      padding: 0,
                    }}
                    onClick={() => showDeleteConfirm(feat.feature_id)}
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
