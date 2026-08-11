import React from 'react';
import { useCart } from '../context/CartContext';
import { ArrowRight } from 'lucide-react';

export default function FeaturedSection({ dish }) {
  const { addToCart } = useCart();

  if (!dish) return null;

  return (
    <section className="featured-banner-section">
      <div className="container featured-container">
        {/* Left column Content */}
        <div className="featured-content-left">
          <span className="featured-tag">TODAY'S SPECIALTY</span>
          <h2 className="featured-heading">{dish.name}</h2>
          <p className="featured-body-copy">{dish.description}</p>
          <div className="featured-price">${dish.price.toFixed(2)}</div>
          <div className="featured-actions">
            <button onClick={() => addToCart(dish)} className="filled-cta-btn">
              ADD TO ORDER
            </button>
            <a href="#reservations" className="ghost-link-btn ghost-link-dark">
              BOOK A TABLE
              <ArrowRight size={14} className="ghost-link-icon" />
            </a>
          </div>
        </div>

        {/* Right column Image */}
        <div className="featured-image-right-wrapper">
          <img src={dish.image} alt={dish.name} className="featured-image-right" />
        </div>
      </div>
    </section>
  );
}
