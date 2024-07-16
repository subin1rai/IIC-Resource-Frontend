import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
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
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const token = localStorage.getItem("token");

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
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bills
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((bill) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={bill.bill_ID}
                  onClick={() => handleRowClick(bill.bill_ID)}
                >
                  {columns.map((column) => {
                    const value =
                      column.id === "vendor_name"
                        ? bill.vendors.vendor_name
                        : bill[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
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
