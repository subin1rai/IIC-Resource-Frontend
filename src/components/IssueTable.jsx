import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "issue_id", label: "Issue ID", maxWidth: 70 },
  { id: "issued_item", label: "Issued Items", maxWidth: 70 },
  {
    id: "issue_date",
    label: "Issue Date",
    maxWidth: 70,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "quantity",
    label: "Quantity",
    maxWidth: 70,
    align: "center",
    format: (value) => value.toFixed(2),
  },
  {
    id: "department",
    label: "Department",
    maxWidth: 70,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "status",
    label: "Status",
    maxWidth: 70,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "issued_by",
    label: "Issued By",
    maxWidth: 70,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "remarks",
    label: "Remarks",
    maxWidth: 70,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
];

function createData(issue_id, issued_item, issue_date, quantity, department) {
  return { issue_id, issued_item, issue_date, quantity, department };
}

const rows = [
  createData(1, "India", "2024-03-04", 1324, "Finance"),
  createData(2, "India", "2024-03-04", 1324, "Finance"),
  createData(3, "India", "2024-03-04", 1324, "Finance"),
  createData(4, "India", "2024-03-04", 1324, "Finance"),
  createData(5, "India", "2024-03-04", 1324, "Finance"),
  createData(6, "India", "2024-03-04", 1324, "Finance"),
  createData(7, "India", "2024-03-04", 1324, "Finance"),
];

export default function InventoryTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          height={3}
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
