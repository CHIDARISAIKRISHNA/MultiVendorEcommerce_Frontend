import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function AccountInactive() {

  async function handleLogout() {
    await signOut(auth);
    window.location.href = "/login";
  }

  return (
    <div style={{
      textAlign: "center",
      padding: "80px 20px"
    }}>

      <h1>Account Deactivated</h1>

      <p>Your account is currently inactive.</p>

      <p>Please contact support for assistance.</p>

      <button onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}