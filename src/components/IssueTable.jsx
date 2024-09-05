import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Select from "react-select";
import TableCell from "@mui/material/TableCell";
import add from "../assets/addIcon.svg";
import close from "../assets/close.svg";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import IconButton from "@mui/material/IconButton";
import { ToastContainer, toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import empty from "../assets/EmptyIssue.svg";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import Box from "@mui/material/Box";
import axios from "axios";
import { useSelector } from "react-redux";

// Column definitions
const columns = [
  { id: "id", label: "Issue ID", minWidth: 70 },
  {
    id: "issue_date",
    label: "Issue Date",
    minWidth: 70,
    format: (value) => new Date(value).toLocaleDateString("en-US"),
  },
  { id: "issue_name", label: "Issued Item", minWidth: 70 },
  {
    id: "quantity",
    label: "Quantity",
    minWidth: 70,
    align: "center",
    // format: (value) => value.toFixed(2),
  },

  { id: "requested_by", label: "Requested By", minWidth: 70, align: "center" },
  { id: "department", label: "Department", minWidth: 70, align: "center" },
  { id: "approved_by", label: "Issued By", minWidth: 70, align: "center" },
  { id: "purpose", label: "Remarks", minWidth: 70, align: "center" },
  {
    id: "isReturned",
    label: "Return",
    minWidth: 70,
    align: "center",
  },
  { id: "edit", label: "Edit", minWidth: 70, align: "center" },
];

export default function InventoryTable({ issues }) {
  const [page, setPage] = useState(0);
  const [issu, setIssues] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [date, setDate] = useState("");
  const [itemFields, setItemFields] = useState([{ item: "", quantity: "" }]);
  const [order, setOrder] = useState("asc");
  const [itemOptions, setItemOptions] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [editIssueVisibility, setEditIssueVisibility] = useState(false);
  const [orderBy, setOrderBy] = useState("issue_id");

  const [issue, setIssue] = useState({
    issue_date: "",
    issued_to: "",
    purpose: "",
    items: [],
  });

  const [editedIssue, setEditedIssue] = useState({
    id: "",
    issue_date: "",
    requested_by: "",
    purpose: "",
    isReturned: "",
    remarks: "",
    status: "",
    issue_name: "",
    quantity: "",
  });

  const handleChangePage = (event, newPage) => setPage(newPage);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      alignSelf: "end",
      border: state.isFocused ? "2px solid #94a3b8" : "2px solid #e5e5e5",
      borderRadius: "4px",
      boxShadow: "none",
      minHeight: "46px",
      "&:hover": {
        border: state.isFocused ? "2px solid #94a3b8" : "2px solid #e5e5e5",
      },
    }),
    menu: (provided) => ({
      ...provided,
      width: "100%",
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }),
    input: (provided) => ({
      ...provided,
      width: "100px",
      margin: "0px",
      color: "black",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#757575",
    }),
    container: (provided) => ({
      ...provided,
      width: "250px",
      color: "black",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
      color: "black",
    }),
  };

  const handleDateChange = (event) => {
    const date = event;
    setEditedIssue((prev) => ({ ...prev, issue_date: date }));
    console.log(editedIssue);
  };

  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo.token;

  // useEffect(() => {
  //   const fetchIssues = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8898/api/issue", {});
  //       setEditedIssue(response.data.issue);
  //     } catch (error) {
  //       console.error("Error fetching issues:", error);
  //       setIssues([]);
  //     }
  //   };
  //   fetchIssues();
  // }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsResponse = await axios.get(
          "http://localhost:8898/api/items",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const options = itemsResponse.data.map((item) => ({
          value: item.item_name,
          label: item.item_name,
        }));
        setItemOptions(options);
      } catch (error) {
        console.error("Error fetching items:", error);
        setItemOptions([]);
      }
    };

    fetchItems();
  }, [token]);

  const handleChange = (e) => {
    e.preventDefault();
    setEditedIssue({ ...editedIssue, [e.target.name]: e.target.value });
    console.log(editedIssue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8898/api/editIssue/${editedIssue.id}`,
        editedIssue,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIssue({ ...issue, ...response.data });
        toast.success("Issue updated successfully");
        setEditIssueVisibility(false);
      } else {
        toast.error("Failed to update issue");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleItemChange = (selectedOption) => {
    setEditedIssue((prev) => ({
      ...prev,
      issue_name: selectedOption.value,
      quantity: selectedOption.value, // Add this line to set quantity as well
    }));
  };

  const addItemField = () => {
    if (itemFields.length < itemOptions.length) {
      setItemFields([...itemFields, { item: "", quantity: "" }]);
    }
  };

  const handleSelectChange = (event) => {
    event.preventDefault();
    setEditedIssue({ ...editedIssue, isReturned: event.target.value });
    console.log(editedIssue);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const closeEditIssueForm = () => {
    setEditIssueVisibility(false);
  };

  const openEditIssueForm = (issue) => {
    setEditedIssue(issue);
    console.log(issue);
    setEditIssueVisibility(true);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getComparator = (order, orderBy) =>
    order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);

  const descendingComparator = (a, b, orderBy) => {
    if (orderBy === "issue_date") {
      return new Date(b[orderBy]) - new Date(a[orderBy]);
    }
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

  const visibleRows = useMemo(
    () =>
      stableSort(issues, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [issues, order, orderBy, page, rowsPerPage]
  );

  const cellStyle = {
    fontSize: "14px",
    padding: "12px 16px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  const headerStyle = { fontWeight: 600, backgroundColor: "#f5f5f5" };

  return (
    <>
      {editIssueVisibility && (
        <div
          className="absolute bg-overlay z-30 w-screen h-screen top-0 left-0 "
          onClick={closeEditIssueForm}
        >
          {" "}
        </div>
      )}
      {editIssueVisibility && (
        <form
          onSubmit={handleSubmit}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white z-50 p-8 flex flex-col w-fit h-fit gap-2"
        >
          <div className="flex justify-between">
            <h2 className="font-semibold text-lg m-2"> Edit Issue Details</h2>
            <button
              type="button"
              className="discard-btn"
              onClick={closeEditIssueForm}
            >
              <img src={close} alt="" />
            </button>
          </div>
          <div className="flex flex-col gap-3 p-2">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <div className="flex gap-6">
                  <div className="flex flex-col gap-4">
                    <label className="font-medium text-md" htmlFor="issue_date">
                      Issue Date:
                    </label>
                    <NepaliDatePicker
                      inputClassName="form-control focus:outline-none"
                      className="border-2 border-neutral-200 p-2 w-[250px] pl-3 rounded-md  focus:outline-slate-400"
                      value={editedIssue.date}
                      onChange={handleDateChange}
                      options={{ calenderLocale: "en", valueLocale: "en" }}
                      name="issue_date"
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <label className="font-medium text-md"> Issued To: </label>
                    <input
                      className="border-2 rounded border-neutral-200 w-[14vw] px-2 py-2 focus:outline-slate-400"
                      type="text"
                      placeholder="Enter Student Name"
                      autoFocus="autofocus"
                      name="requested_by"
                      id="issued_to"
                      value={editedIssue.requested_by}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex flex-col gap-4">
                    <label className="font-medium text-md">Item Name:</label>
                    <Select
                      options={itemOptions}
                      onChange={(selectedOption) =>
                        setEditedIssue((prevState) => ({
                          ...prevState,
                          issue_name: selectedOption.value,
                        }))
                      }
                      value={itemOptions.find(
                        (option) => option.value === editedIssue.issue_name
                      )}
                      placeholder="Select Item"
                      styles={{
                        ...customStyles,
                        menuPortal: (provided) => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: 150,
                          overflowY: "auto",
                        }),
                      }}
                      menuPortalTarget={document.body}
                      className="w-[190px]"
                      classNamePrefix="react-select"
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="font-medium text-md">Quantity:</label>
                    <input
                      className="border-2 rounded border-neutral-200 px-3 py-2 w-[14vw] focus:outline-slate-400"
                      type="number"
                      placeholder="Enter a quantity"
                      name="quantity"
                      id="quantity"
                      value={editedIssue.quantity}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <label className="font-medium text-md">Purpose:</label>
                <textarea
                  rows={5}
                  className="border-2 border-neutral-200 p-1.5 rounded-md w-[33vw] h-[15vh] focus:outline-slate-400 resize-none"
                  placeholder="Enter your purpose here.."
                  value={editedIssue.purpose}
                  name="purpose"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="checkbox" className="ml-2 text-lg font-medium">
                  Returned
                </label>
                <select
                  name="isReturned"
                  id="isReturned"
                  onChange={handleSelectChange}
                  value={editedIssue.isReturned}
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded"
              >
                Edit Issue
              </button>
            </div>
          </div>
        </form>
      )}

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        <TableContainer sx={{ maxHeight: 510 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      ...headerStyle,
                      ...cellStyle,
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
              {!issues || issues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "350px",
                        width: "100%",
                      }}
                    >
                      <img
                        src={empty}
                        alt="No issues"
                        className="h-80 w-80"
                        style={{ maxWidth: "300px", marginBottom: "20px" }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {visibleRows.map((issue) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={issue.issue_id}
                    >
                      {columns.map((column) => {
                        const value = issue[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={cellStyle}
                          >
                            {column.id === "isReturned" ? (
                              <div
                                style={{
                                  display: "inline-block",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  backgroundColor: value
                                    ? "#d4edda"
                                    : "#f8d7da",
                                  color: value ? "#155724" : "#721c24",
                                  fontWeight: "normal",
                                  textAlign: "center",
                                }}
                              >
                                {value ? "Returned" : "Not Returned"}
                              </div>
                            ) : column.id === "edit" ? (
                              <IconButton
                                color="primary"
                                onClick={() => {
                                  setEditIssueVisibility(true);
                                  setEditedIssue({ ...issue });
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            ) : column.format && value != null ? (
                              column.format(value)
                            ) : (
                              value ?? ""
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[7]}
          component="div"
          count={issues && Array.isArray(issues) ? issues.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            count === 0
              ? "No records"
              : `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      </Paper>
    </>
  );
}
