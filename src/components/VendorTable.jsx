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
import { useNavigate } from "react-router-dom";
import empty from "../assets/Emptyvendor.svg";
import Box from "@mui/material/Box";

const columns = [
  { id: "vendor_name", label: "Vendor Name", maxWidth: 120 },
  { id: "vat_number", label: "VAT Number", maxWidth: 120 },
  {
    id: "vendor_contact",
    label: "Contact Number",
    maxWidth: 120,
    align: "center",
    format: (value) => value?.toLocaleString("en-US") || "N/A",
  },
  {
    id: "total_amount",
    label: "Total Amount",
    maxWidth: 120,
    align: "center",
    format: (value) => value?.toLocaleString("en-US") || "N/A",
    numeric: true,
  },
  {
    id: "TDS",
    label: "Total TDS",
    maxWidth: 120,
    align: "center",
    format: (value) => value?.toFixed(2) || "N/A",
    numeric: true,
  },
  {
    id: "last_purchase_date",
    label: "Recent Purchase",
    maxWidth: 120,
    align: "center",
    format: (value) => {
      if (!value) return "N/A";
      const date = new Date(value);
      return isNaN(date.getTime()) ? "N/A" : date.toISOString().split("T")[0];
    },
    numeric: true,
  },
  {
    id: "payment_duration",
    label: "Payment Duration",
    maxWidth: 120,
    align: "center",
    format: (value) => value || "N/A",
    numeric: true,
  },

  {
    id: "payment_status",
    label: "Payment Status",
    maxWidth: 120,
    align: "center",
    format: (value) => value || "N/A",
  },
];

export default function VendorTable({ vendors }) {
  console.log(vendors)
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
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
    // Safely access properties
    const aValue = a && a[orderBy];
    const bValue = b && b[orderBy];

    // Handle cases where the property might be undefined
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;

    if (orderBy === "last_purchase_date") {
      return new Date(bValue) - new Date(aValue);
    }

    if (bValue < aValue) {
      return -1;
    }
    if (bValue > aValue) {
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
      stableSort(vendors || [], getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [vendors, order, orderBy, page, rowsPerPage]
  );

  const handleRowClick = (vendorId) => {
    navigate(`/specificVendor/${vendorId}`);
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
          <TableHead className="z-0">
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
            {!visibleRows || visibleRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "380px",
                      width: "100%",
                    }}
                  >
                    <img
                      src={empty}
                      alt="No requests"
                      className="h-72 w-72"
                      style={{ maxWidth: "300px", marginBottom: "20px" }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((vendor) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={vendor?.vendor_id || Math.random()}
                  onClick={() => handleRowClick(vendor?.vendor_id)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === "payment_status" ? (
                        vendor.pending_payment > 0 ? (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              backgroundColor: "#fff3cd",
                              fontWeight: "normal",
                              textAlign: "center",
                            }}
                          >
                            Pending
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              backgroundColor: "#d4edda",
                              fontWeight: "normal",
                              textAlign: "center",
                            }}
                          >
                            Completed
                          </span>
                        )
                      ) : column.format &&
                        vendor &&
                        vendor[column.id] !== undefined ? (
                        column.format(vendor[column.id])
                      ) : vendor && vendor[column.id] !== undefined ? (
                        vendor[column.id]
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={vendors && Array.isArray(vendors) ? vendors.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) =>
          count === 0
            ? "No records"
            : `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
      />
    </Paper>
  );
}
