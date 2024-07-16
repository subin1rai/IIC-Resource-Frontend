import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel"; // Import TableSortLabel for sorting
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router
import axios from "axios";

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
    id: "purchase_amount",
    label: "Purchase Amount",
    maxWidth: 120,
    align: "center",
    format: (value) => value?.toLocaleString("en-US") || "N/A",
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
    format: (value) => value?.toFixed(2) || "N/A",
    numeric: true,
  },
  {
    id: "payment_status",
    label: "Payment Status",
    maxWidth: 120,
    align: "center",
    format: (value) => value?.toFixed(2) || "N/A",
  },
];

export default function VendorTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("last_purchase_date");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const getAllVendors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8898/api/vendor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVendors(response.data.vendors || []);
        console.log(response.data.vendors);
      } catch (error) {
        console.log("Error fetching vendors:", error);
        setVendors([]);
      }
    };

    getAllVendors();
  }, []);

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
    if (orderBy === "last_purchase_date") {
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
      stableSort(vendors, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [vendors, order, orderBy, page, rowsPerPage]
  );

  const handleRowClick = (vendorId) => {
    navigate(`/specificVendor/${vendorId}`); // Navigate to the vendor details page
  };

  const cellStyle = {
    fontSize: "16px",
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
                  sortDirection={orderBy === column.id ? order : false}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.numeric ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
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
                key={vendor.vendor_id}
                onClick={() => handleRowClick(vendor.vendor_id)} // Add onClick handler
              >
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.format
                      ? column.format(vendor[column.id])
                      : vendor[column.id]}
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
        count={vendors.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
