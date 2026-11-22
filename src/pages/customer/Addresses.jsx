
import React, { useState } from "react";
import { useShop } from "../../context/ShopContext";
import "../../styles.css";

const blank = {
  name: "",
  phone: "",
  line: "",
  city: "",
  state: "",
  pincode: "",
  type: "Home",
  isDefault: false
};

export default function Addresses() {
  const { addresses, setAddresses } = useShop();

  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const save = (e) => {
    e.preventDefault();

    if (editing) {
      setAddresses((a) =>
        a.map((x) =>
          x.id === editing ? { ...form, id: editing } : x
        )
      );
    } else {
      setAddresses((a) => [
        ...a,
        {
          ...form,
          id: Date.now(),
          isDefault: a.length === 0
        }
      ]);
    }

    setForm(blank);
    setEditing(null);
  };

  const edit = (address) => {
    setForm({ ...address });
    setEditing(address.id);
  };

  const remove = (id) => {
    if (window.confirm("Delete this address?")) {
      setAddresses((a) => a.filter((x) => x.id !== id));
    }
  };

  const makeDefault = (id) => {
    setAddresses((a) =>
      a.map((x) => ({
        ...x,
        isDefault: x.id === id
      }))
    );
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(blank);
  };

  return (
    <main className="addresses-page">

      {/* HEADER */}
      <div className="addresses-header">
        <div>
          <h1>My Addresses</h1>
          <p>Manage your delivery addresses.</p>
        </div>

        <span className="addresses-count">
          📍 {addresses.length} Saved
        </span>
      </div>

      {/* ADD ADDRESS FORM */}
      <form className="addresses-form" onSubmit={save}>

        <div className="addresses-form-heading">
          <span>📍</span>
          <div>
            <h2>
              {editing ? "Edit Address" : "Add a New Address"}
            </h2>
            <p>
              Enter your details for smooth delivery.
            </p>
          </div>
        </div>

        <div className="addresses-fields">

          {[
            ["name", "Full Name", "Enter your full name"],
            ["phone", "Phone Number", "Enter phone number"],
            ["line", "House No. / Street", "Enter complete street address"],
            ["city", "City", "Enter your city"],
            ["state", "State", "Enter your state"],
            ["pincode", "PIN Code", "Enter PIN code"]
          ].map(([name, label, placeholder]) => (
            <div className="address-field" key={name}>
              <label>{label}</label>

              <input
                type="text"
                name={name}
                value={form[name] || ""}
                onChange={change}
                placeholder={placeholder}
                required
              />
            </div>
          ))}

          <div className="address-field">
            <label>Address Type</label>

            <select
              name="type"
              value={form.type}
              onChange={change}
            >
              <option>Home</option>
              <option>Work</option>
              <option>Other</option>
            </select>
          </div>

        </div>

        <div className="addresses-form-actions">
          <button type="submit" className="address-save-btn">
            {editing ? "✓ Update Address" : "+ Save Address"}
          </button>

          {editing && (
            <button
              type="button"
              className="address-cancel-btn"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>

      </form>

      {/* SAVED ADDRESSES */}
      <div className="saved-addresses-section">

        <div className="saved-addresses-heading">
          <h2>Saved Addresses</h2>
          <span>{addresses.length} Addresses</span>
        </div>

        {addresses.length > 0 ? (

          <div className="saved-addresses-grid">

            {addresses.map((a) => (
              <article className="saved-address-card" key={a.id}>

                <div className="saved-address-top">

                  <div className="saved-address-type">
                    <span>
                      {a.type === "Home" ? "🏠" :
                       a.type === "Work" ? "🏢" : "📍"}
                    </span>

                    <strong>{a.type}</strong>
                  </div>

                  {a.isDefault && (
                    <span className="default-address-badge">
                      ✓ DEFAULT
                    </span>
                  )}

                </div>

                <div className="saved-address-details">

                  <h3>{a.name}</h3>

                  <p>
                    {a.line}, {a.city}, {a.state} - {a.pincode}
                  </p>

                  <div className="saved-address-phone">
                    <span>📞</span> {a.phone}
                  </div>

                </div>

                <div className="saved-address-actions">

                  <button
                    className="address-edit-btn"
                    onClick={() => edit(a)}
                  >
                    ✎ Edit
                  </button>

                  <button
                    className="address-delete-btn"
                    onClick={() => remove(a.id)}
                  >
                    ✕ Delete
                  </button>

                  {!a.isDefault && (
                    <button
                      className="address-default-btn"
                      onClick={() => makeDefault(a.id)}
                    >
                      Set Default
                    </button>
                  )}

                </div>

              </article>
            ))}

          </div>

        ) : (

          <div className="addresses-empty">
            <span>📍</span>
            <h3>No Addresses Saved</h3>
            <p>
              Add your delivery address to make checkout faster.
            </p>
          </div>

        )}

      </div>

    </main>
  );
}
