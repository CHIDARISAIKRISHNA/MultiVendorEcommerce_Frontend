
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import "../../styles.css";

export default function OrderDetails() {
  const { id } = useParams();
  const { orders, setOrders } = useShop();

  const order = orders.find(
    (o) => String(o.id) === String(id)
  );

  if (!order) {
    return (
      <main className="order-details-page">
        <div className="order-not-found">
          <span>📦</span>
          <h2>Order Not Found</h2>
          <p>We couldn't find the requested order.</p>
          <Link to="/my-orders">← Back to My Orders</Link>
        </div>
      </main>
    );
  }

  const items = order.items || [];
  const total = order.total ??
    items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );

  const steps = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Delivered"
  ];

  const active =
    order.status === "Cancelled" ? -1 :
    order.status === "Processing" ? 1 :
    order.status === "Shipped" ? 2 :
    order.status === "Delivered" ? 3 : 0;

  const formatDate = (value) => {
    if (!value) return "Update pending";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const cancel = () => {
    if (!["Processing", "Shipped"].includes(order.status)) return;

    if (window.confirm("Are you sure you want to cancel this order?")) {
      setOrders((old) =>
        old.map((o) =>
          String(o.id) === String(id)
            ? {
                ...o,
                status: "Cancelled",
                expected: "Order cancelled"
              }
            : o
        )
      );
    }
  };

  const requestReturn = () => {
    if (order.returnStatus === "Requested") return;

    if (
      window.confirm(
        "Would you like to submit a return/refund request for this order?"
      )
    ) {
      setOrders((old) =>
        old.map((o) =>
          String(o.id) === String(id)
            ? { ...o, returnStatus: "Requested" }
            : o
        )
      );
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const trackingUpdates = [
    {
      title: "Order Placed",
      description: "Your order has been successfully placed.",
      date: order.date,
      completed: active >= 0
    },
    {
      title: "Processing",
      description: "Your order is being prepared for dispatch.",
      date: order.processingAt,
      completed: active >= 1
    },
    {
      title: "Shipped",
      description: "Your package has been handed over for delivery.",
      date: order.shippedAt,
      completed: active >= 2
    },
    {
      title: "Delivered",
      description: "Your package has been delivered successfully.",
      date: order.deliveredAt,
      completed: active >= 3
    }
  ];

  return (
    <main className="order-details-page">

      <div className="order-details-toolbar">
        <Link to="/my-orders" className="order-details-back">
          ← Back to My Orders
        </Link>

        <button
          type="button"
          className="order-invoice-button"
          onClick={printInvoice}
        >
          ⬇ Print / Save Invoice
        </button>
      </div>

      {/* ORDER HEADER */}
      <div className="order-details-header">
        <div>
          <h1>Order Details</h1>
          <p>Order ID: <strong>{order.id}</strong></p>
          <span>Placed on {formatDate(order.date)}</span>
        </div>

        <span
          className={`order-details-status ${String(order.status || "Processing").toLowerCase()}`}
        >
          {order.status || "Processing"}
        </span>
      </div>

      {/* TRACKING TIMELINE */}
      <section className="order-tracking-card">
        <div className="order-section-heading">
          <span>🚚</span>
          <div>
            <h2>Order Tracking</h2>
            <p>{order.expected || "Delivery updates will appear here."}</p>
          </div>
        </div>

        {order.status === "Cancelled" ? (
          <div className="order-cancelled-message">
            <span>✕</span>
            <div>
              <strong>Order Cancelled</strong>
              <p>This order has been cancelled.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="order-timeline">
              {steps.map((step, i) => (
                <div
                  className={`order-timeline-step ${i <= active ? "completed" : ""}`}
                  key={step}
                >
                  <div className="order-timeline-circle">
                    {i < active ? "✓" : i + 1}
                  </div>
                  <span>{step}</span>
                  {i !== steps.length - 1 && (
                    <div className="order-timeline-line" />
                  )}
                </div>
              ))}
            </div>

            <div className="order-tracking-updates">
              <h3>Shipment Updates</h3>

              {trackingUpdates.map((update, index) => (
                <div
                  className={`order-update ${update.completed ? "done" : ""}`}
                  key={update.title}
                >
                  <span className="order-update-dot">
                    {update.completed ? "✓" : index + 1}
                  </span>
                  <div>
                    <strong>{update.title}</strong>
                    <p>{update.description}</p>
                    <small>
                      {update.completed
                        ? formatDate(update.date)
                        : "Awaiting update"}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* SHIPMENT DETAILS */}
      {order.status !== "Cancelled" && (
        <section className="order-shipment-card">
          <div className="order-section-heading">
            <span>📍</span>
            <div>
              <h2>Shipment Details</h2>
              <p>Delivery and courier information</p>
            </div>
          </div>

          <div className="order-shipment-grid">
            <div>
              <span>Courier Partner</span>
              <strong>{order.courier || "Not assigned yet"}</strong>
            </div>
            <div>
              <span>Tracking ID</span>
              <strong>{order.trackingId || "Not available yet"}</strong>
            </div>
            <div>
              <span>Expected Delivery</span>
              <strong>
                {order.estimatedDelivery
                  ? formatDate(order.estimatedDelivery)
                  : order.expected || "To be confirmed"}
              </strong>
            </div>
            <div>
              <span>Payment Method</span>
              <strong>{order.paymentMethod || "Not specified"}</strong>
            </div>
          </div>
        </section>
      )}

      {/* ORDER ITEMS */}
      <section className="order-items-card">
        <div className="order-section-heading">
          <span>🛍️</span>
          <div>
            <h2>Items in This Order</h2>
            <p>{items.length} Products</p>
          </div>
        </div>

        <div className="order-details-products">
          {items.map((item, i) => (
            <div className="order-details-product" key={item.id || i}>
              <div className="order-details-product-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  item.emoji || "📦"
                )}
              </div>

              <div className="order-details-product-info">
                <strong>{item.name || "Product"}</strong>
                <span>Quantity: {item.quantity || 1}</span>
                <b>
                  ₹{Number(item.price || 0).toLocaleString("en-IN")}
                </b>
              </div>

              <strong className="order-item-subtotal">
                ₹{(
                  Number(item.price || 0) * Number(item.quantity || 1)
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}
        </div>

        <div className="order-details-total">
          <span>Order Total</span>
          <strong>₹{Number(total).toLocaleString("en-IN")}</strong>
        </div>
      </section>

      {/* RETURN / REFUND */}
      {order.status === "Delivered" && (
        <section className="order-return-card">
          <div>
            <h2>Need to return this order?</h2>
            <p>
              If you have an issue with your product, you can submit a
              return or refund request.
            </p>
            {order.returnStatus === "Requested" && (
              <span className="order-return-status">
                ✓ Return request submitted
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={requestReturn}
            disabled={order.returnStatus === "Requested"}
          >
            {order.returnStatus === "Requested"
              ? "Request Submitted"
              : "Request Return / Refund"}
          </button>
        </section>
      )}

      {/* CANCEL ORDER */}
      {["Processing", "Shipped"].includes(order.status) && (
        <div className="order-cancel-section">
          <button
            type="button"
            className="order-cancel-button"
            onClick={cancel}
          >
            ✕ Cancel Order
          </button>
        </div>
      )}

    </main>
  );
}
