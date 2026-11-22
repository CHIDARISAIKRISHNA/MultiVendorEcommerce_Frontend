
import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  ShoppingCart,
  Package,
  Bell,
  Heart,
  Leaf,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  UserRound,
  Settings,
  MapPin,
  Recycle,
  Clock,
  Headphones
} from "lucide-react";

import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCompare } from "../context/CompareContext";
export default function Navbar() {
  const { user, profile, loading } = useAuth();
  const { itemCount } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
const { compareCount } = useCompare();
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("shopstack-theme") === "dark"
  );

  // APPLY DARK / LIGHT THEME
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );

    localStorage.setItem(
      "shopstack-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  // CLOSE MENUS WHEN ROUTE CHANGES
  useEffect(() => {
    setShowProfile(false);
    setShowMobileMenu(false);
  }, [location.pathname, location.hash]);

  // HANDLE SECTION NAVIGATION
  useEffect(() => {
    if (!location.hash) return;

    const sectionId = decodeURIComponent(
      location.hash.slice(1)
    );

    const frame = requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  // NAVIGATE TO HOMEPAGE SECTIONS
  function goToSection(sectionId) {
    setShowMobileMenu(false);
    setShowProfile(false);

    const target = `/customer/dashboard#${sectionId}`;

    if (
      location.pathname === "/customer/dashboard" &&
      location.hash === `#${sectionId}`
    ) {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } else {
      navigate(target);
    }
  }

  // SEARCH PRODUCTS
  function handleSearch() {
    goToSection("products");

    setTimeout(() => {
      document.getElementById("product-search-input")?.focus();
    }, 300);
  }

  // LOGOUT
  async function handleLogout() {
    try {
      setShowProfile(false);
      setShowMobileMenu(false);

      await signOut(auth);

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  if (loading || !user || !profile) return null;

  const role = profile.role;

  const homePath =
    role === "customer"
      ? "/customer/dashboard"
      : role === "vendor"
      ? "/vendor/dashboard"
      : "/admin/dashboard";

  return (
    <header className="shopstack-header">

      {/* ================= TOP NAVBAR ================= */}

      <div className="shopstack-topbar">

        {/* LOGO */}
        <Link
          to={homePath}
          className="brand"
          aria-label="SHOPSTACK Home"
        >
          <span className="brand-icon">
            <Leaf size={20} />
          </span>

          SHOPSTACK
        </Link>

        {/* SEARCH */}
        {role === "customer" && (
          <button
            className="shopstack-search"
            type="button"
            onClick={handleSearch}
            aria-label="Search products"
          >
            <Search size={19} />
            <span>Search products, brands and more...</span>
          </button>
        )}

        {/* CUSTOMER ACTIONS */}
        <div className="shopstack-actions">

          {role === "customer" && (
            <>
              {/* CART */}
              <Link
                to="/cart"
                className="cart-link"
                aria-label={`Shopping cart with ${itemCount} items`}
              >
                <ShoppingCart size={19} />
                <span>Cart</span>
                <span className="cart-count">{itemCount}</span>
              </Link>

              {/* WISHLIST */}
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `wishlist-link ${isActive ? "active" : ""}`
                }
                aria-label="My Wishlist"
              >
                <Heart size={19} />
                <span>Wishlist</span>
              </NavLink>

              

              {/* MY ACCOUNT DROPDOWN */}
              <div className="profile-dropdown">

                <button
                  type="button"
                  className="profile-btn"
                  aria-expanded={showProfile}
                  onClick={() =>
                    setShowProfile(prev => !prev)
                  }
                >
                  <UserRound size={18} />
                  <span>My Account</span>
                  <ChevronDown size={15} />
                </button>

                {showProfile && (
                  <div className="profile-menu">

                    {/* ACCOUNT HEADER */}
                    <div className="account-menu-heading">
                      <strong>
                        {profile.name || "My Account"}
                      </strong>
                      <small>{user.email}</small>
                    </div>

                    {/* PROFILE */}
                    <Link
                      to="/profile"
                      onClick={() => setShowProfile(false)}
                    >
                      <UserRound size={16} />
                      My Profile
                    </Link>

                    {/* MY ORDERS */}
                    <Link
                      to="/my-orders"
                      onClick={() => setShowProfile(false)}
                    >
                      <Package size={16} />
                      My Orders
                    </Link>

                    {/* WISHLIST */}
                    <Link
                      to="/wishlist"
                      onClick={() => setShowProfile(false)}
                    >
                      <Heart size={16} />
                      My Wishlist
                    </Link>

                    <Link to="/compare" className="navbar-compare-link">
  ⇄ Compare
  <span>{compareCount}</span>
</Link>

                    {/* ADDRESSES */}
                    <Link
                      to="/addresses"
                      onClick={() => setShowProfile(false)}
                    >
                      <MapPin size={16} />
                      My Addresses
                    </Link>

                    {/* RECENTLY VIEWED */}
                    <Link
                      to="/recently-viewed"
                      onClick={() => setShowProfile(false)}
                    >
                      <Clock size={16} />
                      Recently Viewed
                    </Link>

                    {/* NOTIFICATIONS */}
                    <Link
                      to="/notifications"
                      onClick={() => setShowProfile(false)}
                    >
                      <Bell size={16} />
                      Notifications
                    </Link>

                    {/* ACCOUNT SETTINGS */}
                    <Link
                      to="/account-settings"
                      onClick={() => setShowProfile(false)}
                    >
                      <Settings size={16} />
                      Account Settings
                    </Link>

                    {/* CUSTOMER SUPPORT
                    <Link
                      to="/customer-support"
                      onClick={() => setShowProfile(false)}
                    >
                      <Headphones size={16} />
                      Customer Support
                    </Link> */}

                    {/* LOGOUT */}
                    <button
                      type="button"
                      className="profile-logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>

                  </div>
                )}
              </div>
            </>
          )}

          {/* DARK / LIGHT MODE */}
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setDarkMode(prev => !prev)}
            aria-label={
              darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
            title={
              darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {darkMode ? (
              <>
                <Sun size={17} />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={17} />
                <span>Dark</span>
              </>
            )}
          </button>

          {/* VENDOR / ADMIN LOGOUT */}
          {role !== "customer" && (
            <button
              className="logout-btn"
              type="button"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Logout
            </button>
          )}

          {/* MOBILE MENU BUTTON */}
          {role === "customer" && (
            <button
              className="mobile-menu-toggle"
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={showMobileMenu}
              onClick={() =>
                setShowMobileMenu(prev => !prev)
              }
            >
              {showMobileMenu ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          )}

        </div>
      </div>

      {/* ================= SECOND NAVBAR ================= */}

      {role === "customer" && (
        <nav
          className={
            showMobileMenu
              ? "shopstack-bottom-nav mobile-open"
              : "shopstack-bottom-nav"
          }
          aria-label="Shopping navigation"
        >

          <button
            type="button"
            className="all-categories-link"
            onClick={() => goToSection("categories")}
          >
            <Menu size={17} />
            All Categories
          </button>

          <NavLink
            to="/customer/dashboard"
            end
            className={({ isActive }) =>
              isActive && !location.hash ? "active" : ""
            }
          >
            Home
          </NavLink>

          <button
            type="button"
            className={
              location.hash === "#products" ? "active" : ""
            }
            onClick={() => goToSection("products")}
          >
            Shop
          </button>

          <button
            type="button"
            className={
              location.hash === "#categories" ? "active" : ""
            }
            onClick={() => goToSection("categories")}
          >
            Categories
          </button>

          <button
            type="button"
            onClick={() => goToSection("benefits")}
          >
            <Recycle size={16} />
            Why SHOPSTACK
          </button>

          {/* MOBILE ACCOUNT LINKS */}
          <div className="mobile-account-links">

            <Link to="/my-orders">
              <Package size={16} />
              My Orders
            </Link>

            <Link to="/wishlist">
              <Heart size={16} />
              My Wishlist
            </Link>

            <Link to="/profile">
              <UserRound size={16} />
              My Profile
            </Link>

            <Link to="/addresses">
              <MapPin size={16} />
              My Addresses
            </Link>

            <Link to="/recently-viewed">
              <Clock size={16} />
              Recently Viewed
            </Link>

            <Link to="/notifications">
              <Bell size={16} />
              Notifications
            </Link>

            <Link to="/account-settings">
              <Settings size={16} />
              Account Settings
            </Link>

            {/* <Link to="/customer-support">
              <Headphones size={16} />
              Customer Support
            </Link> */}

            <button
              type="button"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>

        </nav>
      )}

      {/* VENDOR NAVIGATION */}
      {role === "vendor" && (
        <nav className="shopstack-bottom-nav">
          <NavLink to="/vendor/dashboard">Dashboard</NavLink>
          <NavLink to="/vendor/products">Products</NavLink>
          <NavLink to="/vendor/orders">Orders</NavLink>
          <NavLink to="/vendor/profile">Store Profile</NavLink>
        </nav>
      )}

      {/* ADMIN NAVIGATION */}
      {role === "admin" && (
        <nav className="shopstack-bottom-nav">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/customers">Customers</NavLink>
          <NavLink to="/admin/vendors">Vendors</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
        </nav>
      )}

    </header>
  );
}
