import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import "./AccountDropdown.css";

const links = [
  ["👤", "My Profile", "/profile"],
  ["📦", "My Orders", "/my-orders"],
  ["❤️", "My Wishlist", "/wishlist"],
  ["📍", "My Addresses", "/addresses"],
  ["⚙️", "Account Settings", "/account-settings"],
  ["🔔", "Notifications", "/notifications"],
 
];

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const { profile } = useShop();

  return (
    <div className="ss-account-dropdown">
      <button className="ss-account-trigger" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>♙</span> My Account <span className="ss-chevron">⌄</span>
      </button>
      {open && (
        <>
          <button className="ss-dropdown-backdrop" aria-label="Close account menu" onClick={() => setOpen(false)} />
          <div className="ss-account-menu">
            <div className="ss-account-user">
              <strong>{profile.name || "User"}</strong>
              <small>{profile.email}</small>
            </div>
            {links.map(([icon, label, path]) => (
              <Link key={path} to={path} onClick={() => setOpen(false)} className="ss-account-link">
                <span>{icon}</span>{label}
              </Link>
            ))}
            <button className="ss-account-link ss-logout" onClick={() => {
              setOpen(false);
              alert("Connect this button to your authentication logout function.");
            }}>
              <span>↪</span> Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
