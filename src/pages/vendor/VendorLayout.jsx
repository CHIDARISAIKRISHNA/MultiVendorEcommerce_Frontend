
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Leaf,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./styles/Vendor.css";

export default function VendorLayout({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dark, setDark] = React.useState(
    localStorage.getItem("vendor-theme") === "dark"
  );

  React.useEffect(() => {
    document.body.classList.toggle("vendor-dark", dark);
    localStorage.setItem("vendor-theme", dark ? "dark" : "light");

    return () => document.body.classList.remove("vendor-dark");
  }, [dark]);

  function logout() {
    navigate("/login");
  }

  const links = [
    { to: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/vendor/products", label: "Products", icon: Package },
    { to: "/vendor/orders", label: "Orders", icon: ShoppingBag },
    { to: "/vendor/profile", label: "Store Profile", icon: Store }
  ];

  return (
    <div className="vendor-app">

      <header className="vendor-header">
        <Link to="/vendor/dashboard" className="vendor-brand">
          <span className="vendor-logo">
            <Leaf size={21} />
          </span>
          <span>SHOPSTACK</span>
          <small>SELLER CENTER</small>
        </Link>

        <div className="vendor-header-right">
          <span className="vendor-user">
            {user?.displayName || user?.email || "Vendor"}
          </span>

          <button
            className="vendor-theme-btn"
            onClick={() => setDark(!dark)}
            type="button"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
            {dark ? "Light" : "Dark"}
          </button>

          <button className="vendor-logout" onClick={logout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      <nav className="vendor-nav">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/vendor/dashboard"}
            className={({ isActive }) =>
              `vendor-nav-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <main className="vendor-main">
        {children}
      </main>

      <footer className="vendor-footer">
        © 2026 ShopStack Seller Center. All rights reserved.
      </footer>

    </div>
  );
}
