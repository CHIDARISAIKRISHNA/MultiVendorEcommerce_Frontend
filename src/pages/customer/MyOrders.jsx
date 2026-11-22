
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import "../../styles.css";
import "./MyOrders.css";

const filters = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function MyOrders() {
  const { orders } = useShop();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    return orders.filter((o) => {
      const query = search.toLowerCase();

      return (
        (filter === "All" || o.status === filter) &&
        (
          String(o.id).toLowerCase().includes(query) ||
          o.items.some((i) => i.name.toLowerCase().includes(query))
        )
      );
    });
  }, [orders, filter, search]);

  return (
    <main className="myorders-page">

      <div className="myorders-heading">
        <div>
          <h1>My Orders</h1>
          <p>View, manage and track your purchases.</p>
        </div>
        <span className="myorders-count">{orders.length} Orders</span>
      </div>

      <div className="myorders-search">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID or product name..."
        />
      </div>

      <div className="myorders-filters">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? "active" : ""}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        visible.map((order) => (
          <article className="myorders-card" key={order.id}>

            <div className="myorders-card-header">
              <div className="myorders-meta">
                <small>ORDER ID</small>
                <strong>{order.id}</strong>
                <span>Placed on {order.date}</span>
              </div>

              <span className={`myorders-status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <div className="myorders-products">
              {order.items.map((item, i) => (
                <div className="myorders-product" key={i}>

                  <div className="myorders-image">
                    {item.emoji || "📦"}
                  </div>

                  <div className="myorders-product-info">
                    <strong>{item.name}</strong>
                    <span>Quantity: {item.quantity}</span>
                    <b>₹{item.price.toLocaleString("en-IN")}</b>
                  </div>

                </div>
              ))}
            </div>

            <div className="myorders-footer">
              <span className="myorders-delivery">
                {order.expected}
              </span>

              <strong className="myorders-total">
                Total: ₹{order.total.toLocaleString("en-IN")}
              </strong>

              <Link
                to={`/order-details/${order.id}`}
                className="myorders-details-btn"
              >
                View Details →
              </Link>
            </div>

          </article>
        ))
      ) : (
        <div className="myorders-empty">
          <span>📦</span>
          <h3>No orders found</h3>
          <p>Try another search or filter.</p>
        </div>
      )}

    </main>
  );
}
