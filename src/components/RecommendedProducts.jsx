
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import WishlistButton from "./WishlistButton";
import "./RecommendedProducts.css";

function RecommendedProducts({ currentProduct }) {
  const { addToCart } = useCart();

  const recommendations = useMemo(() => {
    if (!currentProduct) return [];

    const otherProducts = products.filter(
      (p) => String(p.id) !== String(currentProduct.id)
    );

    const sameCategory = otherProducts
      .filter(
        (p) => p.category === currentProduct.category
      )
      .sort((a, b) => b.rating - a.rating);

    const otherPopular = otherProducts
      .filter(
        (p) => p.category !== currentProduct.category
      )
      .sort((a, b) => b.rating - a.rating);

    return [...sameCategory, ...otherPopular].slice(0, 8);
  }, [currentProduct]);

  if (!recommendations.length) return null;

  return (
    <section className="recommended-section">

      <div className="recommended-heading">
        <div>
          <span>HANDPICKED FOR YOU</span>
          <h2>You May Also Like</h2>
          <p>Discover more thoughtful choices from SHOPSTACK.</p>
        </div>

        <Link to="/customer/dashboard">
          Explore all →
        </Link>
      </div>

      <div className="recommended-grid">

        {recommendations.map((product) => (

          <div className="recommended-card" key={product.id}>

            <div className="recommended-image">

              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
              </Link>

              <div className="recommended-wishlist">
                <WishlistButton product={product} />
              </div>

              {product.tag && (
                <span className="recommended-tag">
                  {product.tag}
                </span>
              )}

            </div>

            <div className="recommended-info">

              <small>{product.category}</small>

              <Link
                to={`/product/${product.id}`}
                className="recommended-name"
              >
                {product.name}
              </Link>

              <div className="recommended-rating">
                ⭐ {product.rating || "New"}
              </div>

              <div className="recommended-price">
                <strong>
                  ₹{product.price.toLocaleString("en-IN")}
                </strong>

                {product.oldPrice && (
                  <del>
                    ₹{product.oldPrice.toLocaleString("en-IN")}
                  </del>
                )}
              </div>

              <button
                className="recommended-cart-btn"
                onClick={() => addToCart(product)}
              >
                + Add to Cart
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default RecommendedProducts;
