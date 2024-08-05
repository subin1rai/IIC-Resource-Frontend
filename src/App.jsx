import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Reset from "./pages/Reset";
import Otp from "./pages/Otp";
import ForgotPassword from "./pages/ForgotPassword";
import Request from "./pages/Request";
import Settings from "./pages/Settings";
import SettingRole from "./pages/SettingRole";

import Notify from "./pages/Notify";
import SingleItem from "./pages/SingleItem";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Chat from "./components/Chat";

function App() {
  const userType = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          {/* Public routes */}

          <Route path="/" element={<Login />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/otp" element={<Otp />} />

          <Route path="/chat" element={<Chat />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
            {userType === "admin" ? (
              <>
              
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/issue" element={<Issue />} />
                <Route path="/category" element={<Category />} />
                <Route path="/vendors" element={<Vendor />} />
                <Route path="/records" element={<Records />} />
                <Route path="/payment" element={<Payment />} />
                <Route
                  path="/specificVendor/:vendor_id"
                  element={<SpecificVendor />}
                />
                <Route path="/request" element={<Request />} />
                <Route
                  path="/specificbill/:bill_id"
                  element={<SpecificBill />}
                />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settingRole" element={<SettingRole />} />
             
                <Route path="/notify" element={<Notify />} />
                <Route path="/specificItem/:id" element={<SingleItem />} />

                {/* Redirect admin to dashboard if they try to access user routes */}
                <Route
                  path="/userhome"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="/userProfile"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="/userPassword"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="/userRequest"
                  element={<Navigate to="/dashboard" replace />}
                />
              </>
            ) : (
              <>
                <Route path="/userhome" element={<UserHome />} />

                <Route path="/userRequest" element={<UserRequest />} />
                {/* Redirect non-admin users to userhome if they try to access admin routes */}
                <Route
                  path="/dashboard"
                  element={<Navigate to="/userhome" replace />}
                />
                <Route
                  path="/inventory"
                  element={<Navigate to="/userhome" replace />}
                />
                <Route
                  path="/issue"
                  element={<Navigate to="/userhome" replace />}
                />
                <Route
                  path="/category"
                  element={<Navigate to="/userhome" replace />}
                />
                <Route
                  path="/vendors"
                  element={<Navigate to="/userhome" replace />}
                />
                <Route
                  path="/records"
                  element={<Navigate to="/userhome" replace />}
                />
                <Route
                  path="/payment"
                  element={<Navigate to="/userhome" replace />}
                />
                <Route
                  path="/settings"
                  element={<Navigate to="/userhome" replace />}
                />
                <Route
                  path="/settingRole"
                  element={<Navigate to="/userhome" replace />}
                />
              </>
            )}
          </Route>

          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
