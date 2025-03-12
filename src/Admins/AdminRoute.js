import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../Users/Context/UserContext";

const AdminRoute = ({ children }) => {
  const { userData } = useUser();
  const isAdmin = userData && userData.role === "admin";

  return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
