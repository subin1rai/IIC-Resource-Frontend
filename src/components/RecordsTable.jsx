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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import empty from "../assets/Emptybills.svg";
import Box from "@mui/material/Box";

const columns = [
  { id: "bill_no", label: "Bill Number", maxWidth: 70 },
  {
    id: "bill_date",
    label: "Bill Date",
    maxWidth: 70,
    align: "center",
    format: (value) => {
      if (!value) return "N/A";
      const date = new Date(value);
      return isNaN(date.getTime()) ? "N/A" : date.toISOString().split("T")[0];
    },
  },
  {
    id: "invoice_no",
    label: "Voucher Number",
    maxWidth: 70,
    align: "center",
  },
  {
    id: "bill_type",
    label: "Bill Type",
    maxWidth: 30,
    align: "left",
  },
  {
    id: "vendor_name",
    label: "Vendor Name",
    maxWidth: 70,
    align: "center",
  },

  {
    id: "actual_Amount",
    label: "Total Amount",
    maxWidth: 70,
    align: "center",
    format: (value) => value?.toLocaleString("en-US") ?? "N/A",
  },
  {
    id: "paid_amount",
    label: "Paid Amount",
    maxWidth: 70,
    align: "center",
    format: (value) => value?.toLocaleString("en-US") ?? "N/A",
  },
  {
    id: "bill_status",
    label: "Bill Status",
    maxWidth: 70,
    align: "center",
  },
];

export default function RecordsTable({ bills }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("bill_ID");

  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  console.log(bills);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const headerStyle = {
    fontWeight: 600,
    backgroundColor: "#f5f5f5",
  };

  const cellStyle = {
    fontSize: "14px",
    padding: "12px 16px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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
    // Check if a or b is undefined
    if (!a || !b) return 0;

    if (orderBy === "bill_date") {
      return new Date(b[orderBy] || 0) - new Date(a[orderBy] || 0);
    }

    // Use optional chaining to safely access properties
    if ((b[orderBy] ?? "") < (a[orderBy] ?? "")) {
      return -1;
    }
    if ((b[orderBy] ?? "") > (a[orderBy] ?? "")) {
      return 1;
    }
    return 0;
  };

  if (!bills || !Array.isArray(bills)) return null;

  const stableSort = (array, comparator) => {
    // Filter out any undefined or null items
    // const validArray = array.filter((item) => item != null);
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
      stableSort(bills,
        getComparator(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [bills, order, orderBy, page, rowsPerPage]
  );

  const handleRowClick = (bill_id) => {
    navigate(`/specificbill/${bill_id}`);
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
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sortDirection={orderBy === column.id ? order : false}
                  style={{
                    minWidth: column.minWidth,
                    ...headerStyle,
                    ...cellStyle,
                  }}
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
            {!bills || bills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "370px",
                      width: "100%",
                    }}
                  >
                    <img
                      src={empty}
                      alt="No bills"
                      className="h-72 w-72"
                      style={{ maxWidth: "300px", marginBottom: "20px" }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((bill, index) =>
                  bill ? (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={bill.bill_id || `unknown-${index}`}
                      onClick={() => handleRowClick(bill.bill_id)}
                      style={{ cursor: "pointer" }}
                    >
                      {columns.map((column) => {
                        let value = bill[column.id];

                        if (column.id === "vendor_name") {
                          value = bill.vendors?.vendor_name;
                        }
                        if (column.id === "item_name") {
                          value = bill.items?.item_name;
                        }
                        if (column.id === "bill_status") {
                          value = bill?.isApproved ? "Approved" : "Pending";
                        }

                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={cellStyle}
                          >
                            {column.id === "bill_status" ? (
                              <div
                                style={{
                                  display: "inline-block",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  backgroundColor:
                                    value === "Pending"
                                      ? "#fff3cd"
                                      : value === "Approved"
                                      ? "#d4edda"
                                      : "#f8d7da",
                                  color:
                                    value === "Pending"
                                      ? "#856404"
                                      : value === "Approved"
                                      ? "#155724"
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
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={bills && Array.isArray(bills) ? bills.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
