import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Login from "../pages/Login";

const ProtectedRoutes = () => {
  const isLoggedin = localStorage.getItem("isLoggedIn");

  return isLoggedin === "true" ? <Outlet /> : <Navigate to={"/"} />;
};
export default ProtectedRoutes;
