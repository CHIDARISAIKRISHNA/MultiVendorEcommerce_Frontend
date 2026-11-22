
import React, { useState } from "react";
import "./AccountSettings.css";

export default function AccountSettings() {
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    offers: true
  });

  const toggle = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.checked
    });
  };

  const preferences = [
    {
      name: "email",
      title: "Email Notifications",
      desc: "Receive order updates and important information by email.",
      icon: "📧"
    },
    {
      name: "sms",
      title: "SMS Notifications",
      desc: "Receive delivery updates and order notifications by SMS.",
      icon: "📱"
    },
    {
      name: "offers",
      title: "Offers & Promotions",
      desc: "Receive exclusive deals, discounts and product offers.",
      icon: "🎁"
    }
  ];

  return (
    <main className="account-settings-page">

      {/* HEADER */}
      <div className="account-settings-header">
        <div>
          <h1>Account Settings</h1>
          <p>
            Manage your privacy and communication preferences.
          </p>
        </div>
        <span className="account-settings-icon">⚙️</span>
      </div>

      {/* NOTIFICATION SETTINGS */}
      <section className="account-settings-card">

        <div className="account-settings-card-heading">
          <div className="account-settings-heading-icon">🔔</div>
          <div>
            <h2>Notification Preferences</h2>
            <p>Choose how you want to receive updates.</p>
          </div>
        </div>

        <div className="account-settings-options">
          {preferences.map((item) => (
            <label
              className="account-setting-row"
              key={item.name}
            >
              <div className="account-setting-info">
                <span className="account-setting-icon">
                  {item.icon}
                </span>

                <div>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </div>

              <input
                type="checkbox"
                name={item.name}
                checked={settings[item.name]}
                onChange={toggle}
              />
            </label>
          ))}
        </div>

      </section>

      {/* SECURITY SETTINGS */}
      <section className="account-settings-card security-card">

        <div className="account-settings-card-heading">
          <div className="account-settings-heading-icon">🔐</div>
          <div>
            <h2>Security</h2>
            <p>Manage your account security preferences.</p>
          </div>
        </div>

        <div className="security-content">
          <div>
            <strong>Password & Account Security</strong>
            <p>
              For password changes and account deletion,
              connect your authentication provider before
              enabling these actions.
            </p>
          </div>

          <button
            className="account-settings-button"
            onClick={() =>
              alert(
                "Connect this action to your authentication provider."
              )
            }
          >
            Change Password →
          </button>
        </div>

      </section>

      <p className="account-settings-footer">
        Your preferences are currently managed for this session.
      </p>

    </main>
  );
}
