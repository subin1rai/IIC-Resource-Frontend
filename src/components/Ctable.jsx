import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import axios from "axios";

const columns = [
  { id: "sn", label: "SN", maxWidth: 70 },
  { id: "category_name", label: "Category Name", maxWidth: 150 },
  { id: "items", label: "Items", maxWidth: 120 },
  { id: "action", label: "Action", maxWidth: 120 },
];

export default function Ctable({ category, setCategory }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDeleteSubmit = async (categoryId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8898/api/deleteCategory/${categoryId}`
      );
      console.log(response.data);
      setCategory((prevCategory) =>
        prevCategory.filter((cat) => cat.category_id !== categoryId)
      );
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request Canceled", error.message);
        return;
      }
    }
    window.location.reload();
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
            {category
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((cat, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={cat.category_id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{cat.category_name}</TableCell>
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
                      onClick={() => handleDeleteSubmit(cat.category_id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[7, 14, 21]}
        component="div"
        count={category.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
