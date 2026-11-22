
import React from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import "./CustomerFeatures.css";

export default function ProductFilters({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  resetFilters
}) {
  return (
    <div className="advanced-filters">
      <div className="filter-title">
        <h3><SlidersHorizontal size={18} /> Filter Products</h3>
        <button onClick={resetFilters}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label>Minimum Price (₹)</label>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="filter-group">
          <label>Maximum Price (₹)</label>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            placeholder="Any price"
          />
        </div>

        <div className="filter-group">
          <label>Minimum Rating</label>
          <select
            value={minRating}
            onChange={e => setMinRating(e.target.value)}
          >
            <option value="0">All Ratings</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="default">Recommended</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
