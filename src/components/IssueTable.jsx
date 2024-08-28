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
import { useState, useMemo } from "react";

// Column definitions
const columns = [
  { id: "issue_id", label: "Issue ID", minWidth: 70 },
 
  {
    id: "issue_date",
    label: "Issue Date",
    minWidth: 70,
    format: (value) => new Date(value).toLocaleDateString("en-US"),
  },
  { id: "issued_item", label: "Issued Item", minWidth: 70 },
  {
    id: "item_quantity",
    label: "Quantity",
    minWidth: 70,
    align: "center",
    format: (value) => value.toFixed(2),
  },
  { id: "requested_by", label: "Requested By", minWidth: 70, align: "center" },
  { id: "department", label: "Department", minWidth: 70, align: "center" },
  { id: "issued_by", label: "Issued By", minWidth: 70, align: "center" },
  { id: "status", label: "Status", minWidth: 70, align: "center" },
  { id: "remarks", label: "Remarks", minWidth: 70, align: "center" },

];

const createData = (
  issue_id,
  issued_item,
  issue_date,
  quantity,
  department,
  status,
  issued_by,
  remarks
) => ({
  issue_id,
  issued_item,
  issue_date,
  quantity,
  department,
  status,
  issued_by,
  remarks,
});

export default function InventoryTable({ issues }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("issue_id");

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getComparator = (order, orderBy) =>
    order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);

  const descendingComparator = (a, b, orderBy) => {
    if (orderBy === "issue_date") {
      return new Date(b[orderBy]) - new Date(a[orderBy]);
    }
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
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

  const visibleRows = useMemo(
    () =>
      stableSort(issues, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [issues, order, orderBy, page, rowsPerPage]
  );

  const cellStyle = {
    fontSize: "14px",
    padding: "12px 16px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  const headerStyle = { fontWeight: 600, backgroundColor: "#f5f5f5" };

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
                  style={{
                    minWidth: column.minWidth,
                    ...headerStyle,
                    ...cellStyle,
                  }}
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
            {visibleRows.map((issue) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={issue.issue_id}>
                {columns.map((column) => {
                  const value = issue[column.id];
                  return (
                    <TableCell key={column.id} 
                    align={column.align}
                    style={cellStyle}
                    >
                      {column.format && value != null ? (
                            column.format(value)
                          ) : (
                            value ?? "N/A"
                          )}
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
        count={issues.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
