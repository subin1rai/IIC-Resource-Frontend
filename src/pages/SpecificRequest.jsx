import React from "react";

const SpecificRequest =() =>{
    return (
        <table className="min-w-full table-fixed border-collapse">
      <thead>
        <tr className="bg-neutral-200">
          <th className="p-2 text-center border-b border-neutral-200 font-medium">S.No.</th>
          <th className="p-2 text-center border-b  border-neutral-200 font-medium">Item Name</th>
          <th className="p-2 text-center border-b  border-neutral-200 font-medium">Quantity</th>
          <th className="p-2 text-center border-b  border-neutral-200 font-medium">Unit Price</th>
          <th className="p-2 text-center border-b  border-neutral-200 font-medium">Vat Amount</th>
          <th className="p-2 text-center border-b  border-neutral-200 font-medium">Total Amount</th>
        </tr>
      </thead>
      <tbody>
  {bill.BillItems && bill.BillItems.length > 0 ? (
    bill.BillItems.map((billItem, index) => (
      <tr key={index}>
        <td className="p-2 text-center border-b border-neutral-200">{index + 1}</td>
        <td className="p-2 text-center border-b border-neutral-200">{billItem.item_id}</td>
        <td className="p-2 text-center border-b border-neutral-200">{billItem.quantity}</td>
        <td className="p-2 text-center border-b border-neutral-200">{billItem.unit_price}</td>
        <td className="p-2 text-center border-b border-neutral-200">{billItem.withVATAmount}</td>
        <td className="p-2 text-center border-b border-neutral-200">{billItem.total_Amount}</td>

        {/* <td className="p-2 border-b border-neutral-200">{billItem.TDS_deduct_amount}</td>
        <td className="p-2 border-b border-neutral-200">{billItem.withVATAmount}</td> */}
      </tr>
    ))
  ) : (    
    <tr>
      <td colSpan="6" className="p-2 text-center border-b border-gray-300">
        No bill items available
      </td>
    </tr>
  )}
</tbody>
    </table>

    );
}
export default SpecificRequest;