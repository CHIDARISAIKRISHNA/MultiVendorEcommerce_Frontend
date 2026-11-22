
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  X,
  Send,
  MessageCircle,
  Heart,
  ShoppingCart,
  Sparkles,
  RotateCcw,
  Leaf,
  ArrowRight
} from "lucide-react";

import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import "./CustomerSupport.css";

const CustomerSupport = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { addToCart } = useCart();
  const { addToWishlist, isWishlisted } = useWishlist();

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      text: "Hello! 👋 Welcome to SHOPSTACK! I'm your shopping assistant. How can I help you today?",
      sender: "bot"
    }
  ]);

  const faqs = [
    "Show me eco-friendly products",
    "How can I add products to wishlist?",
    "How can I add products to cart?",
    "What payment methods are available?",
    "How can I contact customer support?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, open]);

  // Generate chatbot response
  const getBotResponse = (text) => {
    const query = text.toLowerCase();

    // Product recommendations
    if (
      query.includes("product") ||
      query.includes("show me") ||
      query.includes("recommend") ||
      query.includes("eco") ||
      query.includes("shop") ||
      query.includes("find")
    ) {
      const matchedProducts = products.filter((p) => {
        const searchable = `${p.name} ${p.category} ${p.tag || ""}`.toLowerCase();

        const words = query
          .replace(/[^\w\s]/g, "")
          .split(/\s+/)
          .filter((word) =>
            word.length > 3 &&
            !["show", "find", "some", "products", "product", "recommend", "please", "with", "from"].includes(word)
          );

        return words.length === 0 ||
          words.some((word) => searchable.includes(word));
      });

      return {
        text: matchedProducts.length
          ? "Here are some products you might like! 🌿"
          : "I couldn't find an exact match. Here are some popular products from our collection.",
        products: (matchedProducts.length ? matchedProducts : products).slice(0, 4)
      };
    }

    // Wishlist assistance
    if (
      query.includes("wishlist") ||
      query.includes("favourite") ||
      query.includes("favorite")
    ) {
      return {
        text: "❤️ You can add products to your wishlist by clicking the heart icon on any product card. Visit the Wishlist section in your navbar to see all your saved products!"
      };
    }

    // Cart assistance
    if (
      query.includes("cart") ||
      query.includes("add item") ||
      query.includes("shopping bag")
    ) {
      return {
        text: "🛒 To add an item to your cart, click the 'Add to cart' button on any product. You can view your selected products by clicking Cart in the navbar."
      };
    }

    // Payment assistance
    if (
      query.includes("payment") ||
      query.includes("pay") ||
      query.includes("upi") ||
      query.includes("credit card") ||
      query.includes("debit card") ||
      query.includes("net banking")
    ) {
      return {
        text: "💳 SHOPSTACK supports payment options displayed on the checkout page, including UPI, credit/debit cards and net banking. This demo frontend does not verify real payments or process actual transactions."
      };
    }

    // Order assistance
    if (
      query.includes("order") ||
      query.includes("track") ||
      query.includes("delivery") ||
      query.includes("shipping")
    ) {
      return {
        text: "📦 You can check order information through your account or order section if order tracking is available. This frontend demo does not provide live courier tracking."
      };
    }

    // Return and cancellation
    if (
      query.includes("return") ||
      query.includes("refund") ||
      query.includes("cancel")
    ) {
      return {
        text: "🔄 For returns, refunds or cancellations, please contact SHOPSTACK Customer Support. Actual return and refund processing requires backend functionality."
      };
    }

    // Customer support
    if (
      query.includes("support") ||
      query.includes("contact") ||
      query.includes("help") ||
      query.includes("human")
    ) {
      return {
        text: "😊 I'm here to help! You can use the Customer Support section for additional assistance."
      };
    }

    // Greeting
    if (
      query.includes("hello") ||
      query.includes("hi") ||
      query.includes("hey")
    ) {
      return {
        text: "Hey there! 👋 Welcome to SHOPSTACK. I can help you discover products, manage your wishlist, understand payments and more!"
      };
    }

    // Thanks
    if (query.includes("thank")) {
      return {
        text: "You're welcome! 💚 Happy shopping with SHOPSTACK!"
      };
    }

    // Default
    return {
      text: "I'm your SHOPSTACK shopping assistant! 🌿 I can help with product recommendations, wishlist, cart, payments, orders and customer support. Try asking me one of these questions!"
      ,
      suggestions: faqs.slice(0, 3)
    };
  };

  // Send message
  const sendMessage = (text = message) => {
    if (!text.trim()) return;

    const userMessage = text.trim();
    const response = getBotResponse(userMessage);

    setMessages((prev) => [
      ...prev,
      {
        text: userMessage,
        sender: "user"
      },
      {
        ...response,
        sender: "bot"
      }
    ]);

    setMessage("");
  };

  const clearChat = () => {
    setMessages([
      {
        text: "Hello! 👋 Welcome back to SHOPSTACK! How can I help you today?",
        sender: "bot"
      }
    ]);
  };

  return (
    <div className="support-widget">

      {/* Chat window */}
      {open && (
        <div className="support-window">

          {/* Header */}
          <div className="support-header">
            <div className="support-avatar">
              <Bot size={23} />
            </div>

            <div className="support-heading">
              <h3>SHOPSTACK Assistant</h3>
              <span>
                <i className="online-dot"></i>
                Online · Shopping assistant
              </span>
            </div>

            <button
              className="support-reset"
              onClick={clearChat}
              title="Clear chat"
              type="button"
            >
              <RotateCcw size={17} />
            </button>

            <button
              className="support-close"
              onClick={() => setOpen(false)}
              type="button"
              aria-label="Close chatbot"
            >
              <X size={21} />
            </button>
          </div>

          {/* Chat body */}
          <div className="support-body">

            <div className="support-welcome">
              <div className="welcome-icon">
                <Sparkles size={17} />
              </div>
              <div>
                <strong>Your shopping assistant</strong>
                <p>Ask me anything about SHOPSTACK!</p>
              </div>
            </div>

            {/* Messages */}
            <div className="support-messages">

              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`support-message-row ${item.sender}`}
                >

                  {item.sender === "bot" && (
                    <div className="message-avatar">
                      <Bot size={16} />
                    </div>
                  )}

                  <div className="message-content">

                    <div className={`support-message ${item.sender}`}>
                      {item.text}
                    </div>

                    {/* Product recommendations */}
                    {item.products && (
                      <div className="chat-products">
                        {item.products.map((product) => (
                          <div
                            className="chat-product-card"
                            key={product.id}
                          >
                            <Link
                              to={`/product/${product.id}`}
                              onClick={() => setOpen(false)}
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                              />
                            </Link>

                            <div className="chat-product-info">
                              <Link
                                to={`/product/${product.id}`}
                                onClick={() => setOpen(false)}
                              >
                                {product.name}
                              </Link>

                              <strong>
                                ₹{product.price.toLocaleString("en-IN")}
                              </strong>

                              <div className="chat-product-actions">
                                <button
                                  type="button"
                                  onClick={() => addToCart(product)}
                                >
                                  <ShoppingCart size={13} />
                                  Cart
                                </button>

                                <button
                                  type="button"
                                  onClick={() => addToWishlist(product)}
                                  disabled={isWishlisted(product.id)}
                                >
                                  <Heart size={13} />
                                  {isWishlisted(product.id) ? "Saved" : "Save"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggested questions */}
                    {item.suggestions && (
                      <div className="chat-suggestions">
                        {item.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(suggestion)}
                            type="button"
                          >
                            {suggestion}
                            <ArrowRight size={13} />
                          </button>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />

            </div>

            {/* FAQ suggestions */}
            {messages.length === 1 && (
              <div className="support-faq">
                <p>QUICK QUESTIONS</p>

                {faqs.map((faq, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => sendMessage(faq)}
                  >
                    {faq}
                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Input */}
          <form
            className="support-input"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              type="text"
              placeholder="Ask me anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              type="submit"
              disabled={!message.trim()}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>

          <div className="support-footer">
            Powered by SHOPSTACK <Leaf size={12} />
          </div>

        </div>
      )}

      {/* Floating chatbot button */}
      <button
        className={`support-toggle ${open ? "chat-open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Open shopping assistant"
        type="button"
      >
        {open ? <X size={25} /> : <MessageCircle size={25} />}
        {!open && <span className="chat-notification-dot"></span>}
      </button>

    </div>
  );
};

export default CustomerSupport;
