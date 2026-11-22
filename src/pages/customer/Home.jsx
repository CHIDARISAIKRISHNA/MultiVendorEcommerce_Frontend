
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Leaf,
  Truck,
  ShieldCheck,
  Recycle,
  Heart
} from "lucide-react";

import { products as staticProducts } from "../../data/products";
import WishlistButton from "../../components/WishlistButton";
import ProductFilters from "../../components/ProductFilters";
import ProductCard from "../../components/ProductCard";



export default function Home() {
    const [vendorProducts, setVendorProducts] = useState([]);

  useEffect(() => {
    const loadProducts = () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem("products") || "[]"
        );

        setVendorProducts(
          Array.isArray(saved)
            ? saved.filter(product => product.approved === true)
            : []
        );
      } catch (error) {
        console.error("Unable to load vendor products:", error);
        setVendorProducts([]);
      }
    };

    loadProducts();

    window.addEventListener(
      "shopstack-products-updated",
      loadProducts
    );

    window.addEventListener("storage", loadProducts);

    return () => {
      window.removeEventListener(
        "shopstack-products-updated",
        loadProducts
      );

      window.removeEventListener("storage", loadProducts);
    };
  }, []);

  const allProducts = useMemo(() => {
    return [
      ...staticProducts,
      ...vendorProducts
    ];
  }, [vendorProducts]);

  const categories = [
    "All",
    ...new Set(allProducts.map(p => p.category).filter(Boolean))
  ];
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Advanced filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [sortBy, setSortBy] = useState("default");

  // Filter and sort products
  const filtered = useMemo(() => {
let result = allProducts.filter((p) =>
        (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (minPrice === "" || p.price >= Number(minPrice)) &&
      (maxPrice === "" || p.price <= Number(maxPrice)) &&
      (Number(p.rating ?? 0)) >= Number(minRating)
    );

    if (sortBy === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [
    allProducts,
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    sortBy
  ]);

  return (
    <main>

      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-content">

          <span className="eyebrow">
            <Leaf size={15} />
            CONSCIOUS LIVING, BETTER SHOPPING
          </span>

          <h1>
            Shop better.
            <br />
            <em>Live greener.</em>
          </h1>

          <p>
            Discover thoughtful products from responsible
            brands and make every purchase count.
          </p>

          <a className="hero-btn" href="#products">
            Explore products <span>↗</span>
          </a>

          <div className="hero-stats">
            <div>
              <b>100%</b>
              <small>Thoughtful choices</small>
            </div>

            <div>
              <b>Eco-first</b>
              <small>Better everyday</small>
            </div>
          </div>

        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=85"
            alt="Green sustainable lifestyle"
          />
        </div>

        <div className="hero-floating">
          <Leaf size={18} />
          <span>
            Small choices.
            <br />
            <b>Big impact.</b>
          </span>
        </div>

      </section>

      {/* BENEFITS SECTION */}
      <section className="benefits" id="benefits">

        <div>
          <Truck />
          <span>
            <b>Free shipping</b>
            <small>On orders above ₹999</small>
          </span>
        </div>

        <div>
          <Recycle />
          <span>
            <b>Eco-conscious</b>
            <small>Better products, less waste</small>
          </span>
        </div>

        <div>
          <ShieldCheck />
          <span>
            <b>Secure shopping</b>
            <small>Your data stays protected</small>
          </span>
        </div>

      </section>

      {/* PRODUCTS SECTION */}
      <section className="products-section">

        <div className="section-heading">

          <div>
            <span className="eyebrow">OUR COLLECTION</span>

            <h2>Find your everyday essentials</h2>

            <p>
              Good for you. A little kinder to the planet.
            </p>
          </div>

          <div className="search-box">

            <Search size={18} />

            <input
              id="product-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
            />

          </div>

        </div>

        {/* CATEGORY FILTER */}
        <div className="category-row" id="categories">

          {categories.map((c) => (
            <button
              key={c}
              className={
                category === c
                  ? "category active"
                  : "category"
              }
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}

        </div>

        {/* ADVANCED PRODUCT FILTERS */}
        <ProductFilters
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          minRating={minRating}
          setMinRating={setMinRating}
          sortBy={sortBy}
          setSortBy={setSortBy}
          resetFilters={() => {
            setMinPrice("");
            setMaxPrice("");
            setMinRating("0");
            setSortBy("default");
          }}
        />

        {/* PRODUCT GRID */}
        <div id="products">

          {filtered.length ? (

            <div className="product-grid">

              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                />
              ))}

            </div>

          ) : (

            <div className="empty-state">
              No products match your search.
            </div>

          )}

        </div>

      </section>

      {/* FOOTER */}
      <footer className="main-footer">

        <div className="footer-container">

          {/* BRAND */}
          <div className="footer-brand">

            <div className="footer-logo">

              <span className="footer-logo-icon">
                <Leaf size={21} />
              </span>

              SHOPSTACK

            </div>

            <p>
              Shop thoughtfully. Live sustainably.
              Discover products that make everyday living
              better for you and kinder to our planet.
            </p>

            <div className="footer-socials">

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>

            </div>

          </div>

          {/* QUICK LINKS */}
          <div className="footer-column">

            <h3>Quick Links</h3>

            <a href="/customer/dashboard">Home</a>

            <a href="/customer/dashboard#products">
              Shop Products
            </a>

            <a href="/customer/dashboard#categories">
              Categories
            </a>

            <a href="/wishlist">My Wishlist</a>

          </div>

          {/* CUSTOMER SERVICE */}
          <div className="footer-column">

            <h3>Customer Service</h3>

            <a href="/customer/dashboard#benefits">
              Why SHOPSTACK
            </a>

            <a
              href="#support"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(".support-toggle")?.click();
              }}
            >
              Contact Support
            </a>

            <a
              href="#support"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(".support-toggle")?.click();
              }}
            >
              FAQs & Help
            </a>

            <a href="/checkout">
              Payment Information
            </a>

          </div>

          {/* MY ACCOUNT */}
          <div className="footer-column">

            <h3>My Account</h3>

            <a href="/profile">My Profile</a>

            <a href="/cart">Shopping Cart</a>

            <a href="/addresses">My Addresses</a>

            <a href="/account-settings">
              Account Settings
            </a>

          </div>

          {/* NEWSLETTER */}
          <div className="footer-newsletter">

            <h3>Stay in the loop 🌿</h3>

            <p>
              Subscribe to receive updates about new products
              and sustainable shopping.
            </p>

            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();

                alert(
                  "Thank you for subscribing to SHOPSTACK!"
                );

                e.target.reset();
              }}
            >

              <input
                type="email"
                placeholder="Enter your email address"
                required
              />

              <button type="submit">
                Subscribe
              </button>

            </form>

            <small>
              Stay updated with SHOPSTACK.
            </small>

          </div>

        </div>

        {/* FOOTER BOTTOM */}
        <div className="footer-bottom">

          <p>
            © 2026 SHOPSTACK. All rights reserved.
          </p>

          <div>
            <span>Made with</span>

            <Heart
              size={14}
              fill="#16a36a"
              color="#16a36a"
            />

            <span>for a greener future.</span>
          </div>

        </div>

      </footer>

    </main>
  );
}
