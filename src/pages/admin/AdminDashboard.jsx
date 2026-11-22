
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./styles/Admin.css";

const readStorage = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });

const getOrderTotal = (order) =>
  Number(
    order.totalAmount ??
    order.total ??
    order.amount ??
    order.grandTotal ??
    0
  );

const getOrderDate = (order) =>
  order.createdAt || order.orderDate || order.date || order.created_at;

function AdminDashboard() {
  const { user } = useAuth();

  const [data, setData] = useState({
    users: [],
    vendors: [],
    products: [],
    orders: []
  });

  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("Yearly");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadData = () => {
      setData({
        users: readStorage("users"),
        vendors: readStorage("vendors"),
        products: readStorage("products"),
        orders: readStorage("orders")
      });
    };

    loadData();

    window.addEventListener("storage", loadData);
    window.addEventListener("focus", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("focus", loadData);
    };
  }, []);

  const stats = useMemo(() => {
    const customers = data.users.filter(
      (u) => u.role?.toLowerCase() === "customer"
    ).length;

    const vendors = data.vendors.length
      ? data.vendors.length
      : data.users.filter(
          (u) => u.role?.toLowerCase() === "vendor"
        ).length;

    const pendingVendors = data.vendors.filter(
      (v) => v.status?.toLowerCase() === "pending"
    ).length;

    const pendingProducts = data.products.filter(
      (p) => p.approved === false
    ).length;

    const today = new Date().toDateString();

    const todayOrders = data.orders.filter((o) => {
      const date = getOrderDate(o);
      return date && !Number.isNaN(new Date(date).getTime()) &&
        new Date(date).toDateString() === today;
    }).length;

    const sales = data.orders.reduce(
      (sum, order) => sum + getOrderTotal(order),
      0
    );

    const lowStock = data.products.filter((p) => {
      const stock = Number(p.stock ?? p.quantity ?? 0);
      return stock > 0 && stock <= 10;
    }).length;

    const outOfStock = data.products.filter((p) => {
      const stock = Number(p.stock ?? p.quantity ?? 0);
      return stock <= 0;
    }).length;

    const inStock = Math.max(
      0,
      data.products.length - lowStock - outOfStock
    );

    return {
      customers,
      vendors,
      products: data.products.length,
      orders: data.orders.length,
      pendingVendors,
      pendingProducts,
      todayOrders,
      sales,
      lowStock,
      outOfStock,
      inStock
    };
  }, [data]);

  // Monthly sales from actual order dates.
  const salesData = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const currentYear = new Date().getFullYear();

    const values = Array(12).fill(0);

    data.orders.forEach((order) => {
      const date = getOrderDate(order);

      if (!date) return;

      const parsedDate = new Date(date);

      if (
        !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.getFullYear() === currentYear
      ) {
        values[parsedDate.getMonth()] += getOrderTotal(order);
      }
    });

    return {
      months,
      values,
      hasData: values.some((v) => v > 0)
    };
  }, [data.orders]);

  const chartValues = salesData.hasData
    ? salesData.values
    : [4000, 5200, 4800, 7000, 6200, 8500, 7600, 9000, 8200, 9500, 8800, 10500];

  const maxSales = Math.max(...chartValues, 1) * 1.15;

  const chartPoints = chartValues.map((value, index) => ({
    x: 48 + index * 52,
    y: 175 - (value / maxSales) * 145
  }));

  const chartLine = chartPoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const chartArea = `48,175 ${chartLine} 620,175`;

  // Top-selling products based on available product information.
  const topProducts = [...data.products]
    .sort(
      (a, b) =>
        Number(b.sold ?? b.salesCount ?? 0) -
        Number(a.sold ?? a.salesCount ?? 0)
    )
    .slice(0, 4);

  // Latest orders.
  const recentOrders = [...data.orders]
    .sort((a, b) => {
      const dateA = new Date(getOrderDate(a) || 0).getTime();
      const dateB = new Date(getOrderDate(b) || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 4);

  const shipmentStatuses = [
    {
      name: "Delivered",
      color: "#21b568",
      count: data.orders.filter(
        (o) => o.status?.toLowerCase() === "delivered"
      ).length
    },
    {
      name: "On Delivery",
      color: "#16b9d1",
      count: data.orders.filter(
        (o) =>
          ["shipped", "on delivery", "out for delivery"].includes(
            o.status?.toLowerCase()
          )
      ).length
    },
    {
      name: "Returned",
      color: "#e04444",
      count: data.orders.filter(
        (o) => o.status?.toLowerCase() === "returned"
      ).length
    },
    {
      name: "Cancelled",
      color: "#e8bf35",
      count: data.orders.filter(
        (o) => o.status?.toLowerCase() === "cancelled"
      ).length
    }
  ];

  const shipmentTotal = shipmentStatuses.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const shipmentGradient = shipmentTotal
    ? (() => {
        let current = 0;
        return shipmentStatuses.map((item) => {
          const start = current;
          current += (item.count / shipmentTotal) * 100;
          return `${item.color} ${start}% ${current}%`;
        }).join(", ");
      })()
    : "#e8edf0 0% 100%";

  const marketingBars = [
    38, 50, 26, 46, 35, 59, 78, 66, 42, 72, 60, 78
  ];

  const filteredProducts = topProducts.filter((p) =>
    (p.name || p.title || p.productName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredOrders = recentOrders.filter((o) =>
    `${o.id || o.orderId || ""} ${o.customerName || o.name || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const orderStatusClass = (status = "") =>
    status.toLowerCase().replace(/\s+/g, "-");

  const getProductName = (product) =>
    product.name || product.title || product.productName || "Product";

  const getCustomerName = (order) =>
    order.customerName ||
    order.name ||
    order.userName ||
    order.shippingAddress?.name ||
    "Customer";

  const getOrderId = (order) =>
    order.id || order.orderId || "N/A";

  const getOrderStatus = (order) =>
    order.status || "Pending";

  const currentMonth = new Date().getMonth();

  const activeUsers = stats.customers;

  return (
    <div className="shop-admin">

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${menuOpen ? "sidebar-open" : ""}`}>

        <Link to="/admin" className="admin-brand">
          <span className="brand-icon">S</span>
          <span>SHOPSTACK</span>
        </Link>

        <div className="sidebar-heading">MAIN MENU</div>

        <nav className="sidebar-nav">
          <Link to="/admin" className="sidebar-link active">
            <span>▦</span> Dashboard
          </Link>

          <a href="#sales-overview" className="sidebar-link">
            <span>▤</span> Sales Overview
          </a>

          <Link to="/admin/orders" className="sidebar-link">
            <span>▣</span> Order Management
          </Link>

          <Link to="/admin/products" className="sidebar-link">
            <span>▧</span> Inventory Management
          </Link>

          <a href="#admin-settings" className="sidebar-link">
            <span>⚙</span> Settings
          </a>
        </nav>

        <div className="sidebar-bottom">
          <Link to="/" className="sidebar-link">
            <span>↗</span> Visit Store
          </Link>

          <div className="sidebar-admin">
            <div className="admin-avatar">
              {(user?.email || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>Administrator</strong>
              <small>Admin Account</small>
            </div>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* TOPBAR */}
        <header className="admin-topbar">

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <div className="admin-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search products, orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="admin-top-actions">
            <button
              className="admin-icon-btn"
              title="Notifications"
              onClick={() => {
                window.location.href = "/admin/orders";
              }}
            >
              ♧
            </button>

            <div className="top-profile">
              <div className="profile-avatar">
                {(user?.email || "A").charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <strong>Admin</strong>
                <small>{user?.email || "Administrator"}</small>
              </div>
            </div>
          </div>

        </header>

        {/* DASHBOARD TITLE */}
        <section className="dashboard-heading">
          <div>
            <span className="welcome-label">OVERVIEW</span>
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.email || "Administrator"}!</p>
          </div>

          <div className="dashboard-date">
            <span>◷</span>
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })}
          </div>
        </section>

        {/* STAT CARDS */}
        <section className="admin-stat-grid">

          <div className="admin-stat-card purple">
            <div className="stat-top">
              <span>Total Sales</span>
              <span className="stat-icon">₹</span>
            </div>
            <h2>{money(stats.sales)}</h2>
            <small>All recorded orders</small>
          </div>

          <div className="admin-stat-card blue">
            <div className="stat-top">
              <span>Orders Today</span>
              <span className="stat-icon">▣</span>
            </div>
            <h2>{stats.todayOrders}</h2>
            <small>Orders placed today</small>
          </div>

          <div className="admin-stat-card orange">
            <div className="stat-top">
              <span>Low Stock Items</span>
              <span className="stat-icon">⚠</span>
            </div>
            <h2>{stats.lowStock}</h2>
            <small>Products need attention</small>
          </div>

          <div className="admin-stat-card grey">
            <div className="stat-top">
              <span>Total Customers</span>
              <span className="stat-icon">♙</span>
            </div>
            <h2>{stats.customers}</h2>
            <small>Registered customers</small>
          </div>

        </section>

        {/* SALES AND INVENTORY */}
        <section className="admin-main-grid">

          <div className="admin-panel sales-panel" id="sales-overview">

            <div className="panel-heading">
              <div>
                <h2>Sales Overview</h2>
                <p>Track your store revenue</p>
              </div>

              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option>Yearly</option>
                <option>Monthly</option>
              </select>
            </div>

            <div className="sales-chart">

              <div className="chart-y-labels">
                <span>{money(maxSales)}</span>
                <span>{money(maxSales * 0.75)}</span>
                <span>{money(maxSales * 0.5)}</span>
                <span>{money(maxSales * 0.25)}</span>
                <span>₹0</span>
              </div>

              <svg
                viewBox="0 0 650 195"
                preserveAspectRatio="none"
                className="sales-svg"
              >
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#20b568" stopOpacity=".32" />
                    <stop offset="100%" stopColor="#20b568" stopOpacity=".02" />
                  </linearGradient>
                </defs>

                {[30, 66, 102, 138, 175].map((y) => (
                  <line
                    key={y}
                    x1="48"
                    y1={y}
                    x2="620"
                    y2={y}
                    stroke="#e4e9e7"
                    strokeDasharray="4 5"
                  />
                ))}

                <polygon points={chartArea} fill="url(#salesFill)" />

                <polyline
                  points={chartLine}
                  fill="none"
                  stroke="#20b568"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {chartPoints.map((point, i) => (
                  <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill="#20b568"
                  />
                ))}
              </svg>

              <div className="chart-months">
                {salesData.months.map((month, index) => (
                  <span key={month} className={
                    index === currentMonth ? "current-month" : ""
                  }>
                    {month}
                  </span>
                ))}
              </div>

            </div>

            <p className="chart-note">
              {salesData.hasData
                ? "Based on recorded orders for the current year."
                : "Sample chart preview. Actual sales will appear when orders are recorded."}
            </p>

          </div>

          {/* INVENTORY */}
          <div className="admin-panel inventory-panel">

            <div className="panel-heading">
              <div>
                <h2>Inventory Status</h2>
                <p>Product stock summary</p>
              </div>
            </div>

            <div className="inventory-row">
              <div>
                <span className="inventory-dot green-dot">✓</span>
                In Stock
              </div>
              <strong>{stats.inStock}</strong>
            </div>

            <div className="inventory-row">
              <div>
                <span className="inventory-dot orange-dot">!</span>
                Low Stock
              </div>
              <strong>{stats.lowStock}</strong>
            </div>

            <div className="inventory-row">
              <div>
                <span className="inventory-dot red-dot">!</span>
                Out of Stock
              </div>
              <strong>{stats.outOfStock}</strong>
            </div>

            <Link to="/admin/products" className="manage-inventory-btn">
              Manage Inventory →
            </Link>

            <div className="pending-summary">
              <span>Pending Products</span>
              <strong>{stats.pendingProducts}</strong>
            </div>

          </div>

        </section>

        {/* PRODUCTS, ORDERS, SHIPMENT */}
        <section className="admin-bottom-grid">

          {/* TOP PRODUCTS */}
          <div className="admin-panel products-panel">

            <div className="panel-heading">
              <div>
                <h2>Top Selling Products</h2>
                <p>Your product performance</p>
              </div>
              <Link to="/admin/products">View All →</Link>
            </div>

            <div className="product-table">

              <div className="product-table-head">
                <span>Product</span>
                <span>Price</span>
                <span>Stock</span>
              </div>

              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <div className="product-table-row" key={product.id || index}>
                    <div className="product-name-cell">
                      <div className="product-mini-image">
                        {product.image ? (
                          <img src={product.image} alt={getProductName(product)} />
                        ) : (
                          <span>📦</span>
                        )}
                      </div>
                      <span>{getProductName(product)}</span>
                    </div>

                    <strong>
                      {money(product.price || product.sellingPrice || 0)}
                    </strong>

                    <span className={
                      Number(product.stock ?? product.quantity ?? 0) <= 10
                        ? "stock-warning"
                        : "stock-good"
                    }>
                      {Number(product.stock ?? product.quantity ?? 0)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="admin-empty">
                  No products found. Add products to see them here.
                </div>
              )}

            </div>

          </div>

          {/* RECENT ORDERS */}
          <div className="admin-panel recent-orders-panel">

            <div className="panel-heading">
              <div>
                <h2>Recent Orders</h2>
                <p>Latest customer purchases</p>
              </div>

              <Link to="/admin/orders">View All →</Link>
            </div>

            <div className="recent-order-list">

              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <div className="recent-order-row" key={order.id || index}>

                    <div>
                      <strong>#{getOrderId(order)}</strong>
                      <small>{getCustomerName(order)}</small>
                    </div>

                    <span className={`order-status ${orderStatusClass(getOrderStatus(order))}`}>
                      {getOrderStatus(order)}
                    </span>

                  </div>
                ))
              ) : (
                <div className="admin-empty">
                  No recent orders found.
                </div>
              )}

            </div>

          </div>

          {/* SHIPMENT STATUS */}
          <div className="admin-panel shipment-panel">

            <div className="panel-heading">
              <div>
                <h2>Shipment Status</h2>
                <p>Order delivery tracking</p>
              </div>
              <span className="today-badge">Today</span>
            </div>

            <div className="shipment-chart-area">

              <div
                className="shipment-donut"
                style={{
                  background: `conic-gradient(${shipmentGradient})`
                }}
              >
                <div className="donut-center">
                  <strong>{stats.orders}</strong>
                  <small>Total Orders</small>
                </div>
              </div>

            </div>

            <div className="shipment-legend">
              {shipmentStatuses.map((item) => (
                <div key={item.name}>
                  <span
                    className="legend-dot"
                    style={{ background: item.color }}
                  />
                  <span>{item.name}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>

          </div>

        </section>

        {/* CUSTOMER ACTIVITY AND MARKETING */}
        <section className="admin-footer-grid">

          <div className="admin-panel customer-activity-panel">

            <div className="panel-heading">
              <div>
                <h2>Customer Activity</h2>
                <p>Store audience overview</p>
              </div>
            </div>

            <div className="activity-content">

              <div className="activity-stats">
                <div>
                  <span>Active Customers</span>
                  <strong>{activeUsers.toLocaleString("en-IN")}</strong>
                </div>

                <div>
                  <span>Total Signups</span>
                  <strong>{stats.customers.toLocaleString("en-IN")}</strong>
                </div>

                <div>
                  <span>Total Vendors</span>
                  <strong>{stats.vendors.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <div className="activity-donut">
                <div className="activity-donut-inner">
                  <strong>{stats.customers}</strong>
                  <small>Customers</small>
                </div>
              </div>

            </div>

          </div>

          <div className="admin-panel marketing-panel" id="admin-settings">

            <div className="panel-heading">
              <div>
                <h2>Marketing Performance</h2>
                <p>Store activity overview</p>
              </div>
              <span className="today-badge">Overview</span>
            </div>

            <div className="marketing-summary">
              <div>
                <span>Campaigns</span>
                <strong>—</strong>
              </div>
              <div>
                <span>Conversion Data</span>
                <strong>—</strong>
              </div>
            </div>

            <div className="marketing-chart">
              {marketingBars.map((height, index) => (
                <div
                  key={index}
                  className="marketing-bar"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <p className="chart-note">
              Demo visualization. Marketing analytics are not connected yet.
            </p>

          </div>

        </section>

        {/* ADMIN MANAGEMENT */}
        <section className="admin-management-panel">
          <div>
            <h2>Admin Management</h2>
            <p>Quick access to your store management pages.</p>
          </div>

          <div className="admin-management-links">
            <Link to="/admin/vendors">Manage Vendors</Link>
            <Link to="/admin/customers">Manage Customers</Link>
            <Link to="/admin/products">Manage Products</Link>
            <Link to="/admin/orders">View Orders</Link>
          </div>
        </section>

        <footer className="admin-footer">
          © {new Date().getFullYear()} SHOPSTACK. Admin Dashboard.
        </footer>

      </main>
    </div>
  );
}

export default AdminDashboard;
