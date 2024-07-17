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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const columns = [
  { id: "bill_ID", label: "Bill Number", maxWidth: 70 },
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
    id: "vendor_name",
    label: "Vendor Name",
    maxWidth: 70,
    align: "center",
  },
  {
    id: "actual_amount",
    label: "Total Amount",
    maxWidth: 70,
    align: "center",
    format: (value) => value?.toLocaleString("en-US"),
  },
  {
    id: "paid_amount",
    label: "Paid Amount",
    maxWidth: 70,
    align: "center",
    format: (value) => value?.toLocaleString("en-US"),
  },
];

export default function RecordsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(11);
  const [bills, setBills] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("bill_ID");
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const getAllBills = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/bill", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBills(response.data.bills || []);
        console.log(response.data.bills);
      } catch (error) {
        console.log(error);
        setBills([]);
      }
    };

    getAllBills();
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
    if (orderBy === "bill_date") {
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
      stableSort(bills, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [bills, order, orderBy, page, rowsPerPage]
  );

  const handleRowClick = (bill_ID) => {
    navigate(`/specificbill/${bill_ID}`);
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
            {visibleRows.map((bill) => (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={bill.bill_ID}
                onClick={() => handleRowClick(bill.bill_ID)}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.format
                      ? column.format(bill[column.id])
                      : bill[column.id]}
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
        count={bills.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
