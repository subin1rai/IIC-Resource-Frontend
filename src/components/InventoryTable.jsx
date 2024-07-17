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
  { id: "item_name", label: "Item Name", maxWidth: 120 },
  { id: "unit_price", label: "Unit Price", maxWidth: 80, numeric: true },
  { id: "measuring_unit", label: "Measuring Unit", maxWidth: 80 },
  {
    id: "total_purchased",
    label: "Total Purchased",
    maxWidth: 120,
    format: (value) => value?.toLocaleString("en-US") || "N/A",
    numeric: true,
  },
  {
    id: "quantity",
    label: "Quantity",
    maxWidth: 80,
    format: (value) => value?.toLocaleString("en-US") || "N/A",
    numeric: true,
  },
  { id: "category", label: "Category", maxWidth: 120 },
  { id: "itemCategory", label: "Item Category", maxWidth: 120 },
  { id: "productCategory", label: "Product Category", maxWidth: 120 },
  {
    id: "recentPurchase",
    label: "Recent Purchase",
    maxWidth: 120,
    numeric: true,
  },
  { id: "stockStatus", label: "Status", maxWidth: 120 },
];

export default function InventoryTable({ items }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("recentPurchase");
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
    fontSize: "16px",
  };

  const headerStyle = {
    fontWeight: 600,
  };

  const handleRowClick = (id) => {
    navigate(`/specificItem/${id}`);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        cursor: "pointer",
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
            {visibleRows.map((item) => (
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
                  if (column.id === "productCategory") {
                    value = item.productCategory?.product_category_name;
                  }
                  if (column.id === "category") {
                    value = item.category?.category_name;
                  }
                  if (column.id === "itemCategory") {
                    value = item.itemCategory?.item_category_name;
                  }

                  return (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={
                        column.id === "stockStatus"
                          ? { ...cellStyle, ...getStockStatusStyle(value) }
                          : cellStyle
                      }
                    >
                      {column.format && typeof value === "number"
                        ? column.format(value)
                        : value || "N/A"}
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
