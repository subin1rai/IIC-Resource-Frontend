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
  { id: "sn", label: "SN", width: 70 },
  { id: "category_name", label: "Category Name", width: 100 },
  { id: "items", label: "Items", width: 100 },
  { id: "action", label: "Action", width: 170 },
];

export default function Itable({ itemCategory, setItemCategory }) {
  const handleDeleteSubmit = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:8898/api/deleteItemCategory/${categoryId}`
    );
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
                  sx={{ width: column.width, padding: "8px 16px" }}
                  align={column.id === "action" ? "center" : "left"}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {itemCategory.map((cat, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={cat.item_category_id}>
                <TableCell sx={{ width: columns[0].width, padding: "8px 16px" }}></TableCell>
                <TableCell sx={{ width: columns[1].width, padding: "8px 16px" }}>{cat.item_category_name}</TableCell>
                <TableCell sx={{ width: columns[2].width, padding: "8px 16px" }}>{cat.items.length}</TableCell>
                <TableCell sx={{ width: columns[3].width, padding: "8px 0px" }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#ff4d4d",
                      '&:hover': {
                        backgroundColor: "#e60000",
                      }
                    }}
                    onClick={() => handleDeleteSubmit(cat.item_category_id)}
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

