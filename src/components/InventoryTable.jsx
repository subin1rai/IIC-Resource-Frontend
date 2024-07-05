import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";

const columns = [
  { id: "item_id", label: "Item ID", maxWidth: 70 },
  { id: "item_name", label: "Item Name", maxWidth: 150 },
  { id: "measuring_unit", label: "Measuring Unit", maxWidth: 120 },
  {
    id: "total_purchased",
    label: "Total Purchased",
    maxWidth: 120,
    align: "right",
    format: (value) => value?.toLocaleString("en-US") || "N/A",
  },
  {
    id: "quantity",
    label: "Quantity",
    maxWidth: 100,
    align: "right",
    format: (value) => value?.toLocaleString("en-US") || "N/A",
  },
  { id: "category", label: "Category", maxWidth: 120 },
  { id: "productCategory", label: "Product Category", maxWidth: 150 },
];

export default function InventoryTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    const getAllItems = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/items");
        setItems(response.data.items || []);
      } catch (error) {
        console.log(error);
        setItems([]);
      }
    };

    getAllItems();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={item.item_id}
                >
                  {columns.map((column) => {
                    let value = item[column.id];
                    if (column.id === "productCategory") {
                      value = item.productCategory?.product_category_name;
                    }
                    return (
                      <TableCell key={column.id} align={column.align}>
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
        rowsPerPageOptions={[7, 14, 21]}
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
