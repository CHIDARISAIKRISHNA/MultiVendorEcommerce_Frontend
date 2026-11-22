
import React from "react";
import { Link } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";
import "../../components/Compare.css";

function Compare() {
  const {
    compareItems,
    removeFromCompare,
    clearCompare
  } = useCompare();

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const getDiscount = (product) => {
    if (!product.oldPrice || product.oldPrice <= product.price) {
      return 0;
    }

    return Math.round(
      ((product.oldPrice - product.price) /
        product.oldPrice) * 100
    );
  };

  if (compareItems.length === 0) {
    return (
      <div className="compare-page">
        <div className="compare-empty">
          <div className="compare-empty-icon">⇄</div>
          <h2>No products to compare</h2>
          <p>
            Add products to compare their prices,
            ratings and features.
          </p>
          <Link to="/customer/dashboard" className="compare-shop-btn">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  const rows = [
    {
      label: "Product name",
      value: (p) => p.name
    },
    {
      label: "Category",
      value: (p) => p.category || "Not specified"
    },
    {
      label: "Price",
      value: (p) => formatPrice(p.price)
    },
    {
      label: "Original price",
      value: (p) =>
        p.oldPrice ? formatPrice(p.oldPrice) : "Not available"
    },
    {
      label: "Discount",
      value: (p) => `${getDiscount(p)}%`
    },
    {
      label: "Customer rating",
      value: (p) => `⭐ ${p.rating || "Not rated"}`
    },
    {
      label: "Product tag",
      value: (p) => p.tag || "Standard"
    },
    {
      label: "Description",
      value: (p) => p.description || "No description available"
    }
  ];

  return (
    <div className="compare-page">

      <div className="compare-heading">
        <div>
          <span className="compare-eyebrow">
            SHOPSTACK SMART SHOPPING
          </span>

          <h1>Compare Products</h1>

          <p>
            Compare products and choose what works best for you.
          </p>
        </div>

        <button
          className="compare-clear-btn"
          onClick={clearCompare}
        >
          Clear All
        </button>
      </div>

      <div className="compare-count">
        {compareItems.length} of 4 products selected
      </div>

      <div className="compare-table-wrapper">
        <table className="compare-table">

          <thead>
            <tr>
              <th className="compare-label-cell">
                Product Details
              </th>

              {compareItems.map((product) => (
                <th key={product.id}>
                  <div className="compare-product">

                    <button
                      className="compare-remove"
                      onClick={() =>
                        removeFromCompare(product.id)
                      }
                    >
                      ×
                    </button>

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <h3>{product.name}</h3>

                    <Link
                      to={`/product/${product.id}`}
                      className="compare-view-btn"
                    >
                      View Product
                    </Link>

                  </div>
                </th>
              ))}

            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="compare-row-label">
                  {row.label}
                </td>

                {compareItems.map((product) => (
                  <td key={product.id}>
                    {row.value(product)}
                  </td>
                ))}
              </tr>
            ))}

            <tr>
              <td className="compare-row-label">
                Availability
              </td>

              {compareItems.map((product) => (
                <td key={product.id}>
                  <span className="compare-available">
                    Check with seller
                  </span>
                </td>
              ))}
            </tr>

          </tbody>

        </table>
      </div>

      <div className="compare-footer">
        <p>
          Choose products carefully and enjoy smarter shopping.
        </p>

        <Link to="/customer/dashboard">
          Continue Shopping →
        </Link>
      </div>

    </div>
  );
}

export default Compare;
