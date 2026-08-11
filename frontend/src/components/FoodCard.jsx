import React from 'react';
import { useCart } from '../context/CartContext';
import { ArrowRight } from 'lucide-react';

export default function FoodCard({ dish, darkTheme = false }) {
  const { addToCart } = useCart();

  const handleOrder = (e) => {
    e.preventDefault();
    addToCart(dish);
  };

  return (
    <div className="food-card">
      <div className="food-card-image-wrapper">
        <img src={dish.image} alt={dish.name} className="food-card-image" />
      </div>
      <div className="food-card-details">
        <div className="food-card-header">
          <h3 className={`food-card-title ${darkTheme ? 'text-cream' : 'text-forest'}`}>
            {dish.name}
          </h3>
          <span className={`food-card-price ${darkTheme ? 'text-lemon' : 'text-forest'}`}>
            ${dish.price.toFixed(2)}
          </span>
        </div>
        <p className={`food-card-description ${darkTheme ? 'text-cream-muted' : 'text-forest-muted'}`}>
          {dish.description}
        </p>
        <button
          onClick={handleOrder}
          className={`ghost-link-btn ${darkTheme ? 'ghost-link-light' : 'ghost-link-dark'}`}
        >
          ORDER NOW
          <ArrowRight size={14} className="ghost-link-icon" />
        </button>
      </div>
    </div>
  );
}
