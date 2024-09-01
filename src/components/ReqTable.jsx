import * as React from "react";
import { useNavigate } from "react-router-dom";
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
import Box from "@mui/material/Box";
import empty from "../assets/EmptyRequest.svg"

const columns = [
  { id: "user_name", label: "Requested By", maxWidth: 70, align: "left" },
  {
    id: "requested_for",
    label: "Requested For",
    maxWidth: 70,
    align: "left",
  },
  {
    id: "request_date",
    label: "Requested Date",
    maxWidth: 70,
    align: "left",
    format: (value) => new Date(value).toLocaleDateString("en-US"),
  },
  { id: "department_name", label: "Department", maxWidth: 70, align: "left" },
  { id: "status", label: "Status", maxWidth: 70, align: "left" },
];

export default function ReqTable({ requests }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("req_id");

  const navigate = useNavigate();

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
    if (orderBy === "request_date") {
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
    const validArray = array.filter((item) => item != null);
    const stabilizedThis = validArray.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const visibleRows = useMemo(
    () =>
      requests && Array.isArray(requests)
        ? stableSort(
          requests.filter((request) => request != null),
          getComparator(order, orderBy)
        ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : [],
    [requests, order, orderBy, page, rowsPerPage]
  );

  const handleRowClick = (request_id) => {
    if (request_id) {
      navigate(`/specificRequest/${request_id}`);
    }
  };

  const cellStyle = {
    fontSize: "14px",
    padding: "12px 16px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const headerStyle = {
    fontWeight: 600,
    backgroundColor: "#f5f5f5",
    align: "center",
  };

  if (!requests || requests.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "480px",
          width: "100%",
        }}
      >
        <img
          src={empty}
          className="h-56"
          alt="No requests"
        />

      </Box>
    );
  }

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
            {visibleRows
              .slice()
              .reverse()
              .map((request, index) =>
                request ? (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={request.req_id || `unknown-${index}`}
                    onClick={() => handleRowClick(request.request_id)}
                    style={{ cursor: "pointer" }}
                  >
                    {columns.map((column) => {
                      let value = request[column.id];

                      if (column.id === "status") {
                        value = request.status;
                      }

                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={cellStyle}
                        >
                          {column.id === "status" ? (
                            <div
                              style={{
                                display: "inline-block",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                backgroundColor:
                                  value === "Pending"
                                    ? "#fff3cd"
                                    : value === "Delivered"
                                      ? "#d4edda"
                                      : value === "Holding"
                                        ? "#d1ecf1"
                                        : "#f8d7da",
                                color:
                                  value === "Pending"
                                    ? "#856404"
                                    : value === "Delivered"
                                      ? "#155724"
                                      : value === "Holding"
                                        ? "#0c5460"
                                        : "#721c24",
                                fontWeight: "normal",
                                textAlign: "center",
                              }}
                            >
                              {value ?? "N/A"}
                            </div>
                          ) : column.format && value != null ? (
                            column.format(value)
                          ) : (
                            value ?? "N/A"
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ) : null
              )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={requests && Array.isArray(requests) ? requests.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}