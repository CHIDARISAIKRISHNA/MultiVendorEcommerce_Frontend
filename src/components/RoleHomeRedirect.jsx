import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function RoleHomeRedirect() {

  const { user, profile, loading } = useAuth();

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (profile.status === "inactive") {
    return <Navigate to="/account-inactive" replace />;
  }

  switch (profile.role) {

    case "customer":
      return <Navigate to="/customer/dashboard" replace />;

    case "vendor":
      return <Navigate to="/vendor/dashboard" replace />;

    case "admin":
      return <Navigate to="/admin/dashboard" replace />;

    default:
      return <Navigate to="/unauthorized" replace />;

  }
}