
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useCart } from "../../context/CartContext";
import "./Checkout.css";

const UPI_ID = "yourname@okaxis";
const UPI_NAME = "SHOPSTACK";

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showQR, setShowQR] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [bank, setBank] = useState("");

  const [card, setCard] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvv: ""
  });

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  const upiLink =
    `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
    `&pn=${encodeURIComponent(UPI_NAME)}` +
    `&am=${total.toFixed(2)}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent("SHOPSTACK Order Payment")}`;

  function update(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function selectPayment(method) {
    setPaymentMethod(method);
    setShowQR(false);
  }

  function updateCard(e) {
    const { name, value } = e.target;

    if (name === "number") {
      setCard({
        ...card,
        number: value.replace(/\D/g, "").slice(0, 16)
      });
      return;
    }

    if (name === "cvv") {
      setCard({
        ...card,
        cvv: value.replace(/\D/g, "").slice(0, 4)
      });
      return;
    }

    setCard({
      ...card,
      [name]: value
    });
  }

  function placeOrder(e) {
    e.preventDefault();

    if (!cart.length) return;

    if (paymentMethod === "cod") {
      setPlaced(true);
      clearCart();
      return;
    }

    if (paymentMethod === "qr") {
      setShowQR(true);
      return;
    }

    if (paymentMethod === "upi") {
      window.location.href = upiLink;
      return;
    }

    if (paymentMethod === "card") {
      if (
        !card.holder.trim() ||
        card.number.length !== 16 ||
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry) ||
        !/^\d{3,4}$/.test(card.cvv)
      ) {
        alert("Please enter valid demo card details.");
        return;
      }

      alert(
        "Demo card payment screen completed! No real payment was processed."
      );
      return;
    }

    if (paymentMethod === "netbanking") {
      if (!bank) {
        alert("Please select your bank.");
        return;
      }

     
    }
  }

  if (placed) {
    return (
      <main className="page-wrap success-page">
        <div className="success-icon">✓</div>
        <h1>Order placed successfully!</h1>
        <p>
          Thank you for shopping with SHOPSTACK.
          Payment method: Cash on Delivery.
        </p>
        <Link className="hero-btn" to="/">
          Continue shopping
        </Link>
      </main>
    );
  }

  if (!cart.length) {
    return (
      <main className="page-wrap empty-cart">
        <h1>Your cart is empty</h1>
        <Link className="hero-btn" to="/">
          Shop now
        </Link>
      </main>
    );
  }

  return (
    <main className="page-wrap">

      <div className="page-title">
        <span className="eyebrow">ALMOST THERE</span>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-layout">

        <form className="checkout-form" onSubmit={placeOrder}>

          <h2>Delivery details</h2>

          <label>
            Full name
            <input
              name="name"
              value={form.name}
              onChange={update}
              required
              placeholder="Enter your full name"
            />
          </label>

          <label>
            Phone number
            <input
              name="phone"
              value={form.phone}
              onChange={update}
              required
              pattern="[0-9]{10}"
              placeholder="10-digit mobile number"
            />
          </label>

          <label>
            Address
            <textarea
              name="address"
              value={form.address}
              onChange={update}
              required
              placeholder="House / street / area"
            />
          </label>

          <div className="form-row">
            <label>
              City
              <input
                name="city"
                value={form.city}
                onChange={update}
                required
              />
            </label>

            <label>
              PIN code
              <input
                name="pincode"
                value={form.pincode}
                onChange={update}
                required
                pattern="[0-9]{6}"
              />
            </label>
          </div>

          {/* PAYMENT METHODS */}

          <div className="payment-section">

            <h2>Payment method</h2>

            <p className="payment-subtitle">
              Select your preferred payment method.
            </p>

            <div className="payment-options">

              <label className={`payment-option ${
                paymentMethod === "cod" ? "selected" : ""
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => selectPayment("cod")}
                />
                <span className="payment-icon">💵</span>
                <span className="payment-info">
                  <strong>Cash on Delivery</strong>
                  <small>Pay when your order arrives</small>
                </span>
              </label>

              <label className={`payment-option ${
                paymentMethod === "upi" ? "selected" : ""
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "upi"}
                  onChange={() => selectPayment("upi")}
                />
                <span className="payment-icon">📱</span>
                <span className="payment-info">
                  <strong>UPI Payment</strong>
                  <small>Google Pay, PhonePe, Paytm, BHIM</small>
                </span>
              </label>

              <label className={`payment-option ${
                paymentMethod === "qr" ? "selected" : ""
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "qr"}
                  onChange={() => selectPayment("qr")}
                />
                <span className="payment-icon">▦</span>
                <span className="payment-info">
                  <strong>Scan & Pay QR Code</strong>
                  <small>Scan using any UPI application</small>
                </span>
              </label>

              <label className={`payment-option ${
                paymentMethod === "card" ? "selected" : ""
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => selectPayment("card")}
                />
                <span className="payment-icon">💳</span>
                <span className="payment-info">
                  <strong>Credit / Debit Card</strong>
                  <small>Visa, Mastercard, RuPay</small>
                </span>
              </label>

              <label className={`payment-option ${
                paymentMethod === "netbanking" ? "selected" : ""
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "netbanking"}
                  onChange={() => selectPayment("netbanking")}
                />
                <span className="payment-icon">🏦</span>
                <span className="payment-info">
                  <strong>Net Banking</strong>
                  <small>Pay using your bank account</small>
                </span>
              </label>

            </div>

            {/* UPI QR */}

        {paymentMethod === "qr" && showQR && (
              <div className="qr-payment">

                <h3>Scan QR Code to Pay</h3>

                <p>
                  Scan using Google Pay, PhonePe or Paytm.
                </p>

                <div className="qr-image">
                  <QRCodeSVG
                    value={upiLink}
                    size={210}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <h3>₹{total.toLocaleString("en-IN")}</h3>

                <p className="upi-id">
                  UPI ID: {UPI_ID}
                </p>

                <a href={upiLink} className="upi-pay-btn">
                  Open UPI App
                </a>

                <p className="qr-warning">
                  Demo QR only. Payment is not automatically verified.
                </p>

              </div>
            )}

            {/* UPI DETAILS */}

            {paymentMethod === "upi" && (
              <div className="payment-notice">
                <h3>UPI Payment</h3>
                <p>
                  Continue to open your supported UPI application.
                </p>
                <p>UPI ID: {UPI_ID}</p>
              </div>
            )}

            {/* CARD FORM */}

            {paymentMethod === "card" && (
              <div className="card-payment">

                <h3>Card details</h3>

               

                <label>
                  Cardholder name
                  <input
                    name="holder"
                    value={card.holder}
                    onChange={updateCard}
                    placeholder="Name on card"
                    autoComplete="off"
                    required
                  />
                </label>

                <label>
                  Card number
                  <input
                    name="number"
                    value={card.number}
                    onChange={updateCard}
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                    autoComplete="off"
                    required
                  />
                </label>

                <div className="form-row">

                  <label>
                    Expiry date
                    <input
                      name="expiry"
                      value={card.expiry}
                      onChange={updateCard}
                      placeholder="MM/YY"
                      maxLength={5}
                      autoComplete="off"
                      required
                    />
                  </label>

                  <label>
                    CVV
                    <input
                      name="cvv"
                      value={card.cvv}
                      onChange={updateCard}
                      placeholder="123"
                      type="password"
                      inputMode="numeric"
                      autoComplete="off"
                      required
                    />
                  </label>

                </div>

              </div>
            )}

            {/* NET BANKING */}

            {paymentMethod === "netbanking" && (
              <div className="bank-payment">

                <h3>Select your bank</h3>

                <label>
                  Choose bank

                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    required
                  >
                    <option value="">Select your bank</option>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Canara Bank">Canara Bank</option>
                    <option value="Union Bank of India">Union Bank of India</option>
                    <option value="Indian Bank">Indian Bank</option>
                  </select>
                </label>


              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="cod-notice">
                ✓ Pay when your order is delivered.
              </div>
            )}

          </div>

          {/* PAYMENT BUTTON */}

          <button
            className="btn-buy checkout-btn"
            type="submit"
          >
            {paymentMethod === "cod"
              ? `Place order · ₹${total.toLocaleString("en-IN")}`
              : paymentMethod === "qr"
              ? showQR
                ? "QR Code Generated ✓"
                : "Generate Payment QR"
              : paymentMethod === "upi"
              ? "Pay with UPI"
              : paymentMethod === "card"
              ? "Continue with Card"
              : "Continue with Net Banking"}
          </button>

         

        </form>

        {/* ORDER SUMMARY */}

        <aside className="summary">

          <h2>Your order</h2>

          {cart.map((i) => (
            <div key={i.id}>
              <span>{i.name} × {i.quantity}</span>
              <b>
                ₹{(i.price * i.quantity).toLocaleString("en-IN")}
              </b>
            </div>
          ))}

          <hr />

          <div>
            <span>Shipping</span>
            <b>{shipping ? `₹${shipping}` : "FREE"}</b>
          </div>

          <div className="total">
            <span>Total</span>
            <b>₹{total.toLocaleString("en-IN")}</b>
          </div>

          <div className="summary-payment">
            Payment: {
              {
                cod: "Cash on Delivery",
                upi: "UPI",
                qr: "UPI QR Code",
                card: "Credit / Debit Card",
                netbanking: "Net Banking"
              }[paymentMethod]
            }
          </div>

        </aside>

      </div>

    </main>
  );
}
