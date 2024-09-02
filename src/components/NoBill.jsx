import * as React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const NoBill = ({ onDataUpdate, selectedOption, billDetails }) => {
  const [items, setItems] = useState([]);
  // const [noBillItems, setNoBillItems] = useState(initialData || []);
  // const [vendors, setVendors] = useState([]);

  // Retrieve token from localStorage
  const token = localStorage.getItem("token");

  // Fetch data (items) on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, vendorsResponse] = await Promise.all([
          axios.get("http://localhost:8898/api/items", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // axios.get("http://localhost:8898/api/vendor", {
          //   headers: { Authorization: `Bearer ${token}` }, b
          // }),
        ]);
        // Update items state with the fetched data
        setItems(itemsResponse.data);
        // setVendors(vendorsResponse.data.vendor);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const [rows, setRows] = useState([]);
  
  const handleSelectChange = (option, index) => {
    const updatedRows = [...rows];
    updatedRows[index].item_id = option.value;
    updatedRows[index].item_name = option.label;
    setRows(updatedRows);
    console.log("Updated rows after item selection:", updatedRows);
    updateParentData(updatedRows);
  };

  const addRow = () => {
    const newRow = calculateRowValues(
      {
        id: rows.length + 1,
        item_id: null,
        item_name: "",
        quantity: 0,
        unit_price: 0,
        amount: 0,
      },
      selectedOption
    );
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    console.log("Added new row:", updatedRows);
    updateParentData(updatedRows);
  };

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = parseFloat(value) || 0;

    if (field === "quantity" || field === "unit_price") {
      newRows[index] = calculateRowValues(newRows[index], selectedOption);
    }

    setRows(newRows);
    console.log("Updated row:", newRows);
    updateParentData(newRows);
  };

  
  const calculateRowValues = (row, selectedOption) => {
    const quantity = parseFloat(row.quantity) || 0;
    const unit_price = parseFloat(row.unit_price) || 0;
    const amount = quantity * unit_price;

    return {
      ...row,
      amount,
    };
  };

  useEffect(() => {
    console.log("billDetails:", billDetails);
    if (billDetails && billDetails.bill && billDetails.bill.BillItems) {
      const existingItems = billDetails.bill.BillItems.map((item, index) => {
        const initialRow = {
          id: index + 1,
          item_id: item.item_id || null,
          item_name: item.item?.item_name || "",
          quantity: item.quantity || 0,
          unit_price: item.unit_price || 0,
          amount: item.amount || 0,
        };
        return calculateRowValues(initialRow, selectedOption);
      });

      if (JSON.stringify(existingItems) !== JSON.stringify(rows)) {
        setRows(existingItems);
        console.log("Initialized rows with existing items:", existingItems);
        updateParentData(existingItems);
      }
    } else if (rows.length === 0) {
      const initialRow = calculateRowValues(
        {
          id: 1,
          item_id: null,
          item_name: "",
          quantity: 0,
          unit_price: 0,
          amount: 0,
        },
        selectedOption
      );
      setRows([initialRow]);
      console.log("Initialized rows with default item:", [initialRow]);
      updateParentData([initialRow]);
    }
  }, [billDetails, selectedOption]);

  const updateParentData = (updatedRows) => {
    const newItemsData = updatedRows
      .filter((row) => row.item_id && row.quantity > 0)
      .map((row) => ({
        item_id: row.item_id,
        item_name: row.item_name,
        quantity: row.quantity,
        unit_price: row.unit_price,
        amount: row.amount,
      }));

    console.log("Sending to parent:", newItemsData);
    onDataUpdate(newItemsData);
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "none", // Remove the border
      boxShadow: "none", // Remove the shadow
      backgroundColor: "transparent", // Match the table row background
      cursor: "pointer", // Optional: change cursor to pointer
      minHeight: "auto", // Adjust height to fit the row
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0", // Remove padding for a seamless look
    }),
    input: (provided) => ({
      ...provided,
      width: "full",
      margin: "0", // Adjust margin to fit neatly
    }),
    indicatorSeparator: () => ({
      display: "none", // Remove the separator line
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "0", // Adjust dropdown indicator padding
    }),
  };

  return (
    <>
      <div className="container mx-auto overflow-auto max-h-[40vh]">
        <table className=" w-fit border-collapse border border-neutral-500">
          <thead>
            <tr className="bg-blue-200">
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium">
                SN
              </th>
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium whitespace-nowrap">
                Item Name
              </th>
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium">
                Quantity
              </th>
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium whitespace-nowrap">
                Unit Price
              </th>
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className="border border-neutral-500 px-4 py-2 text-center">
                  {row.id}
                </td>
                <td className="border border-neutral-500 px-4 py-2 w-64">
                  <Select
                    options={items.map((item) => {
                      const features = Object.entries(
                        item.itemsOnFeatures || {}
                      )
                        .filter(([key, value]) => value)
                        .map(([key, value]) => ` - ${value}`)
                        .join("");

                      const label = `${item.item_name}${features}`;

                      return {
                        value: item.item_id,
                        label: label,
                      };
                    })}
                    onChange={(option) => handleSelectChange(option, index)}
                    value={
                      row.item_id
                        ? {
                            value: row.item_id,
                            label: row.item_name,
                          }
                        : null
                    }
                    placeholder="Select Item"
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: 150, // Adjust this as needed
                        overflowY: 'auto', // This ensures only the menu list scrolls
                      }),
                    }}
                    menuPortalTarget={document.body}
                    className="w-[170px] whitespace-nowrap"
                  />
                </td>
                <td className="border border-neutral-500  px-4 py-2 text-center">
                  <input
                    value={row.quantity}
                    onChange={(e) =>
                      updateRow(index, "quantity", e.target.value)
                    }
                    className="w-full p-1 border-none shadow-none bg-transparent focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-neutral-500 px-4 py-2 text-center">
                  <input
                    value={row.unit_price}
                    onChange={(e) =>
                      updateRow(index, "unit_price", e.target.value)
                    }
                    className="w-full p-1 border-none shadow-none bg-transparent focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-neutral-500  px-4 py-2 text-center w-[22%]">
                  {row.amount.toFixed(2)}
                </td>
              </tr>
            ))}{" "}
            <tr className="bg-white">
              <td
                colSpan="4"
                className="border border-neutral-500 px-4 py-2 text-right"
              >
                Total
              </td>
              <td className="border border-neutral-500  px-4 py-2 text-center">
                {rows
                  .reduce((sum, row) => sum + (row.amount || 0), 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-2">
          <span
            onClick={addRow}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Add more fields
          </span>
        </div>
      </div>
    </>
  );
};
export default NoBill;
