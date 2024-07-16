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
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const columns = [
  { id: "sNo", label: "S.No.", minWidth: 60, maxWidth: 60, numeric: true },
  { id: "billNumber", label: "Bill Number", minWidth: 120, maxWidth: 120 },
  { id: "vendorName", label: "Vendor Name", minWidth: 180, maxWidth: 180 },
  {
    id: "quantity",
    label: "Quantity",
    minWidth: 100,
    maxWidth: 100,
    numeric: true,
  },
  {
    id: "measuringUnit",
    label: "Measuring Unit",
    minWidth: 140,
    maxWidth: 140,
  },
];

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

function ItemHistory() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("sNo");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const getItemHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8898/api/item-history"
        );
        console.log("API response:", response.data);
        setItems(response.data.itemHistory || []);
        setError(null);
      } catch (error) {
        console.error("API error:", error);
        setItems([]);
        // setError("Failed to fetch item history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getItemHistory();
  }, []);

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
      stableSort(items, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [items, order, orderBy, page, rowsPerPage]
  );

  const cellStyle = {
    fontSize: "16px",
    padding: "16px 24px",
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
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.numeric ? "right" : "left"}
                  sortDirection={orderBy === column.id ? order : false}
                  style={{
                    ...cellStyle,
                    ...headerStyle,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
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
            {visibleRows.map((item, index) => (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={item.id || index}
                sx={{ "&:nth-of-type(even)": { backgroundColor: "#f9f9f9" } }}
              >
                {columns.map((column) => {
                  const value =
                    column.id === "sNo"
                      ? page * rowsPerPage + index + 1
                      : item[column.id] ?? "N/A";
                  return (
                    <TableCell
                      key={column.id}
                      align={column.numeric ? "right" : "left"}
                      style={{
                        ...cellStyle,
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                      }}
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
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default ItemHistory;
