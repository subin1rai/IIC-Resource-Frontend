import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useState } from "react";

const columns = [
  { id: "issue_id", label: "Issue ID", maxWidth: 70 },
  { id: "issued_item", label: "Issued Items", maxWidth: 70 },
  {
    id: "issue_date",
    label: "Issue Date",
    maxWidth: 70,
    align: "center",
    format: (value) => new Date(value).toLocaleDateString("en-US"),
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
  },
  {
    id: "status",
    label: "Status",
    maxWidth: 70,
    align: "center",
  },
  {
    id: "issued_by",
    label: "Issued By",
    maxWidth: 70,
    align: "center",
  },
  {
    id: "remarks",
    label: "Remarks",
    maxWidth: 70,
    align: "center",
  },
];

function createData(issue_id, issued_item, issue_date, quantity, department, status, issued_by, remarks) {
  return { issue_id, issued_item, issue_date, quantity, department, status, issued_by, remarks };
}

const rows = [
  createData(1, "Item A", "2024-03-04", 1324, "Finance", "Issued", "John Doe", "Remark A"),
  createData(2, "Item B", "2024-03-05", 1345, "HR", "Issued", "Jane Doe", "Remark B"),
  createData(3, "Item C", "2024-03-06", 1366, "IT", "Pending", "John Smith", "Remark C"),
  // Add more rows as needed
];

export default function InventoryTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("issue_id");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (orderBy === "issue_date") {
      return new Date(b[orderBy]) - new Date(a[orderBy]);
    }
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [rows, order, orderBy, page, rowsPerPage]
  );

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
                  sortDirection={orderBy === column.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.issue_id}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === "number"
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[7]}
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
