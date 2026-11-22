import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {

  return (
    <div style={{
      textAlign: "center",
      padding: "80px 20px"
    }}>

      <h1>403 - Access Denied</h1>

      <h3>You don't have permission to access this page.</h3>

      <p>Please log in with an authorized account.</p>

      <Link to="/">
        Go to Home
      </Link>

    </div>
  );
}