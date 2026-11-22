
import React from "react";
import {
  Routes,
  Route
} from "react-router-dom";

import MyOrders from "./pages/customer/MyOrders";
import Wishlist from "./pages/customer/Wishlist";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/customer/Cart";
import CustomerSupport from "./components/CustomerSupport";
import Navbar from "./components/Navbar";
import RoleBasedRoute from "./components/RoleBasedRoute";
import RoleHomeRedirect from "./components/RoleHomeRedirect";
import Unauthorized from "./components/Unauthorized";
import AccountInactive from "./components/AccountInactive";

import AuthScreen from "./components/AuthScreen.jsx";
import Home from "./pages/customer/Home";
import Checkout from "./pages/customer/Checkout";
import ProductDetails from "./pages/customer/ProductDetails";
import Profile from "./pages/customer/Profile";
import Addresses from "./pages/customer/Addresses";
import AccountSettings from "./pages/customer/AccountSettings";

// NEW CUSTOMER ACCOUNT PAGES
import OrderDetails from "./pages/customer/OrderDetails";
import RecentlyViewed from "./pages/customer/RecentlyViewed";
import Notifications from "./pages/customer/Notifications";

// NEW ACCOUNT DATA CONTEXT
import { ShopProvider } from "./context/ShopContext";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageVendors from "./pages/admin/ManageVendors";
import ManageCustomers from "./pages/admin/ManageCustomers";
import AdminManageProducts from "./pages/admin/ManageProducts";
import AdminOrders from "./pages/admin/AdminOrders";

import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProfile from "./pages/vendor/VendorProfile";
import AddProduct from "./pages/vendor/AddProduct";
import VendorOrders from "./pages/vendor/VendorOrders";
import { useLocation } from "react-router-dom";
import VendorLayout from "./pages/vendor/VendorLayout";
import VendorManageProducts from "./pages/vendor/ManageProducts";

import Compare from "./pages/customer/Compare";
import { CompareProvider } from "./context/CompareContext";

function App() {
  const location = useLocation();

  const isVendorPage = location.pathname.startsWith("/vendor");
  return (

    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
            <CompareProvider>
          <ShopProvider>

{/* Show customer navbar only on non-vendor pages */}
{!isVendorPage && (
  <div className="store-navbar">
    <Navbar />
  </div>
)}
            <Routes>

              {/* Authentication */}
              <Route path="/login" element={<AuthScreen />} />
              <Route path="/register" element={<AuthScreen />} />

              {/* Home redirect */}
              <Route
                path="/"
                element={<RoleHomeRedirect />}
              />

              {/* Public product page */}
              <Route
                path="/product/:id"
                element={<ProductDetails />}
              />

              {/* CUSTOMER ROUTES */}

              <Route
                path="/customer/dashboard"
                element={
                  <RoleBasedRoute allowedRoles={["customer"]}>
                    <Home />
                  </RoleBasedRoute>
                }
              />
              
              {/* Customer Orders */}
              <Route
                path="/my-orders"
                element={
                  <RoleBasedRoute allowedRoles={["customer"]}>
                    <MyOrders />
                  </RoleBasedRoute>
                }
              />

              {/* NEW: Order Details */}
              <Route
                path="/order-details/:id"
                element={
                  <RoleBasedRoute allowedRoles={["customer"]}>
                    <OrderDetails />
                  </RoleBasedRoute>
                }
              />

              {/* NEW: Recently Viewed */}
              <Route
                path="/recently-viewed"
                element={
                  <RoleBasedRoute allowedRoles={["customer"]}>
                    <RecentlyViewed />
                  </RoleBasedRoute>
                }
              />

              {/* NEW: Notifications */}
              <Route
                path="/notifications"
                element={
                  <RoleBasedRoute allowedRoles={["customer"]}>
                    <Notifications />
                  </RoleBasedRoute>
                }
              />

              {/* Cart */}
              <Route
                path="/cart"
                element={
                  <RoleBasedRoute allowedRoles={["customer"]}>
                    <Cart />
                  </RoleBasedRoute>
                }
              />

              {/* Checkout */}
              <Route
                path="/checkout"
                element={
                  <RoleBasedRoute allowedRoles={["customer"]}>
                    <Checkout />
                  </RoleBasedRoute>
                }
              />

              {/* Profile */}
              <Route
                path="/profile"
                element={
                  <RoleBasedRoute allowedRoles={["customer"]}>
                    <Profile />
                  </RoleBasedRoute>
                }
              />

              {/* Addresses */}
              <Route
                path="/addresses"
                element={
                  <RoleBasedRoute allowedRoles={["customer"]}>
                    <Addresses />
                  </RoleBasedRoute>
                }
              />

              {/* Account Settings */}
              <Route
                path="/account-settings"
                element={
                  <RoleBasedRoute allowedRoles={["customer"]}>
                    <AccountSettings />
                  </RoleBasedRoute>
                }
              />
              {/* Customer Support */}

              {/* Wishlist */}
              <Route
                path="/wishlist"
                element={
                  <RoleBasedRoute allowedRoles={["customer"]}>
                    <Wishlist />
                  </RoleBasedRoute>
                }
              />
              {/* Compare Products */}
<Route
  path="/compare"
  element={
    <RoleBasedRoute allowedRoles={["customer"]}>
      <Compare />
    </RoleBasedRoute>
  }
/>
              {/* VENDOR ROUTES */}

             {/* VENDOR ROUTES */}

<Route
  path="/vendor/dashboard"
  element={
    <RoleBasedRoute allowedRoles={["vendor"]}>
      <VendorLayout>
        <VendorDashboard />
      </VendorLayout>
    </RoleBasedRoute>
  }
/>

<Route
  path="/vendor/profile"
  element={
    <RoleBasedRoute allowedRoles={["vendor"]}>
      <VendorLayout>
        <VendorProfile />
      </VendorLayout>
    </RoleBasedRoute>
  }
/>

<Route
  path="/vendor/add-product"
  element={
    <RoleBasedRoute allowedRoles={["vendor"]}>
      <VendorLayout>
        <AddProduct />
      </VendorLayout>
    </RoleBasedRoute>
  }
/>

<Route
  path="/vendor/products"
  element={
    <RoleBasedRoute allowedRoles={["vendor"]}>
      <VendorLayout>
        <VendorManageProducts />
      </VendorLayout>
    </RoleBasedRoute>
  }
/>

<Route
  path="/vendor/orders"
  element={
    <RoleBasedRoute allowedRoles={["vendor"]}>
      <VendorLayout>
        <VendorOrders />
      </VendorLayout>
    </RoleBasedRoute>
  }
/>

              {/* ADMIN ROUTES */}

              <Route
                path="/admin/dashboard"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                }
              />

              <Route
                path="/admin/vendors"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <ManageVendors />
                  </RoleBasedRoute>
                }
              />

              <Route
                path="/admin/customers"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <ManageCustomers />
                  </RoleBasedRoute>
                }
              />

              <Route
  path="/admin/products"
  element={
    <RoleBasedRoute allowedRoles={["admin"]}>
      <AdminManageProducts />
    </RoleBasedRoute>
  }
/>

              <Route
                path="/admin/orders"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <AdminOrders />
                  </RoleBasedRoute>
                }
              />

              {/* ERROR AND ACCOUNT STATUS ROUTES */}

              <Route
                path="/unauthorized"
                element={<Unauthorized />}
              />

              <Route
                path="/account-inactive"
                element={<AccountInactive />}
              />

            </Routes>

            <CustomerSupport />

          </ShopProvider>
           </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>

  );

}

export default App;
