
import React, { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import "../styles.css";
export default function ProductReviews({ product }) {
  const storageKey = `shopstack_reviews_${product.id}`;

  const [reviews, setReviews] = useState(() =>
    JSON.parse(localStorage.getItem(storageKey) || "[]")
  );

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [customerName, setCustomerName] = useState("");

  const submitReview = (e) => {
    e.preventDefault();

    if (!review.trim() || !customerName.trim()) return;

    const newReview = {
      id: Date.now(),
      name: customerName.trim(),
      rating,
      comment: review.trim(),
      date: new Date().toLocaleDateString("en-IN")
    };

    const updated = [newReview, ...reviews];

    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    setReview("");
    setCustomerName("");
    setRating(5);

    alert("Thank you! Your review has been added.");
  };

  const averageRating = reviews.length
    ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
    : 0;

  return (
    <section className="reviews-section">
      <div className="reviews-heading">
        <div>
          <span className="customer-eyebrow">CUSTOMER FEEDBACK</span>
          <h2>Customer Reviews</h2>
        </div>

        <div className="average-rating">
          <Star fill="#f5b942" color="#f5b942" />
          <strong>{averageRating.toFixed(1)}</strong>
          <small>({reviews.length} reviews)</small>
        </div>
      </div>

      <form className="review-form" onSubmit={submitReview}>
        <h3>Write a Review</h3>

        <label>Your Name</label>
        <input
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          placeholder="Enter your name"
          required
        />

        <label>Your Rating</label>
        <div className="rating-select">
          {[1, 2, 3, 4, 5].map(number => (
            <button
              type="button"
              key={number}
              onClick={() => setRating(number)}
              aria-label={`${number} stars`}
            >
              <Star
                size={25}
                fill={number <= rating ? "#f5b942" : "none"}
                color={number <= rating ? "#f5b942" : "#b8c5bb"}
              />
            </button>
          ))}
        </div>

        <label>Your Review</label>
        <textarea
          value={review}
          onChange={e => setReview(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          required
        />

        <button className="review-submit" type="submit">
          Submit Review
        </button>
      </form>

      <div className="reviews-list">
        {reviews.length ? (
          reviews.map(item => (
            <article className="review-card" key={item.id}>
              <div className="review-avatar">
                {item.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{item.name}</strong>
                <div className="review-stars">
                  {Array.from({ length: item.rating }, (_, i) => (
                    <Star key={i} size={14} fill="#f5b942" color="#f5b942" />
                  ))}
                </div>
                <p>{item.comment}</p>
                <small>{item.date}</small>
              </div>
            </article>
          ))
        ) : (
          <p className="no-reviews">
            <MessageSquare size={17} /> No reviews yet. Be the first to review!
          </p>
        )}
      </div>
    </section>
  );
}
