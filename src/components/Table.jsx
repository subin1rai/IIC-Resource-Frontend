import React, { useEffect, useState } from "react";
import "../styles/table.css";
import filterIcon from "../assets/filter.svg";

const Table = () => {
    const [data, setData] = useState([
        { name: 'Richard Martin', vat: '7687764556', contact: '7687764556', amount: 20000, date: '6/25/2024', duration: '15 days', status: 'Complete' },
        { name: 'Tom Homan', vat: '9867545368', contact: '9867545368', amount: 20000, date: '6/25/2024', duration: '15 days', status: 'Complete' },
        { name: 'Veandir', vat: '9867545566', contact: '9867545566', amount: 20000, date: '6/25/2024', duration: '15 days', status: 'Complete' },
        { name: 'Charin', vat: '9267545457', contact: '9267545457', amount: 20000, date: '6/25/2024', duration: '15 days', status: 'Complete' },
        { name: 'Hoffman', vat: '9367546531', contact: '9367546531', amount: 20000, date: '6/25/2024', duration: '15 days', status: 'Complete' },
        { name: 'Fainden Juke', vat: '9667545982', contact: '9667545982', amount: 20000, date: '6/25/2024', duration: '15 days', status: 'Pending' },
        { name: 'Martin', vat: '9867545457', contact: '9867545457', amount: 20000, date: '6/25/2024', duration: '15 days', status: 'Complete' },
        { name: 'Joe Nike', vat: '9567545769', contact: '9567545769', amount: 20000, date: '6/25/2024', duration: '15 days', status: 'Complete' },
        { name: 'Dender Luke', vat: '9667545980', contact: '9667545980', amount: 20000, date: '6/25/2024', duration: '15 days', status: 'Pending' },
        { name: 'Martin', vat: '9867545457', contact: '9867545457', amount: 20000, date: '6/25/2024', duration: '15 days', status: 'Complete' },
      ]);
    
      // Comment out the data fetching logic
      // useEffect(() => {
      //   const fetchData = async () => {
      //     try {
      //       const response = await fetch('https://your-backend-api.com/vendors');
      //       if (!response.ok) {
      //         throw new Error('Network response was not ok');
      //       }
      //       const result = await response.json();
      //       setData(result);
      //     } catch (error) {
      //       setError(error);
      //     } finally {
      //       setLoading(false);
      //     }
      //   };
    
      //   fetchData();
      // }, []);
    
      return (
        <div className = "up">
          <div className = "top">
            <h3> Vendors </h3>
            <div className ="right">
            <input type="text" placeholder="Search Items..."/>
              <div className="category">
            <button type="button"><img src={filterIcon} alt="" />
            Category </button>
            </div>
            <div className="add">
            <button type="button"> Add Vendor </button>
            </div>
          </div>
          </div>
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>VAT No</th>
                <th>Contact Number</th>
                <th>Purchase Amount</th>
                <th>Recent Purchase</th>
                <th>Payment Duration</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((vendor, index) => (
                <tr key={index}>
                  <td>{vendor.name}</td>
                  <td>{vendor.vat}</td>
                  <td>{vendor.contact}</td>
                  <td>{vendor.amount}</td>
                  <td>{vendor.date}</td>
                  <td>{vendor.duration}</td>
                  <td className={vendor.status === 'Complete' ? 'complete' : 'pending'}>
                    {vendor.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="last">
          <div className="previous">
            <button type="button">Previous </button>
            </div>
            <div className="next">
            <button type="button"> Next </button>
            </div>
        </div>
        </div>
      );
    };
    
    export default Table;