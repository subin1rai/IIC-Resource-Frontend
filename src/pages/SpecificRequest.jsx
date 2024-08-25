import React, { useEffect, useState } from "react";
import front from "../assets/arrow-right.svg";
import close from "../assets/close.svg";
import {Link} from "react-router-dom";

const SpecificRequest =() =>{
  const token = localStorage.getItem("token");

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      borderRadius: "4px",
      borderColor: "#D0D5DD",
      boxShadow: "none",
      minHeight: "43px",
      color: "black",
      "&:hover": {
        borderColor: "#aaa",
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8898/api/approveRequest",
        {
          items: itemFields,
          remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Request accepted successfully");
        setAcceptFormVisibility(false);
        setLoading(false);
        // Update the requests list or perform any necessary actions
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
  
    }
  };

  const openAcceptForm = () => {
    setAcceptFormVisibility(true);
  };

  const closeAcceptForm = () => {
    setAcceptFormVisibility(false);
  };

  const handleItemChange = (index, field, value) => {
    const newFields = [...itemFields];
    newFields[index][field] = value;
    setItemFields(newFields);
  };

  const addItemField = () => {
    if (itemFields.length < itemOptions.length) {
      setItemFields([...itemFields, { item: "", quantity: "" }]);
    }
  };

  const removeItemField = (index) => {
    const newFields = itemFields.filter((_, i) => i !== index);
    setItemFields(newFields);
  };

  useEffect(() => {
    const getRequest = async () => {
      try {
        
        const response = await axios.get("http://localhost:8898/api/request", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data.request);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      getRequest();
    }
  }, [token]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/items", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setItems(response.data);
        
        setItemOptions(
          response.data.map((item) => ({
            value: item.item_name,
            label: item.item_name,
          }))
        );
        
      } catch (error) {
        console.log(error);
      }
    };
    getItems();
  }, [token]);

  useEffect(() => {
    socket.on("newRequest", (data) => {
      toast.success(data.message);
      setRequests((prevRequests) => [...prevRequests, data.requestData]);
    });

    return () => {
      socket.off("newRequest");
    };
  }, []);

    return (
      <div className="bg-white w-[99%] mx-auto h-50 flex flex-col p-5  rounded-md ">
      <div className="flex justify-between items-center ml-2">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Link to="/records" className="text-base">
            Bill Records
          </Link>
          <img src={front} alt="arrow" />
          <h4 className="text-base text-blue-400">
            Request Details
          </h4>
        </div>
        <h2 className="font-semibold text-2xl">
          Request No.
        </h2>
      </div>

      {/* please dont remove this during merge conflict */}
      <div className="flex gap-3">
        <button
          onClick={openAcceptForm}
          className="flex justify-end bg-blue-600 px-6 py-3 h-fit w-fit rounded font-medium text-white mr-5"
        >
          Edit Bill
        </button>

        {role === "superadmin" ? (
          <button
            className="bg-green-500 px-6 rounded text-white font-medium py-3"
            onClick={handleApprove}
          >
            Approve Bill
          </button>
        ) : (
          <></>
        )}
      </div>
      {/* na hatako ma thank you hai  */}
    </div>
    <div className="h-[2px] w-[99%] bg-neutral-300 mx-auto mt-5"></div>
    {!loading ? (
      <div className="flex justify-between w-[75%] pb-3">
        <div className="flex flex-col gap-5 mt-7 pl-9">
          <p className="font-semibold">
            Bill Date:
            <span className="font-normal  pl-4">
              {formatDate(billDetails?.bill?.bill_date) || "--"}
            </span>
          </p>
          {/* <p className="font-semibold">
            Vendor Name:
            <span className=" pl-4">
              {billDetails.vat_no || "--"}
            </span>
          </p>
          <p className="font-semibold">
            Vat No:
            <span className=" pl-4">
              {billDetails.vat_no || "--"}
            </span>
          </p> */}
          <p className="font-semibold">
            Vendor Name:
            <span className=" font-normal pl-4">
              {billDetails?.vendor_name || "--"}
            </span>
          </p>
          <p className="font-semibold">
            Vat/Pan No:
            <span className="font-normal  pl-4">
              {billDetails?.bill?.vendors?.vat_number || "--"}
            </span>
          </p>
          <p className="font-semibold">
            Voucher No:
            <span className="font-normal  pl-4">
              {billDetails?.bill?.invoice_no || "--"}
            </span>
          </p>
          <p className="font-semibold">
            Approved Status:
            <span className="font-normal  pl-4">
              {billDetails?.bill?.isApproved ? (
                <span className="text-green-500">Approved</span>
              ) : (
                <span className="text-yellow-500">Pending</span> || "--"
              )}
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-5 mt-7 pl-9">
          <p className="font-semibold">
            TDS:
            <span className="font-normal  pl-4">
              {billDetails?.TDS || 0}
            </span>
          </p>
          <p className="font-semibold">
            Bill Amount:
            <span className="font-normal  pl-4">
              {billDetails?.bill?.actual_Amount || "--"}
            </span>
          </p>
          <p className="font-semibold">
            Paid Amount:
            <span className="font-normal  pl-4">
              {billDetails?.bill?.paid_amount || 0}
            </span>
          </p>
          <p className="font-semibold">
            Pending Amount
            <span className="font-normal  pl-4">
              {billDetails?.bill?.left_amount || "--"}
            </span>
          </p>
          <p className="font-semibold">
            Payment Status:
            <span className="font-normal  pl-4">
              {billDetails?.bill?.left_amount < 0 ? (
                <span className="text-yellow">Pending</span>
              ) : (
                <span className="text-green-500">Complete </span> || "--"
              )}
            </span>
          </p>
        </div>
      </div>
    ) : (
      <div>Loading...</div>
    )}
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
    {acceptFormVisibility && (
        <form
          onSubmit={handleSubmit}
          className="flex absolute z-30 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 gap-7 rounded w-[730px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-7">
            <div className="flex justify-between p-2">
              <p className="font-semibold text-2xl">Request</p>
              <img
                src={close}
                alt="close"
                className="h-4 w-4 cursor-pointer"
                onClick={closeAcceptForm}
              />
            </div>
            
            <div className="flex gap-3 bg-slate-200 p-4 flex-col rounded-lg">
              <div className="flex text-lg font-semibold text-zinc-600">
                Summary
              </div>
              {requests.map((request) => (
                <div key={request.id} className="flex gap-16 font-medium">
                  <div className="flex flex-col gap-2">
                    <p>
                      Item: <span className="text-neutral-600">{request.item?.item_name}</span>
                    </p>
                    <p>
                      Department: <span className="text-neutral-600">Department</span>
                    </p>
                    <p>
                      Quantity: <span className="text-neutral-600">{request.request_quantity}</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>
                      Requested By: <span className="text-neutral-600">{request.users?.user_name}</span>
                    </p>
                    <p>
                      Requested To: <span className="text-neutral-600">Mr.Nishesh Bishwas</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-5 p-3">
              <div className="flex gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="item" className="font-medium text-md">
                    Item
                  </label>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="quantity"
                    className="font-medium text-md pl-52 ml-1 "
                  >
                    Quantity
                  </label>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div className="flex flex-col gap-6">
                  {itemFields.map((item, index) => (
                    <div key={index} className="flex gap-5 items-center">
                      <Select
                        options={itemOptions}
                        onChange={(selectedOption) =>
                          handleItemChange(index, "item", selectedOption.value)
                        }
                        value={itemOptions.find((option) => option.value === item.item)}
                        placeholder="Select Item"
                        styles={customStyles}
                        className="w-[190px]"
                        classNamePrefix="react-select"
                      />
                      <input
                        className="border-2 rounded border-border px-3 py-2 w-[14vw]"
                        type="number"
                        placeholder="Enter a quantity"
                        name={`quantity-${index}`}
                        id={`quantity-${index}`}
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeItemField(index)}
                          className="flex items-center"
                        >
                          <img src={remove} alt="Remove" className="h-7 w-7" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {itemFields.length < itemOptions.length && (
                  <button
                    type="button"
                    onClick={addItemField}
                    className="flex items-center mb-2"
                  >
                    <img src={add} alt="Add" className="h-7 w-7 ml-3" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 p-2">
              
              <label className=" font-medium text-md" htmlFor="remarks">
                Remarks
              </label>
              <textarea
                name="remarks"
                placeholder="Enter remarks"
                className="border-stone-200 border-2 rounded py-2 px-5 w-[28.2vw] h-32 resize-none"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
           
            <div className="flex justify-end ">
              <button
                type="submit"
                className="flex justify-center bg-blue-600 text-white rounded items-center w-fit p-2 px-6"
                disabled={loading}
              >
                {loading ? "Adding..." : "Confirm"}
              </button>
            </div>
          </div>
        </form>
      )}
      {acceptFormVisibility && (
        <div
          className="w-screen h-screen z-20 bg-overlay cursor-pointer absolute top-0 left-0"
          onClick={closeAcceptForm}
        ></div>
      )}
      <ToastContainer />
    </div>
    );
}
export default SpecificRequest;