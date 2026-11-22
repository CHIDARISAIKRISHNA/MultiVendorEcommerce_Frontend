
import React, { useState } from "react";

export default function CustomerSupport() {
  const [form, setForm] = useState({
    subject: "Order issue",
    orderId: "",
    message: ""
  });

  const [sent, setSent] = useState(false);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setSent(false);
  };

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="support-page">

      {/* HEADER */}
      <div className="support-header">
        <div>
          <h1>Customer Support</h1>
          <p>We're here to help. Tell us how we can assist you.</p>
        </div>

        <span className="support-header-icon">🎧</span>
      </div>

      {/* SUPPORT FORM */}
      <section className="support-card">

        <div className="support-card-heading">
          <span>💬</span>
          <div>
            <h2>Submit a Support Request</h2>
            <p>Fill in the details below and describe your issue.</p>
          </div>
        </div>

        <form className="support-form" onSubmit={submit}>

          <div className="support-field support-full">
            <label>What do you need help with?</label>

            <select
              name="subject"
              value={form.subject}
              onChange={change}
            >
              <option>Order issue</option>
              <option>Return or refund</option>
              <option>Payment issue</option>
              <option>Product question</option>
              <option>Other</option>
            </select>
          </div>

          <div className="support-field support-full">
            <label>Order ID <span>(Optional)</span></label>

            <input
              name="orderId"
              value={form.orderId}
              onChange={change}
              placeholder="e.g. SS1001"
            />
          </div>

          <div className="support-field support-full">
            <label>Describe Your Issue</label>

            <textarea
              rows="6"
              name="message"
              value={form.message}
              onChange={change}
              required
              placeholder="Please describe your issue in detail..."
            />
          </div>

          <div className="support-full">
            <button type="submit" className="support-submit-btn">
              Submit Request →
            </button>

            {sent && (
              <div className="support-success">
                <span>✓</span>
                <div>
                  <strong>Request submitted!</strong>
                  <p>
                    Request captured in this demo.
                    Connect a backend to send it to support.
                  </p>
                </div>
              </div>
            )}
          </div>

        </form>
      </section>

      {/* CONTACT SECTION */}
      <section className="support-contact-card">

        <div className="support-contact-icon">📧</div>

        <div className="support-contact-info">
          <h3>Need Immediate Help?</h3>
          <p>Contact our customer support team.</p>
          <strong>support@shopstack.example</strong>
          <small>Replace this demo email with your actual support email.</small>
        </div>
      </section>

      <div className="support-footer">
        Thank you for choosing SHOPSTACK ❤️
      </div>

    </main>
  );
}
