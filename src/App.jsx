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
import Payment from "./pages/Payment";
import SpecificVendor from "./pages/SpecificVendor";
import SpecificBill from "./pages/SpecificBill";
import UserHome from "./pages/UserHome";
import UserRequest from "./pages/UserRequest";
import AboutUs from "./pages/Aboutus";
import UserProfile from "./pages/UserProfile";
import UserPassword from "./pages/UserPassword";
import Reset from "./pages/Reset";
import Otp from './pages/Otp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ForgotPassword from "./pages/ForgotPassword";
import Request from "./pages/Request";
import Settings from "./pages/Settings";

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
          <Route
            path="/specificVendor/:vendor_id"
            element={<SpecificVendor />}
          />
          <Route path="/category" element={<Category />} />
          <Route path="/specificbill/:bill_id" element={<SpecificBill />} />
          <Route path="/userhome" element={<UserHome />} />
          <Route path="/userrequest" element={<UserRequest />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/userPassword" element ={<UserPassword />} />
          <Route path="/reset" element ={<Reset />} />
          <Route path= "/otp" element={<Otp />} />
          <Route path="/request" element ={<Request />} />
          <Route path="/payment" element ={<Payment />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
