
import React, { useEffect, useState } from "react";
import { Store, Save, User, MapPin, Phone, Mail } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getVendorProfile,
  saveVendorProfile,
  getVendorId
} from "../../utils/vendorStorage";

import "./styles/Vendor.css";

export default function VendorProfile() {
  const { user, profile } = useAuth();

  const [form, setForm] = useState({
    storeName: "",
    phone: "",
    address: "",
    description: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = getVendorProfile();

    setForm({
      storeName: saved.storeName || profile?.storeName || "",
      phone: saved.phone || "",
      address: saved.address || "",
      description: saved.description || ""
    });
  }, [user, profile]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleSave(e) {
    e.preventDefault();

    saveVendorProfile({
      ...form,
      uid: getVendorId(user, profile),
      email: user?.email || ""
    });

    setMessage("Your store profile has been updated successfully!");
  }

  return (
    <div className="vendor-page">

      <div className="vendor-page-title">
        <span className="vendor-eyebrow">STORE SETTINGS</span>
        <h1>Store Profile</h1>
        <p>Manage your store details and public information.</p>
      </div>

      <div className="vendor-profile-layout">

        <div className="vendor-profile-card">
          <div className="vendor-profile-avatar">
            <Store size={34} />
          </div>
          <h2>{form.storeName || "Your Store"}</h2>
          <p>{user?.email || "Vendor account"}</p>
          <span className="vendor-status delivered">Vendor Account</span>
          <div className="vendor-profile-note">
            Your store information helps customers identify your business.
          </div>
        </div>

        <div className="vendor-form-card">
          <div className="vendor-form-heading">
            <div className="stat-icon green">
              <Store size={22} />
            </div>
            <div>
              <h3>Store Information</h3>
              <p>Keep your business information up to date.</p>
            </div>
          </div>

          <form className="vendor-form" onSubmit={handleSave}>

            <div className="vendor-form-grid">

              <div className="vendor-field full">
                <label><Store size={15} /> Store Name *</label>
                <input
                  name="storeName"
                  value={form.storeName}
                  onChange={handleChange}
                  placeholder="Enter your store name"
                  required
                />
              </div>

              <div className="vendor-field">
                <label><User size={15} /> Vendor Name</label>
                <input
                  value={user?.displayName || profile?.name || "Vendor"}
                  disabled
                />
              </div>

              <div className="vendor-field">
                <label><Mail size={15} /> Email</label>
                <input value={user?.email || ""} disabled />
              </div>

              <div className="vendor-field full">
                <label><Phone size={15} /> Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="vendor-field full">
                <label><MapPin size={15} /> Store Address *</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter complete store address"
                  required
                />
              </div>

              <div className="vendor-field full">
                <label>Store Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell customers about your store..."
                />
              </div>

            </div>

            {message && (
              <div className="vendor-message success">{message}</div>
            )}

            <div className="vendor-form-actions">
              <button type="submit" className="vendor-primary-btn">
                <Save size={18} /> Save Changes
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
