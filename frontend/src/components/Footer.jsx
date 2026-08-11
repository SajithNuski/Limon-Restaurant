import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container footer-container">
        <div className="footer-brand-column">
          <h2 className="footer-logo">LIMÓN</h2>
          <p className="footer-tagline">Moody brasserie under candlelight</p>
        </div>
        
        <div className="footer-links-column">
          <h4 className="footer-subtitle">NAVIGATION</h4>
          <ul className="footer-list">
            <li><Link to="/">Home</Link></li>
            <li><a href="/#menu">Menu</a></li>
            <li><a href="/#about">About Us</a></li>
            <li><a href="/#reservations">Reservations</a></li>
            <li><Link to="/admin">Admin Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-contact-column">
          <h4 className="footer-subtitle">CONTACT & LOCALE</h4>
          <p className="footer-detail">84 Candlelight Blvd, Brasserie District</p>
          <p className="footer-detail">reservations@limonbrasserie.com</p>
          <p className="footer-detail">+1 (555) 019-3829</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} LIMÓN BRASSERIE. ALL RIGHTS RESERVED.
          </p>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
            <span>·</span>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FACEBOOK</a>
            <span>·</span>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">TWITTER</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
