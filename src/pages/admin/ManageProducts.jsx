
import React, { useEffect, useMemo, useState } from "react";
import {
  Package,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Check,
  X,
  RefreshCw
} from "lucide-react";

import "../admin/styles/Admin.css";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Read products from the same localStorage used by AddProduct.jsx
  const fetchProducts = () => {
    try {
     const saved = JSON.parse(
  localStorage.getItem("products") || "[]"
);

if (!Array.isArray(saved)) {
  throw new Error("Invalid product storage data");
}

      setProducts(Array.isArray(saved) ? saved : []);
    } catch (error) {
      console.error("Unable to load products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Listen for product changes
    window.addEventListener(
      "shopstack-products-updated",
      fetchProducts
    );

    // Listen for changes from another browser tab
    window.addEventListener("storage", fetchProducts);

    return () => {
      window.removeEventListener(
        "shopstack-products-updated",
        fetchProducts
      );

      window.removeEventListener("storage", fetchProducts);
    };
  }, []);

  // Approve or reject products
  const updateApproval = (id, status) => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("products") || "[]"
      );

      const updated = saved.map(product => {
        if (product.id !== id) return product;

        return {
          ...product,
          approved: status === "approved",
          approvalStatus: status
        };
      });

      localStorage.setItem(
        "products",
        JSON.stringify(updated)
      );

      window.dispatchEvent(
        new Event("shopstack-products-updated")
      );

      fetchProducts();

      alert(
        status === "approved"
          ? "Product approved successfully!"
          : "Product rejected successfully!"
      );
    } catch (error) {
      console.error("Approval error:", error);
      alert("Unable to update product approval.");
    }
  };

  // Product approval status
  const getStatus = product => {
    if (product.approvalStatus) {
      return product.approvalStatus;
    }

    return product.approved ? "approved" : "pending";
  };

  // Statistics
  const approvedCount = products.filter(
    p => getStatus(p) === "approved"
  ).length;

  const pendingCount = products.filter(
    p => getStatus(p) === "pending"
  ).length;

  const rejectedCount = products.filter(
    p => getStatus(p) === "rejected"
  ).length;

  // Search and filter
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const status = getStatus(product);

      const matchesSearch =
        (product.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (product.category || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (product.vendorId || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        status === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  return (
    <div className="admin-container product-management">

      {/* Heading */}
      <div className="product-admin-heading">
        <div>
          <span className="product-admin-eyebrow">
            CATALOG MANAGEMENT
          </span>
          <h1>Manage Products</h1>
          <p>
            Review vendor products and manage product approvals.
          </p>
        </div>

        <button
          className="product-refresh-btn"
          onClick={fetchProducts}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="product-admin-stats">

        <div className="product-admin-stat">
          <Package size={23} />
          <div>
            <h2>{products.length}</h2>
            <p>Total Products</p>
          </div>
        </div>

        <div className="product-admin-stat pending">
          <Clock size={23} />
          <div>
            <h2>{pendingCount}</h2>
            <p>Pending Approval</p>
          </div>
        </div>

        <div className="product-admin-stat approved">
          <CheckCircle size={23} />
          <div>
            <h2>{approvedCount}</h2>
            <p>Approved Products</p>
          </div>
        </div>

        <div className="product-admin-stat rejected">
          <XCircle size={23} />
          <div>
            <h2>{rejectedCount}</h2>
            <p>Rejected Products</p>
          </div>
        </div>

      </div>

      {/* Products */}
      <section className="product-admin-card">

        <div className="product-admin-card-heading">
          <div>
            <h3>All Products</h3>
            <p>
              {filteredProducts.length} products found
            </p>
          </div>
        </div>

        {/* Search and filter */}
        <div className="product-admin-toolbar">

          <div className="product-admin-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search products or vendor ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="All">All Products</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

        </div>

        {/* Table */}
        <div className="product-admin-table-wrap">

          <table className="product-admin-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Vendor ID</th>
                <th>Approval</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="7" className="product-admin-empty">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="product-admin-empty">
                    <Package size={35} />
                    <strong>No products found</strong>
                    <span>
                      Products added by vendors will appear here.
                    </span>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const status = getStatus(product);

                  return (
                    <tr key={product.id}>

                      <td>
                        <div className="product-admin-info">
                          <img
                            src={
                              product.image ||
                              "https://placehold.co/70x70?text=Product"
                            }
                            alt={product.name}
                            onError={e => {
                              e.currentTarget.src =
                                "https://placehold.co/70x70?text=Product";
                            }}
                          />

                          <div>
                            <strong>{product.name}</strong>
                            <span>
                              {String(product.id || "").slice(-10)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>{product.category || "General"}</td>

                      <td>
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </td>

                      <td>{product.stock ?? 0}</td>

                      <td className="product-vendor-id">
                        {product.vendorId || "N/A"}
                      </td>

                      <td>
                        <span className={`product-approval ${status}`}>
                          {status}
                        </span>
                      </td>

                      <td>
                        <div className="product-admin-actions">

                          {status !== "approved" && (
                            <button
                              className="product-approve-btn"
                              onClick={() =>
                                updateApproval(product.id, "approved")
                              }
                              title="Approve"
                            >
                              <Check size={16} />
                              Approve
                            </button>
                          )}

                          {status !== "rejected" && (
                            <button
                              className="product-reject-btn"
                              onClick={() =>
                                updateApproval(product.id, "rejected")
                              }
                              title="Reject"
                            >
                              <X size={16} />
                              Reject
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}
