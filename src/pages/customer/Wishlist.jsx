
import React from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import "../../styles.css";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <main className="wishlist-page">

      {/* HEADER */}
      <div className="wishlist-heading">
        <div>
          <h1>My Wishlist ❤️</h1>
          <p>Products you have saved for later.</p>
        </div>

        <span className="wishlist-count">
          {wishlist.length} Items
        </span>
      </div>

      {/* WISHLIST PRODUCTS */}
      {wishlist.length > 0 ? (

        <div className="wishlist-grid">

          {wishlist.map((p) => (
            <article className="wishlist-card" key={p.id}>

              {/* PRODUCT IMAGE */}
              <Link to={`/product/${p.id}`}>
                <div className="wishlist-product-image">
                  <img
                    src={
                      p.image ||
                      "https://placehold.co/300x250?text=Product"
                    }
                    alt={p.name || "Product"}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/300x250?text=Product";
                    }}
                  />
                </div>
              </Link>

              {/* PRODUCT DETAILS */}
              <div className="wishlist-product-info">
                <strong>{p.name || "Unnamed Product"}</strong>

                <b>
                  ₹{Number(p.price || 0).toLocaleString("en-IN")}
                </b>
              </div>

              {/* ACTIONS */}
              <div className="wishlist-actions">

                <Link
                  to={`/product/${p.id}`}
                  className="wishlist-view-btn"
                >
                  <ShoppingBag size={15} />
                  View Product
                </Link>

                <button
                  type="button"
                  className="wishlist-remove-btn"
                  onClick={() => removeFromWishlist(p.id)}
                >
                  <Trash2 size={15} />
                  Remove
                </button>

              </div>

            </article>
          ))}

        </div>

      ) : (

        <div className="wishlist-empty">
          <Heart size={55} color="#ef476f" fill="#ef476f" />

          <h2>Your wishlist is empty</h2>

          <p>
            Save products you love to find them here.
          </p>

          <Link to="/customer/dashboard">
            Continue Shopping
          </Link>
        </div>

      )}

    </main>
  );
}
