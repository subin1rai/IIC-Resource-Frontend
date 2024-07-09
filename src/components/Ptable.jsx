import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import axios from "axios";

const columns = [
  { id: "sn", label: "SN", maxWidth: 70 },
  { id: "category_name", label: "Category Name", maxWidth: 150 },
  { id: "items", label: "Items", maxWidth: 120 },
  { id: "action", label: "Action", maxWidth: 120 },
];

export default function Ptable({ productCategory, setProductCategory }) {
  const handleDeleteSubmit = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:8898/api/deleteProductCategory/${categoryId}`);
      setProductCategory((prevCategory) =>
        prevCategory.filter((cat) => cat.product_category_id !== categoryId)
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
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {productCategory.map((cat, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={cat.product_category_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{cat.product_category_name}</TableCell>
                <TableCell>{cat.items.length}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: "#ff4d4d", // light red background
                      '&:hover': {
                        backgroundColor: "#e60000", // darker red on hover
                      }
                    }} 
                    onClick={() => handleDeleteSubmit(cat.product_category_id)}
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
