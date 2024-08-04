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
import ConfirmModal from "/src/components/ConfirmModal";
import "/src/App.css";

const columns = [
  { id: "sn", label: "SN", maxWidth: 70 },
  { id: "category_name", label: "Category Name", maxWidth: 70 },
  { id: "items", label: "Items", maxWidth: 70 },
  { id: "action", label: "Action", maxWidth: 70 },
];

export default function Ctable({ category, setCategory }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const token = localStorage.getItem("token");

  const handleDeleteSubmit = async (categoryId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8898/api/deleteCategory/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setCategory((prevCategory) =>
        prevCategory.filter((cat) => cat.category_id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
    window.location.reload();
  };

  const handleShowModal = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategoryId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedCategoryId) {
      handleDeleteSubmit(selectedCategoryId);
    }
    handleCloseModal();
  };

  // Assume each row has a height of 64px
  const rowHeight = 48;
  const maxVisibleRows = 5;
  const maxHeight = rowHeight * maxVisibleRows;

  return (
    <>
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
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={{ width: column.maxWidth, padding: "8px 14px" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {category.map((cat, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={cat.category_id}>
                  <TableCell sx={{ width: columns[0].maxWidth, padding: "8px 16px" }}>{index + 1}</TableCell>
                  <TableCell sx={{ width: columns[1].maxWidth, padding: "8px 22px" }}>{cat.category_name}</TableCell>
                  <TableCell sx={{ width: columns[2].maxWidth, padding: "8px 22px" }}>{cat.items.length}</TableCell>
                  <TableCell sx={{ width: columns[3].maxWidth, padding: "8px 22px" }}>
                    <Button
                      sx={{
                        minWidth: "auto",
                        padding: 0,
                      }}
                      onClick={() => handleShowModal(cat.category_id)}
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
      <ConfirmModal show={showModal} onClose={handleCloseModal} onConfirm={handleConfirmDelete} />
    </>
  );
}
