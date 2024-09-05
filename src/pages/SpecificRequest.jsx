import React, { useEffect, useState } from "react";
import front from "../assets/arrow-right.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useParams } from "react-router-dom";
import Select from "react-select";
import close from "../assets/close.svg";
import add from "../assets/addIcon.svg";
import remove from "../assets/removeIcon.svg";
import axios from "axios";
import Swal from "sweetalert2";
import Chat from "../components/Chat";
import { useSelector } from "react-redux";

const SpecificRequest = () => {
  const [request, setRequest] = useState({
    userId: "",
    for_userId: "",
    request_date: "",
    department_name: "",
    status: "",
    purpose: "",
    items: [],
  });

  const [acceptRequest, setAcceptRequest] = useState({
    userId: "",
    for_userId: "",
    request_date: "",
    department_name: "",
    status: "",
    purpose: "",
    remarks: "",
    items: [],
  });

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [requestDetails, setRequestDetails] = useState({});
  const [declineFormVisibility, setDeclineFormVisibility] = useState(false);
  const [items, setItems] = useState([]);
  const [itemFields, setItemFields] = useState([{ item_id: "", quantity: "" }]);
  const [itemOptions, setItemOptions] = useState([]);
  const [remarks, setRemarks] = useState();
  const [acceptFormVisibility, setAcceptFormVisibility] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo.token;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };


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

  const [finalData, setFinalData] = useState({
    replaceItems: itemFields,
    remarks: "",
  });



  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:8898/api/approveRequest/${id}`,
        {
          replaceItems: itemFields,
          remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequest({ ...request, ...acceptRequest });
      if (response.status === 200) {
        if (response.data.message === "Item changed") {
          toast.success("Request approved with item changes");
        } else {
          toast.success("Request approved successfully");
        }
        setRequestDetails((prevDetails) => ({
          ...prevDetails,
          request: {
            ...prevDetails.request,
            isApproved: true,
            status: "Holding",
            requestItems: itemFields,
          },
        }));
      } else {
        console.error("error status 200")
      }
    } catch (error) {
      console.error("Error approving request:", error);
    } finally {
      setLoading(false);
      setAcceptFormVisibility(false);
    }
  };

  const openAcceptForm = () => {
    setAcceptFormVisibility(true);

    setAcceptRequest({
      ...acceptRequest,
      items:
        requestDetails?.request?.requestItems.map((item) => ({
          item: item.item_id,
          quantity: item.quantity,
        })) || [],
    });

    setItemFields(
      requestDetails?.request?.requestItems.map((item) => ({
        id: item.id,
        item_id: item.item_id,
        quantity: item.quantity,
      })) || [{ id: "", quantity: "", item_id: "" }]
    );

    setRemarks(requestDetails?.request?.remarks || "");
  };

  const openDeclineForm = () => {
    setDeclineFormVisibility(true);
  }

  const closeDeclineForm = () => {
    setDeclineFormVisibility(false);
  }


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
      setItemFields([...itemFields, { item_name: "", quantity: "" }]);
    }
  };

  const handleChange = (e) => {
    setFinalData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const removeItemField = (index) => {
    if (itemFields.length > 1) {
      const newFields = itemFields.filter((_, i) => i !== index);
      setItemFields(newFields);
    }
  };

  const handleDecline = (id) => {
    console.log(`Declined request with ID: ${id}`);
  };

  const isHolding = requestDetails?.request?.status === "Holding";
  const isDelivered = requestDetails?.request?.status === "Delivered";

  useEffect(() => {
    const fetchSingleRequest = async () => {
      setLoading(true);
      try {
        const [singleRequestResponse, itemsResponse] = await Promise.all([
          axios.get(`http://localhost:8898/api/singleRequest/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:8898/api/items", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setRequestDetails(singleRequestResponse.data);
        setItemFields(singleRequestResponse.data.request.requestItems);

        setItemOptions(
          (itemsResponse.data || []).map((item) => {
            const features = Object.entries(item.itemsOnFeatures || {})
              .filter(([key, value]) => value)
              .map(([key, value]) => ` - ${value}`)
              .join("");

            const label = `${item.item_name}${features}`;

            return {
              value: item.item_id,
              label: label,
            };
          })
        );

        setItems(itemsResponse.data);
      } catch (error) {
        console.log("Error fetching Request:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleRequest();
  }, [id, token]);

  // showing dialog box
  const handleShowModal = (id) => {
    Swal.fire({
      title: "Is the request delivered?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, do it",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelivered(id);
        Swal.fire("Delivered!", "This request has been delivered.", "success");
      }
    });
  };

  const handleDelivered = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8898/api/deliverRequest/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequestDetails((prevDetails) => ({
        ...prevDetails,
        request: {
          ...prevDetails.request,
          isApproved: true,
          status: "Delivered",
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-between bg-background relative">
      <Sidebar />
      <div className="flex flex-col gap-4 mx-auto items-center">
        <Topbar />
        <div className="bg-white w-[99%] mx-auto h-50 flex flex-col p-5 rounded-md ">
          <div className="flex flex-col gap-6 w-full ml-3">
            <div className="flex items-center gap-2">
              <Link to="/Request" className="text-base">
                Request Details
              </Link>
              <img src={front} alt="arrow" />
              <h4 className="text-base text-blue-400">
                {requestDetails?.request?.request_id}
              </h4>
            </div>

            <div className=" flex w-full justify-between">
              <h2 className="font-semibold text-2xl">
                Request No. {requestDetails?.request?.request_id}
              </h2>
              <div className="flex mr-7 ">
                {!isHolding && !isDelivered ? (
                  <>
                    <button
                      onClick={openAcceptForm}
                      className={`flex justify-end px-5 py-2 h-fit w-fit rounded font-medium mr-5 ${
                        isHolding
                          ? "bg-gray text-black "
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 px-5 rounded text-white font-medium py-2"
                      // onClick={() => handleDecline(requestDetails?.request?.id)}
                      onClick={openDeclineForm}
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <>
                    {!isDelivered ? (
                      <>
                        {" "}
                        <button
                          className="bg-green-500 px-4 py-2 rounded text-white"
                          onClick={() => handleShowModal(id)}
                        >
                          Delivered
                        </button>{" "}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="h-1 bg-blue-700 w-[82vw] mt-5 mx-auto"></div>
          {loading ? (
            <div>Loading...</div>
          ) : requestDetails?.request ? (
            <div className="flex justify-between w-[75%] pb-3">
              <div className="flex flex-col gap-5 mt-7 pl-9">
                <p className="font-semibold">
                  Requested by:
                  <span className="font-medium pl-4 text-[#6D6E70]">
                    {requestDetails?.request?.user_name || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Requested For:
                  <span className="font-medium pl-4 text-[#6D6E70]">
                    {requestDetails?.request?.requested_for || "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Department:
                  <span className="font-medium pl-4 text-[#6D6E70]">
                    {requestDetails?.request?.department_name || "--"}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-5 mt-7 pl-9">
                <p className="font-semibold">
                  Requested Date:
                  <span className="font-medium pl-4 text-[#6D6E70]">
                    {requestDetails?.request?.request_date
                      ? formatDate(requestDetails?.request?.request_date)
                      : "--"}
                  </span>
                </p>
                <p className="font-semibold">
                  Status:
                  <span className="font-medium pl-4 text-[#6D6E70]">
                    {requestDetails?.request?.status}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div>No request data available</div>
          )}
          <div className="flex font-semibold text-2xl py-5 px-2">Items</div>
          <div className="h-[2px] w-[99%] bg-neutral-300 mx-auto mb-5"></div>

          <table className="min-w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-neutral-200">
                <th className="p-2 text-center border-b border-neutral-200 font-medium">
                  S.No.
                </th>
                <th className="p-2 text-center border-b border-neutral-200 font-medium">
                  Item Name
                </th>
                <th className="p-2 text-center border-b border-neutral-200 font-medium">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {requestDetails &&
              requestDetails?.request?.requestItems &&
              requestDetails?.request?.requestItems.length > 0 ? (
                requestDetails?.request?.requestItems.map(
                  (requestItem, index) => (
                    <tr key={index}>
                      <td className="p-2 text-center border-b border-neutral-200">
                        {index + 1}
                      </td>
                      <td className="p-2 text-center border-b border-neutral-200">
                        {
                          (
                            itemOptions.find(
                              (item) => item.value === requestItem.item_id
                            ) || { label: "Not found" }
                          ).label
                        }
                      </td>
                      <td className="p-2 text-center border-b border-neutral-200">
                        {requestItem.quantity}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="p-2 text-center border-b border-gray-300"
                  >
                    No Request items available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {!loading && declineFormVisibility && (
        <>
        <div className="h-screen w-screen bg-overlay absolute top-0 right-0 "></div>
          <form
            onSubmit={handleDecline}
            className="flex absolute z-30 bg-white flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 rounded "
          >
             <div className="flex flex-col gap-4">
                <p className="font-semibold flex justify-between items-center text-xl ">Send Remarks
                <img
              className="cursor-pointer h-4 w-4 "
              src={close}
              alt="close button"
              onClick={closeDeclineForm}
            />
            </p>
                <div className="flex flex-col"></div>

                <div className="flex gap-3">
                <label className="font-medium text-md">Remarks:</label>
                <textarea
                  rows={5}
                  cols={40}
                  name="remarks"
                  placeholder="Enter your remarks here..."
                  className="border-stone-200 border-2 rounded py-2 px-4 w-[100%] focus:outline-slate-400 resize-none "
                  value={requestDetails?.request?.remarks}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end">
                <button className="self-end bg-blue-600 text-white h-fit py-3 px-8 rounded-md">
                  Done
                </button>
              </div>

                </div>
          </form>
        </>
      )}
          {!loading && acceptFormVisibility && (
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
                  <div className="flex gap-16 font-medium">
                    <div className="flex flex-col gap-2">
                      <p>
                        Requested By:{" "}
                        <span className="text-neutral-600">
                          {requestDetails?.request?.user_name}
                        </span>
                      </p>
                      <p>
                        Requested For:{" "}
                        <span className="text-neutral-600">
                          {requestDetails?.request?.requested_for}
                        </span>
                      </p>
                      <p>
                        Request Date:{" "}
                        <span className="text-neutral-600">
                          {requestDetails?.request?.request_date
                            ? new Date(
                                requestDetails?.request?.request_date
                              ).toLocaleDateString()
                            : "--"}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p>
                        Department:{" "}
                        <span className="text-neutral-600">
                          {requestDetails?.request?.department_name}
                        </span>
                      </p>
                      <p>
                        Purpose:{" "}
                        <span className="text-neutral-600">
                          {requestDetails?.request?.purpose}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex p-3 gap-3">
                    <div className="flex font-medium text-md w-64">
                      <label>Item Name:</label>
                    </div>
                    <div className="flex font-medium text-md w-64">
                      <label>Quantity:</label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    {itemFields.map((field, index) => (
                      <div key={index} className="flex gap-5 ml-2 items-center">
                        <Select
                          options={itemOptions}
                          onChange={(selectedOption) =>
                            handleItemChange(
                              index,
                              "item_id",
                              selectedOption.value
                            )
                          }
                          value={itemOptions.find(
                            (option) => option.value === field.item_id
                          )}
                          placeholder="Select Item"
                          styles={customStyles}
                          className="w-[190px]"
                          classNamePrefix="react-select"
                        />
                        <input
                          className="border-2 rounded border-border px-3 py-2 w-[14vw] focus:outline-slate-400"
                          type="number"
                          placeholder="Enter a quantity"
                          name={`quantity-${index}`}
                          id={`quantity-${index}`}
                          value={field.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                        />
                        {itemFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemField(index)}
                            className="flex items-center"
                          >
                            <img
                              src={remove}
                              alt="Remove"
                              className="h-7 w-7"
                            />
                          </button>
                        )}
                        {index === itemFields.length - 1 && (
                          <button
                            type="button"
                            onClick={addItemField}
                            className="flex items-center"
                          >
                            <img src={add} alt="Add" className="h-7 w-7" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3 p-2">
                  <label className=" font-medium text-md" htmlFor="remarks">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    placeholder="Enter remarks"
                    className="border-stone-200 border-2 rounded py-2 px-5 w-[33vw] h-32 resize-none focus:outline-slate-400"
                    onChange={handleChange}
                  />
                </div>

                <div className="flex justify-end ">
                  <button
                    type="submit"
                    className="flex justify-center bg-blue-600 text-white rounded items-center w-fit p-2 px-6"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Confirm"}
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
      </div>
      <div className="absolute right-12 bottom-12 z-50">
        <Chat />
      </div>
    </div>
  );
};

export default SpecificRequest;
