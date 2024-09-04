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
import RequestHistory from "./pages/RequestHistory";
import Reset from "./pages/Reset";
import ForgotPassword from "./pages/ForgotPassword";
import Request from "./pages/Request";
import SettingRole from "./pages/SettingRole";
import Notify from "./pages/Notify";
import EditProfile from "./pages/EditProfile";
import SingleItem from "./pages/SingleItem";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Chat from "./components/Chat";
import SpecificRequest from "./pages/SpecificRequest";
import { useSelector } from "react-redux";
import ChangePassword from "./pages/changePassword";

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userInfo = useSelector((state) => state.user.userInfo);
  const userType = userInfo?.user_role || null;

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}

          <Route path="/" element={<Login />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/changePassword" element={<ChangePassword />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
            {userType === "admin" || userType === "superadmin" ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/issue" element={<Issue />} />
                <Route path="/category" element={<Category />} />
                <Route path="/vendors" element={<Vendor />} />
                <Route path="/records" element={<Records />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/roles" element={<SettingRole />} />
                <Route path="/editProfile" element={<EditProfile />} />

                <Route
                  path="/specificRequest/:id"
                  element={<SpecificRequest />}
                />
                <Route
                  path="/specificVendor/:vendor_id"
                  element={<SpecificVendor />}
                />
                <Route path="/request" element={<Request />} />
                <Route
                  path="/specificbill/:bill_id"
                  element={<SpecificBill />}
                />
                <Route path="/roles" element={<SettingRole />} />

                <Route path="/notify" element={<Notify />} />
                <Route path="/specificItem/:id" element={<SingleItem />} />

                {/* Redirect admin to dashboard if they try to access user routes */}
                <Route
                  path="/userhome"
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
                <Route path="/requestHistory" element={<RequestHistory />} />
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
                  path="/roles"
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
