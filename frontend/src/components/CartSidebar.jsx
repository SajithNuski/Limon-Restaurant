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
    <div className="fixed top-0 left-0 w-screen h-screen z-[200] flex justify-end animate-fade-in">
      <div className="absolute top-0 left-0 w-full h-full bg-black/60" onClick={() => setIsCartOpen(false)}></div>
      <div className="relative z-10 w-full sm:w-[440px] h-full bg-black-olive border-l border-sage-mist/10 flex flex-col p-[30px] overflow-y-auto">
        <div className="flex justify-between items-center mb-[30px]">
          <h3 className="text-body-lg tracking-[0.64px] uppercase text-warm-cream">YOUR SELECTIONS</h3>
          <button className="text-warm-cream hover:text-lemon-zest transition-colors duration-200" onClick={() => {
            setIsCartOpen(false);
            setOrderPlaced(false);
          }}>
            <X size={20} />
          </button>
        </div>

        {orderPlaced ? (
          <div className="text-center my-auto">
            <h4 className="text-subheading text-lemon-zest mb-4 tracking-[1px]">Order Placed Successfully!</h4>
            <p className="text-body-sm mb-[30px] text-warm-cream/80 leading-[1.5]">
              Your gourmet selections have been sent to the brasserie kitchen. We will start preparation shortly.
            </p>
            <button
              onClick={() => {
                setOrderPlaced(false);
                setIsCartOpen(false);
              }}
              className="font-sans text-body-sm font-semibold tracking-[0.64px] uppercase bg-lemon-zest text-black-olive py-3 px-5 rounded-[1px] transition-opacity duration-200 text-center hover:opacity-90 inline-block w-full"
            >
              CONTINUE BROWSING
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center my-auto">
            <p className="text-body-sm text-warm-cream/60 mb-5">Your order tray is currently empty.</p>
            <button onClick={() => setIsCartOpen(false)} className="font-sans text-body-sm font-semibold tracking-[0.64px] uppercase bg-lemon-zest text-black-olive py-3 px-5 rounded-[1px] transition-opacity duration-200 text-center hover:opacity-90 inline-block w-full">
              EXPLORE MENU
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-5 mb-[30px]">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3 pb-4 border-b border-sage-mist/10">
                  <img src={item.image} alt={item.name} className="w-[70px] h-[70px] object-cover rounded-[1px]" />
                  <div className="flex flex-col flex-grow">
                    <h5 className="text-body-sm font-medium text-warm-cream mb-1">{item.name}</h5>
                    <div className="text-body-sm font-semibold text-lemon-zest mb-2">${(item.price * item.quantity).toFixed(2)}</div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-[22px] h-[22px] border border-sage-mist/30 flex items-center justify-center text-warm-cream rounded-[1px] hover:border-lemon-zest hover:text-lemon-zest transition-colors duration-200"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-[14px] min-w-[16px] text-center text-warm-cream">{item.quantity}</span>
                      <button
                        className="w-[22px] h-[22px] border border-sage-mist/30 flex items-center justify-center text-warm-cream rounded-[1px] hover:border-lemon-zest hover:text-lemon-zest transition-colors duration-200"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        className="text-warm-cream/40 ml-auto hover:text-red-400 transition-colors duration-200"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-sage-mist/20 pt-4 mb-[30px]">
              <div className="flex justify-between text-body-lg font-semibold text-warm-cream">
                <span>SUBTOTAL</span>
                <span className="text-lemon-zest">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="border-t border-sage-mist/10 pt-6 flex flex-col gap-4">
              <h4 className="text-caption tracking-[0.84px] text-warm-cream/50 mb-1">CHECKOUT DETAILS</h4>
              {error && <div className="text-[#ff6b6b] text-body-sm bg-red-500/10 p-2 border border-red-500/10 rounded-[1px]">{error}</div>}

              <div className="flex flex-col gap-1">
                <label htmlFor="customerName" className="text-[11px] tracking-[0.84px] text-warm-cream/40">NAME</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  required
                  value={checkoutData.customerName}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="border border-sage-mist/20 bg-black/20 text-warm-cream p-2.5 rounded-[1px] text-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-[11px] tracking-[0.84px] text-warm-cream/40">EMAIL</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={checkoutData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="border border-sage-mist/20 bg-black/20 text-warm-cream p-2.5 rounded-[1px] text-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="text-[11px] tracking-[0.84px] text-warm-cream/40">PHONE</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={checkoutData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="border border-sage-mist/20 bg-black/20 text-warm-cream p-2.5 rounded-[1px] text-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="orderType" className="text-[11px] tracking-[0.84px] text-warm-cream/40">ORDER TYPE</label>
                <select
                  id="orderType"
                  name="orderType"
                  required
                  value={checkoutData.orderType}
                  onChange={handleChange}
                  className="border border-sage-mist/20 bg-black/20 text-warm-cream p-2.5 rounded-[1px] text-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
                >
                  <option value="pickup" className="bg-black-olive text-warm-cream">Curbside Pickup</option>
                  <option value="dine-in" className="bg-black-olive text-warm-cream">Dine-In prep</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="mt-2.5 w-full font-sans text-body-sm font-semibold tracking-[0.64px] uppercase bg-lemon-zest text-black-olive py-3 px-5 rounded-[1px] transition-opacity duration-200 text-center hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'SUBMITTING ORDER...' : `PLACE ORDER • $${cartTotal.toFixed(2)}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
