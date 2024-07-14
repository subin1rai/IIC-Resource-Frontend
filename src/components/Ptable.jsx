
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import axios from "axios";
import deleteIcon from "../assets/deleteIcon.svg";
import { confirmAlert } from "react-confirm-alert"; // Import
import "/src/App.css"; // Import CSS

const columns = [
  { id: "sn", label: "SN", width: 70 },
  { id: "category_name", label: "Category Name", width: 100 },
  { id: "items", label: "Items", width: 100 },
  { id: "action", label: "Action", width: 170 },
];

export default function Ptable({ productCategory, setProductCategory }) {
  const handleDeleteSubmit = async (categoryId) => {
    try{
    const response = await axios.delete(
      `http://localhost:8898/api/deleteProductCategory/${categoryId}`
    );
    console.log(response.data);
      setProductCategory((prevCategory) =>
        prevCategory.filter((cat) => cat.product_category_id !== categoryId)
      );
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request Canceled", error.message);
        return;
      }
    }
    window.location.reload();
  };
const showDeleteConfirm = (categoryId) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this category?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDeleteSubmit(categoryId),
          className: 'confirm-yes' 
        },
        {
          label: "No",
          onClick: () => {},
          className: 'confirm-no'
        }
      ]
    });
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
        <Table stickyHeader aria-label="sticky table"  sx={{ tableLayout: "fixed"}}>
          <TableHead>
            <TableRow>
            {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{ width: column.width, padding: "8px 14px" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {productCategory.map((cat, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={cat.product_category_id}>
                 <TableCell sx={{ width: columns[0].width, padding: "8px 16px" }}>{index + 1}</TableCell>
                 <TableCell sx={{ width: columns[1].width, padding: "8px 22px" }}>{cat.product_category_name}</TableCell>
                 <TableCell sx={{ width: columns[2].width, padding: "8px 22px" }}>{cat.items.length}</TableCell>
                 <TableCell sx={{ width: columns[3].width, padding: "8px 22px" }}>
                  <Button 
          
                    sx={{ 
                      minWidth: "auto", // Adjust button style to your preference
                      padding: 0,
                    }} 
                    onClick={() => showDeleteConfirm(cat.product_category_id)}
                  >
                    <img src={deleteIcon} alt="delete" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}