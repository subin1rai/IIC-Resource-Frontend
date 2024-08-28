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

// all the columns of inventpry table
const columns = [
  { id: "item_name", label: "Item Name", maxWidth: 120 },
  { id: "unit_price", label: "Unit Price", maxWidth: 80, numeric: true },
  { id: "measuring_unit", label: "Measuring Unit", maxWidth: 80 },
  {
    id: "total_Amount",
    label: "Total Purchased",
    maxWidth: 120,
    format: (value) => value?.toLocaleString("en-US") || "N/A",
    numeric: true,
  },

  {
    id: "quantity",
    label: "Actual Quanity",
    maxWidth: 80,
    align: "left",
    format: (value) => value?.toLocaleString("en-US") || 0,
    numeric: true,
  },
  {
    id: "remaining_quantity",
    label: "Available Stock",
    maxWidth: 80,
    align: "left",
    format: (value) => value?.toLocaleString("en-US") || 0,
    numeric: true,
  },

  {
    id: "recent_purchase",
    label: "Recent Purchase",
    maxWidth: 120,
    numeric: true,
    align: "center",
  },
  { id: "stockStatus", label: "Status", maxWidth: 120 },
];

export default function InventoryTable({ items }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("recentPurchase");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const navigate = useNavigate();

  console.log(items);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  console.log(items);
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
    if (orderBy === "recentPurchase") {
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
      stableSort(items, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [items, order, orderBy, page, rowsPerPage]
  );

  const getStockStatusStyle = (stockStatus) => {
    return {
      color: stockStatus === "Low Stock" ? "red" : "green",
    };
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

  const handleRowClick = (id) => {
    navigate(`/specificItem/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
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
                  style={{
                    ...cellStyle,
                    ...headerStyle,
                    minWidth: column.minWidth,
                  }}
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
            {visibleRows
              .slice()
              .reverse()
              .map((item) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={item.item_id}
                  onClick={() => handleRowClick(item.item_id)}
                  style={{ cursor: "pointer" }}
                >
                  {columns.map((column) => {
                    let value = item[column.id];

                    if (column.id === "quantity") {
                      value = item?.quantity || 0;
                    }

                    if (column.id === "total_Amount") {
                      value = "Rs " + Number(item.total_Amount).toFixed(2);
                    }

                    if (column.id === "recent_purchase") {
                      value = formatDate(item.recent_purchase) || "N/A";
                    }

                    if (column.id === "item_name") {
                      value = item.item_name;

                      if (column.id === "item_name") {
                        value = item.item_name;

                        if (
                          item.itemsOnFeatures &&
                          Object.keys(item.itemsOnFeatures).length > 0
                        ) {
                          const sortedKeys = Object.keys(
                            item.itemsOnFeatures
                          ).sort();

                          const features = sortedKeys
                            .map((key) => ` ${item.itemsOnFeatures[key]}`)
                            .join(" - ");

                          value = `${item.item_name} - ${features}`;
                        }
                      }
                    }

                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={cellStyle}
                      >
                        {column.id === "stockStatus" ? (
                          <div
                            style={{
                              display: "inline-block",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              backgroundColor:
                                value === "In Stock"
                                  ? "#d4edda"
                                  : value === "in stock"
                                  ? "#155724"
                                  : "#f8d7da",
                              color:
                                value === "Low Stock"
                                  ? "#856404"
                                  : value === "low stock"
                                  ? "#155724"
                                  : "#721c24",
                              fontWeight: "normal",
                              textAlign: "center",
                            }}
                          >
                            {value ?? "Low Stock"}
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
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
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
