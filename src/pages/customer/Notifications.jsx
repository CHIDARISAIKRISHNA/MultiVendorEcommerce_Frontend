
import React from "react";
import { useShop } from "../../context/ShopContext";
import "../../styles.css";

export default function Notifications() {
  const { notifications, setNotifications } = useShop();

  const markAll = () => {
    setNotifications((n) =>
      n.map((x) => ({ ...x, read: true }))
    );
  };

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  return (
    <main className="notifications-page">

      {/* HEADER */}
      <div className="notifications-header">

        <div>
          <h1>Notifications</h1>
          <p>Updates about your account and orders.</p>
        </div>

        <div className="notifications-header-right">
          <span className="notifications-count">
            🔔 {unreadCount} Unread
          </span>

          <button
            className="notifications-mark-btn"
            onClick={markAll}
            disabled={unreadCount === 0}
          >
            ✓ Mark All as Read
          </button>
        </div>

      </div>

      {/* NOTIFICATION LIST */}
      <div className="notifications-list">

        {notifications.length > 0 ? (

          notifications.map((n) => (
            <article
              className={`notification-card ${n.read ? "is-read" : "is-unread"}`}
              key={n.id}
            >

              <div className={`notification-icon ${n.read ? "read-icon" : "unread-icon"}`}>
                {n.read ? "✓" : "🔔"}
              </div>

              <div className="notification-content">

                <div className="notification-title-row">
                  <strong>{n.title}</strong>

                  {!n.read && (
                    <span className="notification-new-badge">
                      NEW
                    </span>
                  )}
                </div>

                <p>{n.message}</p>

                <small>🕒 {n.date}</small>

              </div>

              {!n.read && (
                <span className="notification-dot"></span>
              )}

            </article>
          ))

        ) : (

          <div className="notifications-empty">
            <span>🔔</span>
            <h2>No Notifications Yet</h2>
            <p>
              Your account and order updates will appear here.
            </p>
          </div>

        )}

      </div>

    </main>
  );
}
