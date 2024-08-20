import * as React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const Vat = ({ selectedOption, onDataUpdate }) => {
  const [items, setItems] = useState([]);
  const [rows, setRows] = useState([
    {
      item_name: "",
      quantity: 0,
      unit_price: 0,
      amount: 0,
      tds: 0,
      amtAfterTds: 0,
      vat: 0,
      amountWithVat: 0,
    },
  ]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse] = await Promise.all([
          axios.get("http://localhost:8898/api/items", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setItems(itemsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleSelectChange = (option, index) => {
    const updatedRows = [...rows];
    updatedRows[index].item_name = option.value;
    setRows(updatedRows);
    updateParentData(updatedRows);
  };

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      item_name: "",
      quantity: 0,
      unit_price: 0,
      amount: 0,
      tds: 0,
      amtAfterTds: 0,
      vat: 0,
      amountWithVat: 0,
    };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    updateParentData(updatedRows);
  };

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = parseFloat(value) || 0;

    if (field === "quantity" || field === "unit_price") {
      const quantity = parseFloat(newRows[index].quantity) || 0;
      const unit_price = parseFloat(newRows[index].unit_price) || 0;
      const amount = quantity * unit_price;

      let tds = 0;
      let amtAfterTds = amount;

      if (selectedOption === "vat 1.5") {
        tds = (amount / 1.13) * 0.015;
      } else if (selectedOption === "vat 0") {
        tds = 0;
      }

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
      tds: row.tds,
      amtAfterTds: row.amtAfterTds,
      vat: row.vat,
      amountWithVat: row.amountWithVat,
    }));
    onDataUpdate(newItemsData);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      minHeight: "auto",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0",
    }),
    input: (provided) => ({
      ...provided,
      width: "full",
      margin: "0",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "0",
    }),
  };

  return (
    <>
      <div className="container mx-auto overflow-auto max-h-[40vh]">
        <table className=" w-fit border-collapse border border-neutral-500  ">
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
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium">
                TDS
              </th>
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium whitespace-nowrap">
                Amount after TDS
              </th>
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium whitespace-nowrap">
                VAT amount
              </th>
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium whitespace-nowrap">
                Amount with VAT
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className="border border-neutral-500 px-4 py-2 text-center">
                  {row.id}
                </td>
                <td className="border border-neutral-500 px-4 py-2">
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
                    className="w-[150px] whitespace-nowrap"
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
                <td className="border border-neutral-500  px-4 py-2 text-center">
                  {row.amount.toFixed(2)}
                </td>
                <td className="border border-neutral-500  px-4 py-2 text-center">
                  {row.tds.toFixed(2)}
                </td>
                <td className="border border-neutral-500  px-4 py-2 text-center">
                  {row.amtAfterTds ? row.amtAfterTds.toFixed(2) : "0.00"}
                </td>
                <td className="border border-neutral-500  px-4 py-2 text-center">
                  {row.vat ? row.vat.toFixed(2) : "0.00"}
                </td>
                <td className="border border-neutral-500 px-4 py-2 text-center">
                  {row.amountWithVat ? row.amountWithVat.toFixed(2) : "0.00"}
                </td>
              </tr>
            ))}

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
              <td className="border border-neutral-500  px-4 py-2 text-center">
                {rows.reduce((sum, row) => sum + (row.tds || 0), 0).toFixed(2)}
              </td>
              <td className="border border-neutral-500  px-4 py-2 text-center">
                {rows
                  .reduce((sum, row) => sum + (row.amtAfterTds || 0), 0)
                  .toFixed(2)}
              </td>
              <td className="border border-neutral-500  px-4 py-2 text-center">
                {rows.reduce((sum, row) => sum + (row.vat || 0), 0).toFixed(2)}
              </td>
              <td className="border border-neutral-500  px-4 py-2 text-center">
                {rows
                  .reduce((sum, row) => sum + (row.amountWithVat || 0), 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-2">
          <span onClick={addRow} className="text-blue-600 hover:underline">
            Add more fields
          </span>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="self-end bg-blue-600 text-white h-fit py-3 px-8 rounded-md"
            onClick={() => console.log(itemsData)}
          >
            Add Bill
          </button>
        </div>
      </div>
    </>
  );
};

export default Vat;