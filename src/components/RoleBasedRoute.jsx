
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleBasedRoute({ allowedRoles, children }) {

  const { profile, loading } = useAuth();

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (profile.status?.toLowerCase() === "inactive") {
    return <Navigate to="/account-inactive" replace />;
  }

  const userRole = profile.role?.toLowerCase();

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
