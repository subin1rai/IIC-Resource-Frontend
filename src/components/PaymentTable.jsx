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

const columns = [
  { id: "vendor-id", label: "Vendor Name", maxWidth: 120 },
  {
    id: "pending_payment",
    label: "Pending Payment",
    maxWidth: 120,
    align: "center",
    format: (value) => value?.toLocaleString("en-US") || "N/A",
    numeric: true,
  },
  {
    id: "payment_duration",
    label: "Payment Duration",
    maxWidth: 120,
    align: "center",
    format: (value) => value?.toLocaleString("en-US") || "N/A",
    numeric: true,
  },
  {
    id: "last_paid_date",
    label: "Recent Payment",
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
    id: "next_payment_date",
    label: "Next Payment Date",
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
    id: "payment_status",
    label: "Payment Status",
    maxWidth: 120,
    align: "center",
    format: (value) => value || "N/A",
  },
];

export default function PaymentTable({ payments }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("vendor_name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
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

    if (orderBy === "last_paid_date") {
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
      stableSort(payments || [], getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [payments, order, orderBy, page, rowsPerPage]
  );

  const handleRowClick = (paymentId) => {
    navigate(`/specificVendor/${paymentId}`);
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
            {visibleRows.map((vendor) => (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={vendor?.vendor_id || Math.random()}
                onClick={() => handleRowClick(vendor?.vendor_id)}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.format && vendor && vendor[column.id] !== undefined
                      ? column.format(vendor[column.id])
                      : vendor && vendor[column.id] !== undefined
                      ? vendor[column.id]
                      : "N/A"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={payments?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
