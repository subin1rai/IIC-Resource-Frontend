import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";

const columns = [
  { id: "sn", label: "SN", maxWidth: 70 },
  { id: "category_name", label: "Category Name", maxWidth: 150 },
  { id: "items", label: "Items", maxWidth: 120 },
  { id: "action", label: "Action", maxWidth: 120 },
];

export default function Itable({ Itemcategory, setItemCategory, handleDeleteSubmit }) {
  const handleDeleteSUBmit = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:8898/api/deleteProductCategory/${categoryId}`);
      setItemCategory((prevCategory) =>
        prevCategory.filter((cat) => cat.item_category_id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  
  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.maxWidth }}
                  align={column.id === "action" ? "center" : "left"}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Itemcategory.map((cat, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={cat.item_category_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{cat.item_category_name}</TableCell>
                <TableCell>{cat.items.length}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#ff4d4d",
                      '&:hover': {
                        backgroundColor: "#e60000",
                      }
                    }}
                    onClick={() => handleDeleteSUBmit(cat.item_category_id)}
                  >
                    Delete
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
