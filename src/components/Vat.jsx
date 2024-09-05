import * as React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useSelector } from "react-redux";

const Vat = ({ selectedOption, onDataUpdate, billDetails }) => {
  const [items, setItems] = useState([]);
  const [rows, setRows] = useState([]);
  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get(
          "http://localhost:8898/api/items",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setItems(itemsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const calculateRowValues = (row, selectedOption) => {
    const quantity = parseFloat(row.quantity) || 0;
    const unit_price = parseFloat(row.unit_price) || 0;
    const amount = quantity * unit_price;

    let tds = 0;
    if (selectedOption === "vat 1.5") {
      tds = amount * 0.015;
    } else if (selectedOption === "vat 0") {
      tds = 0;
    }

    const vat = amount * 0.13;
    const amountWithVat = amount + vat;
    const actualAmt = amountWithVat - tds;

    return {
      ...row,
      amount,
      tds,
      vat,
      amountWithVat,
      actualAmt,
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
          tds: item.tds || 0,
          vat: item.vat || 0,
          amountWithVat: item.amountWithVat || 0,
          actualAmt: item.actualAmt || 0,
        };
        return calculateRowValues(initialRow, selectedOption);
      });

      if (JSON.stringify(existingItems) !== JSON.stringify(rows)) {
        setRows(existingItems);
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
          tds: 0,
          vat: 0,
          amountWithVat: 0,
          actualAmt: 0,
        },
        selectedOption
      );
      setRows([initialRow]);
      updateParentData([initialRow]);
    }
  }, [billDetails, selectedOption]);

  const handleSelectChange = (option, index) => {
    const updatedRows = [...rows];
    updatedRows[index].item_id = option.value;
    updatedRows[index].item_name = option.label;
    setRows(updatedRows);
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
        tds: 0,
        vat: 0,
        amountWithVat: 0,
        actualAmt: 0,
      },
      selectedOption
    );
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    updateParentData(updatedRows);
  };

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = parseFloat(value) || 0;

    if (field === "quantity" || field === "unit_price") {
      newRows[index] = calculateRowValues(newRows[index], selectedOption);
    }

    setRows(newRows);
    updateParentData(newRows);
  };

  const updateParentData = (updatedRows) => {
    const newItemsData = updatedRows
      .filter((row) => row.item_id && row.quantity > 0)
      .map((row) => ({
        item_id: row.item_id,
        item_name: row.item_name,
        quantity: row.quantity,
        unit_price: row.unit_price,
        amount: row.amount,
        tds: row.tds,
        vat: row.vat,
        amountWithVat: row.amountWithVat,
        actualAmt: row.actualAmt,
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
      <div className="container mx-auto overflow-auto">
        <table className="w-fit border-collapse border border-neutral-500">
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
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium">
                VAT amount
              </th>
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium">
                Amount with VAT
              </th>
              <th className="border border-neutral-500 px-4 py-2 font-medium text-medium">
                Actual Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className="border border-neutral-500 px-4 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-neutral-500 px-4 py-2">
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
                        overflowY: "auto", // This ensures only the menu list scrolls
                      }),
                    }}
                    menuPortalTarget={document.body}
                    className="w-[170px] whitespace-nowrap"
                  />
                </td>
                <td className="border border-neutral-500 px-4 py-2">
                  <input
                    value={row.quantity}
                    onChange={(e) =>
                      updateRow(index, "quantity", e.target.value)
                    }
                    placeholder="Quantity"
                    className="w-full text-center"
                  />
                </td>
                <td className="border border-neutral-500 px-4 py-2">
                  <input
                    value={row.unit_price}
                    onChange={(e) =>
                      updateRow(index, "unit_price", e.target.value)
                    }
                    placeholder="Unit Price"
                    className="w-full text-center"
                  />
                </td>
                <td className="border border-neutral-500 px-4 py-2 text-center">
                  {row.amount.toFixed(2)}
                </td>
                <td className="border border-neutral-500 px-4 py-2 text-center">
                  {row.tds.toFixed(2)}
                </td>
                <td className="border border-neutral-500 px-4 py-2 text-center">
                  {row.vat.toFixed(2)}
                </td>
                <td className="border border-neutral-500 px-4 py-2 text-center">
                  {row.amountWithVat.toFixed(2)}
                </td>
                <td className="border border-neutral-500 px-4 py-2 text-center">
                  {row.actualAmt.toFixed(2)}
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
              <td className="border border-neutral-500  px-4 py-2 text-center">
                {rows.reduce((sum, row) => sum + (row.tds || 0), 0).toFixed(2)}
              </td>{" "}
              <td className="border border-neutral-500  px-4 py-2 text-center">
                {rows.reduce((sum, row) => sum + (row.vat || 0), 0).toFixed(2)}
              </td>
              <td className="border border-neutral-500  px-4 py-2 text-center">
                {rows
                  .reduce((sum, row) => sum + (row.amountWithVat || 0), 0)
                  .toFixed(2)}
              </td>
              <td className="border border-neutral-500  px-4 py-2 text-center">
                {rows
                  .reduce((sum, row) => sum + (row.actualAmt || 0), 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-2">
        <span
          onClick={addRow}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Add more fields
        </span>
      </div>
    </>
  );
};

export default Vat;
