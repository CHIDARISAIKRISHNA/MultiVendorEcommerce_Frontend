
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Filter
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import "./styles/Vendor.css";

export default function ManageProducts() {
  const { user, profile } = useAuth();

  const vendorId = user?.uid || profile?.uid;

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    stock: ""
  });

  // Read products safely
  function readProducts() {
    try {
      const data = JSON.parse(
        localStorage.getItem("products") || "[]"
      );

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Product storage error:", error);
      return [];
    }
  }

  // Generate an ID for older products without IDs
  function createProductId() {
    return globalThis.crypto?.randomUUID
      ? globalThis.crypto.randomUUID()
      : `product-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  // Load products
  function loadProducts() {
    const savedProducts = readProducts();

    // Normalize older product records
    const normalizedProducts = savedProducts.map(product => ({
      ...product,
      id: product.id || product.productId || createProductId()
    }));

    // Persist generated IDs to the original storage
    const needsUpdate = normalizedProducts.some(
      (product, index) =>
        product.id !== savedProducts[index]?.id
    );

    if (needsUpdate) {
      localStorage.setItem(
        "products",
        JSON.stringify(normalizedProducts)
      );
    }

    // Show this vendor's products and legacy demo products
    const vendorProducts = normalizedProducts.filter(product =>
      !product.vendorId || product.vendorId === vendorId
    );

    setProducts(vendorProducts);
  }

  // Initial load and refresh when vendor changes
  useEffect(() => {
    loadProducts();
  }, [vendorId]);

  // Listen for changes from AddProduct and other tabs
  useEffect(() => {
    const refreshProducts = () => loadProducts();

    const handleStorage = (event) => {
      if (event.key === "products") {
        loadProducts();
      }
    };

    window.addEventListener(
      "shopstack-products-updated",
      refreshProducts
    );

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "shopstack-products-updated",
        refreshProducts
      );

      window.removeEventListener("storage", handleStorage);
    };
  }, [vendorId]);

  // Category options
  const categories = [
    "All",
    ...new Set(
      products
        .map(product => product.category)
        .filter(Boolean)
    )
  ];

  // Search and filter
  const filteredProducts = products.filter(product => {
    const productName = (
      product.name || product.title || ""
    ).toLowerCase();

    const matchesSearch = productName.includes(
      search.toLowerCase().trim()
    );

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  // Summary
  const totalProducts = products.length;

  const inStock = products.filter(
    product => Number(product.stock) > 0
  ).length;

  const lowStock = products.filter(
    product =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= 5
  ).length;

  const outOfStock = products.filter(
    product => Number(product.stock) === 0
  ).length;

  // Start editing
  function startEdit(product) {
    setEditingId(product.id);

    setEditForm({
      name: product.name || product.title || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? 0)
    });
  }

  // Cancel editing
  function cancelEdit() {
    setEditingId(null);

    setEditForm({
      name: "",
      price: "",
      stock: ""
    });
  }

  // Update form fields
  function handleEditChange(e) {
    const { name, value } = e.target;

    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Save product changes
  function handleUpdate(id) {
    if (
      !editForm.name.trim() ||
      editForm.price === "" ||
      editForm.stock === "" ||
      !Number.isFinite(Number(editForm.price)) ||
      !Number.isFinite(Number(editForm.stock)) ||
      Number(editForm.price) <= 0 ||
      Number(editForm.stock) < 0 ||
      !Number.isInteger(Number(editForm.stock))
    ) {
      alert("Please enter valid product details.");
      return;
    }

    const savedProducts = readProducts();

    const updatedProducts = savedProducts.map(product => {
      const productId = product.id || product.productId;

      if (productId === id) {
        return {
          ...product,
          id,
          name: editForm.name.trim(),
          price: Number(editForm.price),
          stock: Number(editForm.stock)
        };
      }

      return product;
    });

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );

    cancelEdit();
    loadProducts();

    window.dispatchEvent(
      new Event("shopstack-products-updated")
    );
  }

  // Delete product
  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    const savedProducts = readProducts();

    const updatedProducts = savedProducts.filter(
      product => (product.id || product.productId) !== id
    );

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );

    if (editingId === id) {
      cancelEdit();
    }

    loadProducts();

    window.dispatchEvent(
      new Event("shopstack-products-updated")
    );
  }

  return (
    <div className="vendor-container">

      {/* Heading */}
      <div className="vendor-page-heading">

        <div>
          <span className="vendor-eyebrow">
            INVENTORY MANAGEMENT
          </span>

          <h2>Manage Products</h2>

          <p>
            Track your products, update prices and manage inventory.
          </p>
        </div>

        <Link
          to="/vendor/add-product"
          className="vendor-primary-btn"
        >
          <Plus size={18} />
          Add New Product
        </Link>

      </div>

      {/* Statistics */}
      <div className="vendor-stats">

        <div className="vendor-card">
          <div className="vendor-stat-top">
            <span>Total Products</span>
            <Package size={20} />
          </div>
          <h2>{totalProducts}</h2>
          <p>Products in your catalog</p>
        </div>

        <div className="vendor-card">
          <div className="vendor-stat-top">
            <span>In Stock</span>
            <Check size={20} />
          </div>
          <h2>{inStock}</h2>
          <p>Products available</p>
        </div>

        <div className="vendor-card">
          <div className="vendor-stat-top">
            <span>Low Stock</span>
            <Filter size={20} />
          </div>
          <h2>{lowStock}</h2>
          <p>Products needing restock</p>
        </div>

        <div className="vendor-card">
          <div className="vendor-stat-top">
            <span>Out of Stock</span>
            <Package size={20} />
          </div>
          <h2>{outOfStock}</h2>
          <p>Products unavailable</p>
        </div>

      </div>

      {/* Product list */}
      <div className="vendor-products-section">

        <div className="vendor-products-heading">

          <div>
            <h3>Your Products</h3>
            <p>
              Manage all your listed products.
            </p>
          </div>

          <span className="vendor-result-count">
            {filteredProducts.length} products
          </span>

        </div>

        {/* Search and filters */}
        <div className="vendor-filter-bar">

          <div className="vendor-search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            {categories.map(item => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>

        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 ? (

          <div className="vendor-empty-state">

            <div className="vendor-empty-icon">
              <Package size={34} />
            </div>

            <h3>
              {products.length === 0
                ? "No products added yet"
                : "No matching products"}
            </h3>

            <p>
              {products.length === 0
                ? "Start adding products to your store."
                : "Try another search or category."}
            </p>

            {products.length === 0 && (
              <Link
                to="/vendor/add-product"
                className="vendor-primary-btn"
              >
                <Plus size={17} />
                Add Your First Product
              </Link>
            )}

          </div>

        ) : (

          /* Products table */
          <div className="vendor-table-scroll">

            <table className="vendor-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Approval</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map(product => (

                  <tr key={product.id}>

                    {/* Product details */}
                    <td>
                      <div className="vendor-product-info">

                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name || product.title || "Product"}
                            onError={e => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="vendor-product-placeholder">
                            <Package size={23} />
                          </div>
                        )}

                        <div className="vendor-product-name">

                          {editingId === product.id ? (
                            <input
                              name="name"
                              value={editForm.name}
                              onChange={handleEditChange}
                              aria-label="Product name"
                            />
                          ) : (
                            <strong>
                              {product.name || product.title || "Unnamed Product"}
                            </strong>
                          )}

                          <small>
                            ID: {product.id.slice(0, 8)}
                          </small>

                        </div>

                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="vendor-category">
                        {product.category || "General"}
                      </span>
                    </td>

                    {/* Price */}
                    <td>
                      {editingId === product.id ? (
                        <input
                          type="number"
                          name="price"
                          min="0.01"
                          step="0.01"
                          value={editForm.price}
                          onChange={handleEditChange}
                          aria-label="Product price"
                        />
                      ) : (
                        <strong>
                          ₹{Number(product.price || 0).toLocaleString("en-IN")}
                        </strong>
                      )}
                    </td>

                    {/* Stock */}
                    <td>
                      {editingId === product.id ? (
                        <input
                          type="number"
                          name="stock"
                          min="0"
                          step="1"
                          value={editForm.stock}
                          onChange={handleEditChange}
                          aria-label="Product stock"
                        />
                      ) : (
                        <span className={
                          Number(product.stock) === 0
                            ? "stock-out"
                            : Number(product.stock) <= 5
                            ? "stock-low"
                            : "stock-good"
                        }>
                          {product.stock ?? 0} units
                        </span>
                      )}
                    </td>

                    {/* Approval */}
                    <td>
                      <span className={
                        product.approved
                          ? "approval-approved"
                          : "approval-pending"
                      }>
                        {product.approved ? "Approved" : "Pending"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="vendor-action-buttons">

                        {editingId === product.id ? (

                          <>
                            <button
                              type="button"
                              className="vendor-save-btn"
                              onClick={() => handleUpdate(product.id)}
                              title="Save changes"
                            >
                              <Check size={15} />
                              Save
                            </button>

                            <button
                              type="button"
                              className="vendor-edit-btn"
                              onClick={cancelEdit}
                              title="Cancel editing"
                            >
                              <X size={15} />
                              Cancel
                            </button>
                          </>

                        ) : (

                          <button
                            type="button"
                            className="vendor-edit-btn"
                            onClick={() => startEdit(product)}
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                        )}

                        <button
                          type="button"
                          className="vendor-delete-btn"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}
