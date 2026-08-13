import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Lock } from 'lucide-react';

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('');

  // Update active state based on URL hash changes
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveSection(location.hash);
    } else {
      setActiveSection('');
    }
  }, [location.hash, location.pathname]);

  // ScrollSpy logic to dynamically update active section as user scrolls
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // offset for navbar height + buffer
      const sections = ['menu', 'about', 'contact'];

      // If close to the top, Home is active
      if (window.scrollY < 200) {
        setActiveSection('');
        return;
      }

      let currentSection = '';
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = `#${sectionId}`;
            break;
          }
        }
      }

      // Check if we are at the very bottom of the page (then Contact is active)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        currentSection = '#contact';
      }

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial run

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const isActive = (path, hash = '') => {
    if (location.pathname !== path) return false;
    if (path === '/') {
      return activeSection === hash;
    }
    return true; // for pages other than home (e.g. admin)
  };

  return (
    <nav className="sticky top-0 z-[100] bg-black-olive border-b border-sage-mist/10 w-full h-auto py-4 md:h-20 md:py-0 transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center h-full max-w-[1200px] mx-auto px-5 gap-3 md:gap-0">
        {/* Left Link Group */}
        <div className="flex items-center gap-5 w-full md:w-[38%] justify-center md:justify-start">
          <Link to="/" className={`relative py-1.5 px-3 font-sans text-body-sm font-normal tracking-[0.64px] uppercase text-warm-cream transition-colors duration-300 hover:text-lemon-zest after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-lemon-zest after:transition-transform after:duration-300 after:ease-out ${isActive('/', '') ? 'text-lemon-zest after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left'}`}>
            Home
          </Link>
          <a href="/#menu" className={`relative py-1.5 px-3 font-sans text-body-sm font-normal tracking-[0.64px] uppercase text-warm-cream transition-colors duration-300 hover:text-lemon-zest after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-lemon-zest after:transition-transform after:duration-300 after:ease-out ${isActive('/', '#menu') ? 'text-lemon-zest after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left'}`}>
            Menu
          </a>
          <a href="/#about" className={`relative py-1.5 px-3 font-sans text-body-sm font-normal tracking-[0.64px] uppercase text-warm-cream transition-colors duration-300 hover:text-lemon-zest after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-lemon-zest after:transition-transform after:duration-300 after:ease-out ${isActive('/', '#about') ? 'text-lemon-zest after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left'}`}>
            About Us
          </a>
          <a href="/#contact" className={`relative py-1.5 px-3 font-sans text-body-sm font-normal tracking-[0.64px] uppercase text-warm-cream transition-colors duration-300 hover:text-lemon-zest after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-lemon-zest after:transition-transform after:duration-300 after:ease-out ${isActive('/', '#contact') ? 'text-lemon-zest after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left'}`}>
            Contact
          </a>
        </div>

        {/* Centered Brand Name */}
        <div className="font-sans text-heading-lg font-medium tracking-[1.84px] uppercase text-warm-cream text-center">
          <Link to="/">LIMÓN</Link>
        </div>

        {/* Right Link Group */}
        <div className="flex items-center gap-5 w-full md:w-[38%] justify-center md:justify-end">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="relative py-1.5 px-3 font-sans text-body-sm font-normal tracking-[0.64px] uppercase text-warm-cream transition-colors duration-300 hover:text-lemon-zest after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-lemon-zest after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left after:transition-transform after:duration-300 after:ease-out"
          >
            FOLLOW US
          </a>
          <Link to="/admin" className={`relative py-1.5 px-3 font-sans text-body-sm font-normal tracking-[0.64px] uppercase text-warm-cream transition-colors duration-300 hover:text-lemon-zest flex items-center after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-lemon-zest after:transition-transform after:duration-300 after:ease-out ${isActive('/admin') ? 'text-lemon-zest after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left'}`}>
            <Lock size={14} className="mr-1" /> ADMIN
          </Link>
          <button onClick={() => setIsCartOpen(true)} className="relative flex items-center justify-center text-warm-cream p-1 hover:text-lemon-zest transition-colors duration-300">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-lemon-zest text-black-olive text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}
