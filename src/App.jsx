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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ForgotPassword from "./pages/ForgotPassword";

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
          <Route path="/records" element={<Records/>} />
          <Route path= "/specificVendor" element={<SpecificVendor/>} />
          <Route path="/category" element={<Category/>} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
