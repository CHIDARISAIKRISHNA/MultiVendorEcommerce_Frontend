
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Package,
  ImagePlus
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import "./styles/Vendor.css";

const initialForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  description: "",
  image: ""
};

export default function AddProduct() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const vendorId = user?.uid || profile?.uid;

  function handleChange(e) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    setMessage("");
    setError("");
  }

  function createProductId() {
    return globalThis.crypto?.randomUUID
      ? globalThis.crypto.randomUUID()
      : `product-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!vendorId) {
      setError("Please log in using your vendor account.");
      return;
    }

    if (
      !form.name.trim() ||
      !form.category ||
      !form.description.trim() ||
      form.price === "" ||
      form.stock === "" ||
      !Number.isFinite(Number(form.price)) ||
      !Number.isFinite(Number(form.stock)) ||
      Number(form.price) <= 0 ||
      Number(form.stock) < 0 ||
      !Number.isInteger(Number(form.stock))
    ) {
      setError("Please enter valid details in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const savedProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );

      if (!Array.isArray(savedProducts)) {
        throw new Error("Invalid product storage data.");
      }

      const newProduct = {
        id: createProductId(),
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description.trim(),
        image: form.image.trim(),
        vendorId,
        approved: false,
        createdAt: new Date().toISOString()
      };

      const updatedProducts = [
        ...savedProducts,
        newProduct
      ];

      localStorage.setItem(
        "products",
        JSON.stringify(updatedProducts)
      );

      // Notify other vendor components
      window.dispatchEvent(
        new Event("shopstack-products-updated")
      );

      setForm(initialForm);
      setMessage("Product added successfully!");

    } catch (err) {
      console.error("Add product error:", err);
      setError(err.message || "Unable to add product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="vendor-page">

      {/* Page heading */}
      <div className="vendor-page-title">

        <Link
          to="/vendor/products"
          className="vendor-back"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <span className="vendor-eyebrow">
          PRODUCT MANAGEMENT
        </span>

        <h1>Add New Product</h1>

        <p>
          Add a new item to your store catalog.
        </p>

      </div>

      {/* Form card */}
      <div className="vendor-form-card">

        <div className="vendor-form-heading">

          <div className="stat-icon green">
            <Package size={23} />
          </div>

          <div>
            <h3>Product Information</h3>
            <p>
              Enter the details of your product below.
            </p>
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="vendor-form"
        >

          <div className="vendor-form-grid">

            {/* Product name */}
            <div className="vendor-field">
              <label htmlFor="product-name">
                Product Name *
              </label>

              <input
                id="product-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Category */}
            <div className="vendor-field">
              <label htmlFor="product-category">
                Category *
              </label>

              <select
                id="product-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Beauty">Beauty</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Accessories">Accessories</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Price */}
            <div className="vendor-field">
              <label htmlFor="product-price">
                Price (₹) *
              </label>

              <input
                id="product-price"
                type="number"
                name="price"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter product price"
                required
              />
            </div>

            {/* Stock */}
            <div className="vendor-field">
              <label htmlFor="product-stock">
                Stock Quantity *
              </label>

              <input
                id="product-stock"
                type="number"
                name="stock"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                placeholder="Enter available quantity"
                required
              />
            </div>

            {/* Image */}
            <div className="vendor-field full">

              <label htmlFor="product-image">
                Product Image URL
              </label>

              <div className="vendor-image-input">
                <ImagePlus size={18} />

                <input
                  id="product-image"
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/product.jpg"
                />
              </div>

              {form.image && (
                <div className="vendor-preview-wrapper">
                  <img
                    className="vendor-image-preview"
                    src={form.image}
                    alt="Product preview"
                    onError={e => {
                      e.currentTarget.style.display = "none";
                    }}
                    onLoad={e => {
                      e.currentTarget.style.display = "block";
                    }}
                  />
                </div>
              )}

            </div>

            {/* Description */}
            <div className="vendor-field full">

              <label htmlFor="product-description">
                Product Description *
              </label>

              <textarea
                id="product-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows={5}
                required
              />

            </div>

          </div>

          {/* Messages */}
          {message && (
            <div className="vendor-message success">
              {message}
            </div>
          )}

          {error && (
            <div className="vendor-message error">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="vendor-form-actions">

            <button
              type="button"
              className="vendor-cancel-btn"
              onClick={() => navigate("/vendor/products")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="vendor-primary-btn"
              disabled={submitting}
            >
              <Plus size={18} />
              {submitting ? "Adding..." : "Add Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
