
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ShoppingCart,
  Zap,
  Star,
  CheckCircle
} from "lucide-react";

import { useCart } from "../context/CartContext";
import WishlistButton from "./WishlistButton";
import CompareButton from "./CompareButton";

export default function ProductCard({ product }) {

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [cartToast, setCartToast] = useState(false);

  if (!product) return null;

  const price = Number(product.price ?? 0);
  const oldPrice = Number(product.oldPrice ?? 0);
  const rating = Number(product.rating ?? 0);

  const image =
    product.image ||
    "https://placehold.co/400x300?text=Product";

  // STOCK CHECK
  const isOutOfStock =
    product.stock !== undefined &&
    product.stock !== null &&
    Number(product.stock) <= 0;

  // AUTO HIDE TOAST
  useEffect(() => {
    if (!cartToast) return;

    const timer = setTimeout(() => {
      setCartToast(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [cartToast]);

  // ADD TO CART
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(product);
    setCartToast(true);
  };

  // BUY NOW
  const handleBuyNow = () => {
    if (isOutOfStock) return;

    addToCart(product);
    navigate("/checkout");
  };

  return (
    <article className="product-card">

      {/* CART SUCCESS NOTIFICATION */}
      {cartToast && (
        <div className="wishlist-toast added cart-toast">

          <div className="toast-icon">
            <CheckCircle size={21} />
          </div>

          <div className="toast-content">
            <strong>Added to Cart!</strong>

            <small>
              {product.name} added successfully.
            </small>
          </div>

        </div>
      )}

      {/* PRODUCT IMAGE */}
      <div className="product-image-wrap">

        <Link to={`/product/${product.id}`}>
          <img
            src={image}
            alt={product.name || "Product"}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/400x300?text=Product";
            }}
          />
        </Link>

        <WishlistButton product={product} />

        {product.tag && (
          <span className="product-tag">
            {product.tag}
          </span>
        )}

      </div>

      {/* COMPARE */}
      <div className="product-card-actions">
        <CompareButton product={product} />
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="product-info">

        <div className="product-meta">

          <span>
            {product.category || "General"}
          </span>

          <span className="rating">
            <Star size={13} fill="currentColor" />
            {rating > 0 ? rating.toFixed(1) : "New"}
          </span>

        </div>

        <Link
          to={`/product/${product.id}`}
          className="product-name"
        >
          {product.name || "Unnamed Product"}
        </Link>

        {/* PRICE */}
        <div className="price-row">

          <strong>
            ₹{price.toLocaleString("en-IN")}
          </strong>

          {oldPrice > price && (
            <del>
              ₹{oldPrice.toLocaleString("en-IN")}
            </del>
          )}

        </div>

        {/* PRODUCT BUTTONS */}
        <div className="product-buttons">

          {/* ADD TO CART */}
          <button
            type="button"
            className="btn-secondary"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart size={16} />

            {isOutOfStock
              ? "Out of stock"
              : "Add to cart"}
          </button>

          {/* BUY NOW */}
          <button
            type="button"
            className="btn-buy"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            <Zap size={15} />

            {isOutOfStock
              ? "Out of stock"
              : "Buy now"}
          </button>

        </div>

      </div>

    </article>
  );
}
