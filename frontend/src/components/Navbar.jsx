import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Lock } from 'lucide-react';

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav-container">
      <div className="nav-content">
        {/* Left Link Group */}
        <div className="nav-group left-group">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active-outline' : ''}`}>
            Home
          </Link>
          <a href="/#menu" className="nav-link">
            Menu
          </a>
          <a href="/#about" className="nav-link">
            About Us
          </a>
          <a href="/#contact" className="nav-link">
            Contact
          </a>
        </div>

        {/* Centered Brand Name */}
        <div className="nav-logo">
          <Link to="/">LIMÓN</Link>
        </div>

        {/* Right Link Group */}
        <div className="nav-group right-group">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link follow-link"
          >
            FOLLOW US
          </a>
          <Link to="/admin" className={`nav-link admin-nav-link ${isActive('/admin') ? 'active-outline' : ''}`}>
            <Lock size={14} style={{ marginRight: '4px' }} /> ADMIN
          </Link>
          <button onClick={() => setIsCartOpen(true)} className="cart-trigger">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}
