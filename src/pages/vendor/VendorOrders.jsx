
import React, { useEffect, useState } from "react";
import {
  Search, ShoppingBag, RefreshCw
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getVendorId, getVendorOrders, updateOrderStatus
} from "../../utils/vendorStorage";

import "./styles/Vendor.css";

export default function VendorOrders() {
  const { user, profile } = useAuth();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  function loadOrders() {
    setOrders(getVendorOrders(getVendorId(user, profile)));
  }

  useEffect(() => {
    loadOrders();
  }, [user, profile]);

  function changeStatus(id, status) {
    updateOrderStatus(id, status);
    loadOrders();
  }

  const filtered = orders.filter(order => {
    const matchesSearch =
      String(order.id).toLowerCase().includes(search.toLowerCase()) ||
      (order.customerName || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filter === "All" ||
      (order.status || "pending").toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const statuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
  ];

  return (
    <div className="vendor-page">

      <div className="vendor-page-title">
        <span className="vendor-eyebrow">ORDER MANAGEMENT</span>
        <h1>Customer Orders</h1>
        <p>View and manage orders placed for your products.</p>
      </div>

      <div className="vendor-product-summary">
        <div>
          <ShoppingBag size={22} />
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div>
          <span>Pending</span>
          <strong>{orders.filter(o => (o.status || "pending").toLowerCase() === "pending").length}</strong>
        </div>
        <div>
          <span>Delivered</span>
          <strong>{orders.filter(o => (o.status || "").toLowerCase() === "delivered").length}</strong>
        </div>
      </div>

      <div className="vendor-panel">

        <div className="vendor-toolbar">
          <div className="vendor-search">
            <Search size={18} />
            <input
              placeholder="Search order ID or customer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className="vendor-filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option>All</option>
            {statuses.map(status => (
              <option key={status}>{status}</option>
            ))}
          </select>

          <button className="vendor-outline-btn" onClick={loadOrders}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="vendor-empty">
            <ShoppingBag size={40} />
            <h3>No orders found</h3>
            <p>New customer orders will appear here.</p>
          </div>
        ) : (
          <div className="vendor-table-wrap">
            <table className="vendor-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Order Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(order => (
                  <tr key={order.id}>
                    <td>#{String(order.id).slice(-6)}</td>
                    <td>{order.customerName || "Customer"}</td>
                    <td>{order.productName || "Product"}</td>
                    <td>{order.quantity || 1}</td>
                    <td>₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</td>
                    <td>
                      <span className={`vendor-status ${(order.status || "pending").toLowerCase()}`}>
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td>
                      <select
                        className="vendor-status-select"
                        value={order.status || "Pending"}
                        onChange={e => changeStatus(order.id, e.target.value)}
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
