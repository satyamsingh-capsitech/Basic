import React from "react";
import { Navigate, Route, Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;
