
import React, { useState, useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import { CheckCircle, Heart } from "lucide-react";

const WishlistButton = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isWishlisted } =
    useWishlist();

  const active = isWishlisted(product.id);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (active) {
      removeFromWishlist(product.id);
      setToast({
        message: "Removed from Wishlist!",
        type: "removed",
      });
    } else {
      addToWishlist(product);
      setToast({
        message: "Added to Wishlist!",
        type: "added",
      });
    }
  };

  return (
    <>
      <button
        type="button"
        className={`wishlist-btn ${active ? "active" : ""}`}
        onClick={toggleWishlist}
        aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
        title={active ? "Remove from wishlist" : "Add to wishlist"}
      >
        {active ? "♥" : "♡"}
      </button>

      {toast && (
        <div className={`wishlist-toast ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === "added" ? (
              <Heart size={21} fill="white" />
            ) : (
              <CheckCircle size={21} />
            )}
          </div>

          <div className="toast-content">
            <strong>{toast.message}</strong>
            <small>
              {toast.type === "added"
                ? "Product saved successfully."
                : "Product removed successfully."}
            </small>
          </div>
        </div>
      )}
    </>
  );
};

export default WishlistButton;
