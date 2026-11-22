
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag
} from "lucide-react";

import { useCart } from "../../context/CartContext";

export default function Cart() {

  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal
  } = useCart();

  const navigate = useNavigate();

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49;

  // EMPTY CART
  if (!cart.length) {
    return (
      <main className="page-wrap empty-cart">
        <ShoppingBag size={48} />

        <h1>Your cart is waiting</h1>

        <p>Looks like you haven't added anything yet.</p>

        <Link className="hero-btn" to="/">
          Explore products
        </Link>
      </main>
    );
  }

  return (
    <main className="page-wrap">

      <div className="page-title">
        <span className="eyebrow">YOUR SHOPPING BAG</span>
        <h1>Shopping cart</h1>
      </div>

      <div className="cart-layout">

        {/* CART ITEMS */}
        <section className="cart-items">

          {cart.map((item) => (

            <article className="cart-item" key={item.id}>

              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-item-info">

                <Link to={`/product/${item.id}`}>
                  {item.name}
                </Link>

                <small>{item.category}</small>

                <strong>
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </strong>

                {/* QUANTITY */}
                <div className="qty">

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>

                </div>

                {/* REMOVE BUTTON */}
                <button
                  type="button"
                  className="remove-cart-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={16} />
                  Remove from Cart
                </button>

              </div>

              <b className="item-total">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </b>

            </article>

          ))}

        </section>

        {/* ORDER SUMMARY */}
        <aside className="summary">

          <h2>Order summary</h2>

          <div>
            <span>Subtotal</span>
            <b>₹{subtotal.toLocaleString("en-IN")}</b>
          </div>

          <div>
            <span>Shipping</span>
            <b>{shipping === 0 ? "FREE" : `₹${shipping}`}</b>
          </div>

          <hr />

          <div className="total">
            <span>Total</span>
            <b>
              ₹{(subtotal + shipping).toLocaleString("en-IN")}
            </b>
          </div>

          <button
            className="btn-buy checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to checkout
          </button>

          <Link className="continue-link" to="/">
            Continue shopping
          </Link>

        </aside>

      </div>

    </main>
  );
}
