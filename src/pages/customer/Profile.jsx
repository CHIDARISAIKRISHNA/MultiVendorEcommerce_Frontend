
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function Profile() {
  const [isEditing, setIsEditing] = useState(false);
const navigate = useNavigate();
const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

    return {
      name: savedUser.name || "",
      email: savedUser.email || "",
      phone: savedUser.phone || "",
    };
  });


  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  
const handleSave = () => {
  const isFirstTime = !localStorage.getItem("customerProfile");

  setProfile(formData);

  localStorage.setItem(
    "customerProfile",
    JSON.stringify(formData)
  );

  setMessage(
    isFirstTime
      ? "Profile created successfully!"
      : "Profile updated successfully!"
  );

  setTimeout(() => {
    navigate("/");
  }, 1500);
};

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">

        <div className="profile-header">
          <div className="profile-avatar">
            {profile.name
              ? profile.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <h2>My Profile</h2>
          <p>Manage your personal information</p>
        </div>

           {message && (
          <div className="success-message">
            {message}
          </div>
        )}                
        <div className="profile-details">

          <div className="profile-field">
            <label>Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            ) : (
              <p>{profile.name || "Not provided"}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Email Address</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            ) : (
              <p>{profile.email || "Not provided"}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            ) : (
              <p>{profile.phone || "Not provided"}</p>
            )}
          </div>

        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>

              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;
