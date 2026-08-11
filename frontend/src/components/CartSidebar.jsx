import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartSidebar() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart
  } = useCart();

  const [checkoutData, setCheckoutData] = useState({
    customerName: '',
    email: '',
    phone: '',
    orderType: 'pickup'
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState('');

  if (!isCartOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    setError('');

    const formattedItems = cartItems.map((item) => ({
      menuId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    const orderPayload = {
      ...checkoutData,
      items: formattedItems,
      totalAmount: cartTotal
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Checkout failed');
      }

      setOrderPlaced(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f7ea48', '#103b15', '#fcf9f0']
      });

      clearCart();
      setCheckoutData({
        customerName: '',
        email: '',
        phone: '',
        orderType: 'pickup'
      });
    } catch (err) {
      setError(err.message || 'Order submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-overlay animate-fade-in">
      <div className="cart-backdrop" onClick={() => setIsCartOpen(false)}></div>
      <div className="cart-panel">
        <div className="cart-header">
          <h3 className="cart-title">YOUR SELECTIONS</h3>
          <button className="cart-close-btn" onClick={() => {
            setIsCartOpen(false);
            setOrderPlaced(false);
          }}>
            <X size={20} />
          </button>
        </div>

        {orderPlaced ? (
          <div className="cart-success-view">
            <h4 className="success-heading">Order Placed Successfully!</h4>
            <p className="success-body">
              Your gourmet selections have been sent to the brasserie kitchen. We will start preparation shortly.
            </p>
            <button
              onClick={() => {
                setOrderPlaced(false);
                setIsCartOpen(false);
              }}
              className="filled-cta-btn"
            >
              CONTINUE BROWSING
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="cart-empty-view">
            <p className="empty-message">Your order tray is currently empty.</p>
            <button onClick={() => setIsCartOpen(false)} className="filled-cta-btn">
              EXPLORE MENU
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h5 className="cart-item-name">{item.name}</h5>
                    <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                    <div className="cart-item-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-count">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        className="delete-item-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-total-row">
                <span>SUBTOTAL</span>
                <span className="total-val">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="checkout-form">
              <h4 className="checkout-form-title">CHECKOUT DETAILS</h4>
              {error && <div className="checkout-error">{error}</div>}

              <div className="checkout-input-group">
                <label htmlFor="customerName">NAME</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  required
                  value={checkoutData.customerName}
                  onChange={handleChange}
                  placeholder="Enter name"
                />
              </div>

              <div className="checkout-input-group">
                <label htmlFor="email">EMAIL</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={checkoutData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              <div className="checkout-input-group">
                <label htmlFor="phone">PHONE</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={checkoutData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="checkout-input-group">
                <label htmlFor="orderType">ORDER TYPE</label>
                <select
                  id="orderType"
                  name="orderType"
                  required
                  value={checkoutData.orderType}
                  onChange={handleChange}
                >
                  <option value="pickup">Curbside Pickup</option>
                  <option value="dine-in">Dine-In prep</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="filled-cta-btn checkout-submit-btn">
                {loading ? 'SUBMITTING ORDER...' : `PLACE ORDER • $${cartTotal.toFixed(2)}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
