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
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const columns = [
  { id: "sNo", label: "S.No.", minWidth: 70, align: "center" },
  { id: "bill_number", label: "Bill Number", minWidth: 130, align: "center" },
  { id: "vendor_name", label: "Vendor Name", minWidth: 200, align: "center" },
  { id: "quantity", label: "Quantity", minWidth: 110, align: "center" },
  { id: "paid_amount", label: "Paid Amount", minWidth: 110, align: "center" },
  {
    id: "actual_amount",
    label: "Actual Amount",
    minWidth: 110,
    align: "center",
  },
  { id: "bill_date", label: "Purchase Date", minWidth: 130, align: "center" },
];

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const descendingComparator = (a, b, orderBy) => {
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

function PurchaseHistory() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("sNo");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm] = useState(""); // Assuming searchTerm is used elsewhere

  const { id } = useParams();

  const navigate = useNavigate();

  const handleRowClick = (id) => {
    console.log(id);
    navigate(`/specificbill/${id}`);
  };

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8898/api/items/${id}`
        );
        setPurchaseHistory(response.data.bills || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching purchase history:", err);
        setError("Failed to fetch purchase history. Please try again later.");
        setLoading(false);
      }
    };
    fetchPurchaseHistory();
  }, [id]);

  console.log(purchaseHistory);
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

    if (property === "sNo") {
      setPurchaseHistory([...purchaseHistory].reverse());
    }
  };

  const filteredRows = useMemo(
    () =>
      Array.isArray(purchaseHistory)
        ? purchaseHistory.filter((row) =>
            Object.values(row).some(
              (value) =>
                value &&
                value
                  .toString()
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
          )
        : [],
    [purchaseHistory, searchTerm]
  );

  const visibleRows = useMemo(() => {
    let sortedRows =
      orderBy === "sNo"
        ? filteredRows
        : stableSort(filteredRows, getComparator(order, orderBy));

    return sortedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredRows, order, orderBy, page, rowsPerPage]);

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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  const descendingComparator = (a, b, orderBy) => {
    if (orderBy === "bill_date") {
      return new Date(b[orderBy]) - new Date(a[orderBy]);
    }
    if (typeof a[orderBy] === "string") {
      return b[orderBy].localeCompare(a[orderBy]);
    }
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  if (error) {
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  }

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="purchase history table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    ...cellStyle,
                    ...headerStyle,
                    minWidth: column.minWidth,
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
            {visibleRows.map((row, index) => (
              <TableRow
                hover
                role="row"
                tabIndex={-1}
                key={index}
                onClick={() => handleRowClick(row.bill_ID)}
                className="cursor-pointer"
              >
                {columns.map((column) => {
                  let value;
                  if (column.id === "sNo") {
                    value = page * rowsPerPage + index + 1;
                  } else if (column.id === "vendor_name") {
                    value = row.vendors?.vendor_name || "";
                  } else if (column.id === "bill_number") {
                    value = row.bill_no;
                  } else if (column.id === "quantity") {
                    value = row.quantity;
                  } else if (column.id === "actual_amount") {
                    value = row.actual_amount;
                  } else if (column.id === "paid_amount") {
                    value = row.paid_amount;
                  } else if (column.id === "bill_date") {
                    value = formatDate(row.bill_date);
                  }

                  return (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={cellStyle}
                    >
                      {value}
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
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default PurchaseHistory;
