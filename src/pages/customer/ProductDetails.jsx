import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Zap, Star } from "lucide-react";
import { products } from "../../data/products";
import { useCart } from "../../context/CartContext";
import ProductReviews from "../../components/ProductReviews";
import RecommendedProducts from "../../components/RecommendedProducts";
export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!product) return <main className="page-wrap"><h2>Product not found</h2><Link to="/">Back to home</Link></main>;
  return <main className="page-wrap">
    <Link className="back-link" to="/"><ArrowLeft size={17}/> Back to products</Link>
    <div className="detail-layout">
      <div className="detail-image"><img src={product.image} alt={product.name}/></div>
      <div className="detail-content"><span className="eyebrow">{product.category}</span><h1>{product.name}</h1>
        <div className="rating detail-rating"><Star size={16} fill="currentColor"/> {product.rating} · Customer rating</div>
        <div className="detail-price">₹{product.price.toLocaleString("en-IN")} <del>₹{product.oldPrice.toLocaleString("en-IN")}</del></div>
        <p>{product.description}</p><p className="stock">✓ In stock · Ready to ship</p>
        <div className="detail-buttons"><button className="btn-secondary" onClick={() => addToCart(product)}><ShoppingCart/> Add to cart</button><button className="btn-buy" onClick={() => {addToCart(product); navigate("/checkout");}}><Zap/> Buy now</button></div>
        <div className="delivery-note">♻️ Thoughtfully selected product · Secure checkout</div>
      </div>
    </div>
    <RecommendedProducts currentProduct={product} />
      <ProductReviews product={product} />
  </main>;
}