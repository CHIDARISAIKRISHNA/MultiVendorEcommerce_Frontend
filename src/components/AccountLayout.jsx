
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const menu = [
  ["👤", "My Profile", "/profile"],
  ["📦", "My Orders", "/my-orders"],
  ["❤️", "My Wishlist", "/wishlist"],
  ["📍", "My Addresses", "/addresses"],
  ["🕘", "Recently Viewed", "/recently-viewed"],
  ["🔔", "Notifications", "/notifications"],
  ["⚙️", "Account Settings", "/account-settings"],
];

export default function AccountLayout() {
  const { profile } = useShop();

  return (
    <main className="account-layout">

      {/* PAGE HEADER */}
      <div className="account-layout-heading">
        <div>
          <span className="account-eyebrow">YOUR ACCOUNT</span>
          <h1>My Account</h1>
          <p>Manage your profile, orders and preferences.</p>
        </div>
      </div>

      {/* ACCOUNT GRID */}
      <div className="account-layout-grid">

        {/* SIDEBAR */}
        <aside className="account-layout-sidebar">

          <div className="account-sidebar-user">
            <div className="account-avatar">👤</div>

            <div className="account-user-info">
              <strong>{profile.name || "User"}</strong>
              <small>{profile.email || "Welcome to SHOPSTACK"}</small>
            </div>
          </div>

          <div className="account-sidebar-label">
            ACCOUNT MENU
          </div>

          <nav className="account-sidebar-nav">
            {menu.map(([icon, label, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? "account-side-link active"
                    : "account-side-link"
                }
              >
                <span className="account-menu-icon">{icon}</span>
                <span>{label}</span>
                <span className="account-menu-arrow">›</span>
              </NavLink>
            ))}
          </nav>

        </aside>

        {/* PAGE CONTENT */}
        <section className="account-layout-content">
          <Outlet />
        </section>

      </div>
    </main>
  );
}
