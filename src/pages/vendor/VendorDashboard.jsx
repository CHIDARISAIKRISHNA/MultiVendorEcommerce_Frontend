
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Clock,
  IndianRupee,
  Plus,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Eye
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getVendorId,
  getVendorProducts,
  getVendorOrders,
  getVendorProfile
} from "../../utils/vendorStorage";

import "./styles/Vendor.css";

export default function VendorDashboard() {
  const { user, profile } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [storeName, setStoreName] = useState("Your Store");

  useEffect(() => {
    const vendorId = getVendorId(user, profile);

    const vendorProducts = getVendorProducts(vendorId);
    const vendorOrders = getVendorOrders(vendorId);
    const vendorProfile = getVendorProfile();

    setProducts(vendorProducts);
    setOrders(vendorOrders);

    setStoreName(
      vendorProfile.storeName ||
      profile?.storeName ||
      profile?.name ||
      user?.displayName ||
      "Your Store"
    );
  }, [user, profile]);

  const pendingOrders = orders.filter(
    order => order.status?.toLowerCase() === "pending"
  );

  const revenue = orders
    .filter(order => order.status?.toLowerCase() !== "cancelled")
    .reduce(
      (total, order) =>
        total + Number(order.totalAmount || order.price || 0),
      0
    );

  const lowStock = products.filter(
    product => Number(product.stock) <= 5
  );

  const recentOrders = [...orders]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);

  const topProducts = [...products]
    .sort((a, b) => Number(b.stock) - Number(a.stock))
    .slice(0, 4);

  return (
    <div className="vendor-page">

      <section className="vendor-welcome">
        <div>
          <span className="vendor-eyebrow">SELLER OVERVIEW</span>
          <h1>Welcome back, {storeName}!</h1>
          <p>Here's what's happening with your store today.</p>
        </div>

        <Link to="/vendor/add-product" className="vendor-primary-btn">
          <Plus size={18} />
          Add New Product
        </Link>
      </section>

      <section className="vendor-stat-grid">

        <div className="vendor-stat-card">
          <div className="stat-top">
            <span>Total Products</span>
            <div className="stat-icon green">
              <Package size={21} />
            </div>
          </div>
          <h2>{products.length}</h2>
          <p>Products in your store</p>
        </div>

        <div className="vendor-stat-card">
          <div className="stat-top">
            <span>Total Orders</span>
            <div className="stat-icon blue">
              <ShoppingBag size={21} />
            </div>
          </div>
          <h2>{orders.length}</h2>
          <p>Orders received</p>
        </div>

        <div className="vendor-stat-card">
          <div className="stat-top">
            <span>Pending Orders</span>
            <div className="stat-icon orange">
              <Clock size={21} />
            </div>
          </div>
          <h2>{pendingOrders.length}</h2>
          <p>Orders waiting for action</p>
        </div>

        <div className="vendor-stat-card">
          <div className="stat-top">
            <span>Total Revenue</span>
            <div className="stat-icon purple">
              <IndianRupee size={21} />
            </div>
          </div>
          <h2>₹{revenue.toLocaleString("en-IN")}</h2>
          <p>Based on recorded orders</p>
        </div>

      </section>

      <section className="vendor-content-grid">

        <div className="vendor-panel recent-panel">
          <div className="vendor-panel-heading">
            <div>
              <h3>Recent Orders</h3>
              <p>Keep track of your latest orders</p>
            </div>

            <Link to="/vendor/orders" className="vendor-text-link">
              View all <ArrowUpRight size={16} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="vendor-empty">
              <ShoppingBag size={35} />
              <h4>No orders yet</h4>
              <p>Your customer orders will appear here.</p>
            </div>
          ) : (
            <div className="vendor-table-wrap">
              <table className="vendor-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{String(order.id).slice(-6)}</td>
                      <td>{order.customerName || "Customer"}</td>
                      <td>{order.productName || "Product"}</td>
                      <td>₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</td>
                      <td>
                        <span className={`vendor-status ${String(order.status || "pending").toLowerCase()}`}>
                          {order.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="vendor-panel stock-panel">
          <div className="vendor-panel-heading">
            <div>
              <h3>Inventory Alerts</h3>
              <p>Products that need attention</p>
            </div>
            <AlertTriangle size={20} color="#e89a30" />
          </div>

          {lowStock.length === 0 ? (
            <div className="vendor-empty compact">
              <Package size={30} />
              <p>All products have sufficient stock.</p>
            </div>
          ) : (
            lowStock.map(product => (
              <div className="stock-alert" key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.stock} units remaining</span>
                </div>
                <span className="stock-warning">Low stock</span>
              </div>
            ))
          )}

          <Link to="/vendor/products" className="vendor-outline-btn">
            Manage Inventory
          </Link>
        </div>

      </section>

      <section className="vendor-panel best-products">
        <div className="vendor-panel-heading">
          <div>
            <h3>Your Products</h3>
            <p>Quick overview of your listed products</p>
          </div>

          <Link to="/vendor/products" className="vendor-text-link">
            Manage products <ArrowUpRight size={16} />
          </Link>
        </div>

        {topProducts.length === 0 ? (
          <div className="vendor-empty">
            <Package size={35} />
            <h4>No products added</h4>
            <p>Start selling by adding your first product.</p>
            <Link to="/vendor/add-product" className="vendor-primary-btn">
              <Plus size={17} /> Add Product
            </Link>
          </div>
        ) : (
          <div className="vendor-product-grid">
            {topProducts.map(product => (
              <div className="vendor-mini-product" key={product.id}>
                <img
                  src={product.image || "https://placehold.co/300x220?text=Product"}
                  alt={product.name}
                  onError={e => {
                    e.currentTarget.src = "https://placehold.co/300x220?text=Product";
                  }}
                />

                <div>
                  <span>{product.category || "General"}</span>
                  <h4>{product.name}</h4>
                  <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
                  <p>{product.stock} units available</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="vendor-quick-actions">
        <Link to="/vendor/add-product">
          <Plus size={19} />
          Add Product
        </Link>

        <Link to="/vendor/orders">
          <Eye size={19} />
          View Orders
        </Link>

        <Link to="/vendor/profile">
          <TrendingUp size={19} />
          Update Store
        </Link>
      </section>

    </div>
  );
}
