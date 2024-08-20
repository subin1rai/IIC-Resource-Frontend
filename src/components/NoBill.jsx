import * as React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const NoBill = ({ onDataUpdate }) => {
  const [items, setItems] = useState([]);
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
          //   headers: { Authorization: `Bearer ${token}` },
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


  const [rows, setRows] = useState([
    { id: 1, item_name: '', quantity: 0, unitPrice: 0, amount: 0, tds: 0, amtAfterTds: 0, vat: 0, amountWithVat: 0 },
    // Add more rows as needed
  ]);
  // Handle change in the select dropdown for item names
  const handleSelectChange = (option, index) => {
    const updatedRows = [...rows];
    updatedRows[index].item_name = option.value;
    setRows(updatedRows);
  };

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      itemName: "",
      quantity: 0,
      unitPrice: 0,
      amount: 0,
      tds: 0,
      tdsDeductedAmt: 0,
      vat: 0,
      amountWithVat: 0
    };
    setRows([...rows, newRow]);
  };

  // Function to update row data
  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = parseFloat(value) || 0;

    if (field === "quantity" || field === "unitPrice") {
      const quantity = parseFloat(newRows[index].quantity) || 0;
      const unitPrice = parseFloat(newRows[index].unitPrice) || 0;
      const amount = quantity * unitPrice;

      const tds = (amount / 1.13) * 0.015;
      const amtAfterTds = amount - tds;

      const vat = amtAfterTds * 0.13; // Assuming VAT is 13%
      const amountWithVat = amtAfterTds + vat;

      newRows[index].amount = amount || 0;
      newRows[index].tds = tds || 0;
      newRows[index].amtAfterTds = amtAfterTds || 0;
      newRows[index].vat = vat || 0;
      newRows[index].amountWithVat = amountWithVat || 0;
    }

    setRows(newRows);
    updateParentData(newRows);
  };

  const updateParentData = (updatedRows) => {
    const newItemsData = updatedRows.map((row) => ({
      item_name: row.item_name,
      quantity: row.quantity,
      unit_price: row.unit_price,
      amount: row.amount,
    }));
    onDataUpdate(newItemsData);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: 'none',               // Remove the border
      boxShadow: 'none',            // Remove the shadow
      backgroundColor: 'transparent', // Match the table row background
      cursor: 'pointer',            // Optional: change cursor to pointer
      minHeight: 'auto',            // Adjust height to fit the row
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0',                 // Remove padding for a seamless look
    }),
    input: (provided) => ({
      ...provided,
      width: "full",
      margin: '0',                 // Adjust margin to fit neatly

    }),
    indicatorSeparator: () => ({
      display: 'none',              // Remove the separator line
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '0',                 // Adjust dropdown indicator padding
    }),
  };

  return (
    <>
      <div className="container mx-auto overflow-auto max-h-[40vh]">
        <table className=" w-fit border-collapse border border-neutral-500">
          <thead>
            <tr className="bg-blue-200">
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium">SN</th>
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium whitespace-nowrap">Item Name</th>
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium">Quantity</th>
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium whitespace-nowrap">Unit Price</th>
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className="border border-neutral-500 px-4 py-2 text-center">{row.id}</td>
                <td className="border border-neutral-500 px-4 py-2 w-64">
                  <Select
                    options={items.map((item) => ({
                      value: item.item_name,
                      label: item.item_name,
                    }))}
                    onChange={(option) => handleSelectChange(option, index)}
                    value={
                      row.item_name
                        ? { value: row.item_name, label: row.item_name }
                        : null
                    }
                    placeholder="Select Item"
                    styles={customStyles}
                    className="w-[250px] whitespace-nowrap"
                  />

                </td>
                <td className="border border-neutral-500  px-4 py-2 text-center">
                  <input

                    value={row.quantity} 
                    onChange={(e) => updateRow(index, "quantity", e.target.value)}
                    className="w-full p-1 border-none shadow-none bg-transparent focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-neutral-500 px-4 py-2 text-center">
                  <input

                    value={row.unitPrice}
                    onChange={(e) => updateRow(index, "unitPrice", e.target.value)}
                    className="w-full p-1 border-none shadow-none bg-transparent focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-neutral-500  px-4 py-2 text-center w-[22%]">
                  {row.amount.toFixed(2)}
                </td>

              </tr>
            ))}

            <tr className="bg-white">
              <td colSpan="4" className="border border-neutral-500 px-4 py-2 text-right">Total</td>
              <td className="border border-neutral-500  px-4 py-2 text-center">
                {rows.reduce((sum, row) => sum + (row.amount || 0), 0).toFixed(2)}
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
        <div className="flex justify-end mt-4">
          <button className="self-end bg-blue-600 text-white h-fit py-3 px-8 rounded-md">
            Add Bill
          </button>
        </div>
      </div>
    </>
  )
}
export default NoBill;