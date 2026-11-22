
import React from "react";
import { useShop } from "../../context/ShopContext";
import "../../styles.css";

export default function RecentlyViewed() {
  const { recentlyViewed } = useShop();

  return (
    <main className="recently-page">

      {/* HEADER */}
      <div className="recently-heading">
        <div>
          <h1>Recently Viewed</h1>
          <p>Products you viewed recently.</p>
        </div>

        <span className="recently-count">
          👁 {recentlyViewed.length} Products
        </span>
      </div>

      {/* PRODUCTS */}
      {recentlyViewed.length > 0 ? (

        <div className="recently-grid">

          {recentlyViewed.map((p) => (
            <article className="recently-card" key={p.id}>

              <div className="recently-image">
                {p.emoji || "📦"}
              </div>

              <div className="recently-info">
                <strong>{p.name}</strong>

                <b>
                  ₹{p.price.toLocaleString("en-IN")}
                </b>
              </div>

            </article>
          ))}

        </div>

      ) : (

        <div className="recently-empty">
          <span>👀</span>
          <h2>No Recently Viewed Products</h2>
          <p>
            Products you explore will appear here.
          </p>
        </div>

      )}

    </main>
  );
}
