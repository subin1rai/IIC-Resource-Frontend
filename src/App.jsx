import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Issue from "./pages/Issue";
import Category from "./pages/Category";
import Vendor from "./pages/Vendor";
import Records from "./pages/Records";
import SpecificVendor from "./pages/SpecificVendor";
import SpecificVendorDetails from "./components/SpecificVendorDetails";
import SpecificBill from "./pages/SpecificBill";
import Navbar from "./components/Navbar";
import UserHome from "./pages/UserHome";
import UserRequest from "./pages/UserRequest";
import RequestHistory from "./pages/RequestHistory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ForgotPassword from "./pages/ForgotPassword";
import Request from "./pages/Request";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/issue" element={<Issue />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/vendors" element={<Vendor />} />
          <Route path="/records" element={<Records />} />
          <Route path="/specificVendor" element={<SpecificVendor />} />
          <Route path="/details" element={<SpecificVendorDetails />} />
          <Route path="/category" element={<Category />} />
          <Route path="/specificbill" element={<SpecificBill />} />



          <Route path = "/userhome" element={<UserHome />} />
          <Route path = "/navbar" component = {<Navbar />} />
          <Route path = "/userrequest" element = {<UserRequest />} />
          <Route path = "/requesthistory" element = {<RequestHistory/> } />
          {/* <Route path = "/home" element= {<Home />} />
          <Route path = "/request" component={<Request />} />
          <Route path = "/requesthistory" component={<RequestHistory />} /> */}
          </Routes>

      </BrowserRouter>
    </div>
  );
}
export default App;
