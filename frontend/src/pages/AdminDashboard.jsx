import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, ShoppingBag, Plus, Coffee, Trash2, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const { admin, login, logout, loading: authLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState('reservations'); // reservations, orders, menu
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [apiError, setApiError] = useState('');

  // Add menu item state
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Mains',
    image: '',
    isFeatured: false
  });
  const [menuSubmitting, setMenuSubmitting] = useState(false);

  // Fetch admin dashboard data
  useEffect(() => {
    if (admin) {
      fetchDashboardData();
    }
  }, [admin, activeTab]);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    setApiError('');
    const headers = {
      'Authorization': `Bearer ${admin.token}`
    };

    try {
      if (activeTab === 'reservations') {
        const res = await fetch('/api/reservations', { headers });
        if (!res.ok) throw new Error('Failed to load reservations');
        const data = await res.json();
        setReservations(data);
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/orders', { headers });
        if (!res.ok) throw new Error('Failed to load orders');
        const data = await res.json();
        setOrders(data);
      } else if (activeTab === 'menu') {
        const res = await fetch('/api/menu');
        if (!res.ok) throw new Error('Failed to load menu items');
        const data = await res.json();
        setMenuItems(data);
      }
    } catch (err) {
      console.warn('Backend API connection error. Displaying mock admin data.');
      setApiError('API connection failed. Operating in standalone demo mode.');
      loadMockData();
    } finally {
      setLoadingData(false);
    }
  };

  const loadMockData = () => {
    if (activeTab === 'reservations') {
      setReservations([
        {
          _id: 'res_1',
          name: 'Adrian Sterling',
          email: 'adrian@example.com',
          phone: '+1 (555) 304-2098',
          date: '2026-08-15',
          time: '19:30',
          guests: 4,
          specialRequests: 'Window seat, celebrating anniversary.',
          status: 'confirmed',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'res_2',
          name: 'Isabella Vance',
          email: 'isabella.v@example.com',
          phone: '+1 (555) 293-4921',
          date: '2026-08-16',
          time: '20:00',
          guests: 2,
          specialRequests: 'Gluten free bread request.',
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]);
    } else if (activeTab === 'orders') {
      setOrders([
        {
          _id: 'ord_1',
          customerName: 'Marcus Aurelius',
          email: 'marcus@philosophy.com',
          phone: '+1 (555) 443-8821',
          items: [
            { menuId: 'm_1', name: 'Yellowtail Ceviche & Mango', price: 18, quantity: 2 },
            { menuId: 'm_11', name: 'The candlelight Sour', price: 16, quantity: 2 }
          ],
          totalAmount: 68.00,
          orderType: 'pickup',
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]);
    } else if (activeTab === 'menu') {
      setMenuItems([
        {
          _id: 'm_1',
          name: 'Yellowtail Ceviche & Mango',
          description: 'Fresh yellowtail sashimi, compressed mango, red onion, chili crisp, cilantro.',
          price: 18.00,
          category: 'Appetizers',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
          available: true,
          isFeatured: true
        }
      ]);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    
    const result = await login(username, password);
    if (!result.success) {
      setLoginError(result.error || 'Invalid credentials');
    }
    setLoginLoading(false);
  };

  // Update Reservation Status
  const handleUpdateReservationStatus = async (id, status) => {
    if (apiError) {
      setReservations(prev =>
        prev.map(r => r._id === id ? { ...r, status } : r)
      );
      return;
    }

    try {
      const res = await fetch(`/api/reservations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin.token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Status update failed');
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (id, status) => {
    if (apiError) {
      setOrders(prev =>
        prev.map(o => o._id === id ? { ...o, status } : o)
      );
      return;
    }

    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin.token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Status update failed');
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Add Menu Item
  const handleAddDish = async (e) => {
    e.preventDefault();
    setMenuSubmitting(true);

    if (apiError) {
      const mockNewDish = {
        ...newDish,
        _id: 'm_' + Date.now(),
        price: Number(newDish.price),
        available: true
      };
      setMenuItems(prev => [...prev, mockNewDish]);
      setNewDish({ name: '', description: '', price: '', category: 'Mains', image: '', isFeatured: false });
      setMenuSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin.token}`
        },
        body: JSON.stringify(newDish)
      });
      if (!res.ok) throw new Error('Failed to create dish');
      setNewDish({ name: '', description: '', price: '', category: 'Mains', image: '', isFeatured: false });
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    } finally {
      setMenuSubmitting(false);
    }
  };

  // Delete Menu Item
  const handleDeleteDish = async (id) => {
    if (apiError) {
      setMenuItems(prev => prev.filter(m => m._id !== id));
      return;
    }

    if (!window.confirm('Delete this menu item?')) return;

    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${admin.token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete dish');
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (authLoading) {
    return (
      <div className="text-body-lg text-warm-cream bg-black-olive flex items-center justify-center h-screen tracking-[2px]">
        SECURE PORTAL INITIALIZING...
      </div>
    );
  }

  // 1. LOGIN SCREEN
  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-black-olive py-10 px-5">
        <div className="w-full max-w-[420px] bg-white/[0.02] border border-sage-mist/10 p-10 rounded-[1px]">
          <div className="text-center mb-[30px]">
            <h2 className="text-heading-lg tracking-[1.84px] text-lemon-zest mb-2">LIMÓN</h2>
            <p className="text-caption tracking-[0.84px] text-warm-cream/60 font-semibold">ADMINISTRATOR CONTROL PORTAL</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
            {loginError && <div className="bg-red-500/10 text-[#ff6b6b] border border-red-500/20 p-2.5 text-body-sm rounded-[1px]">{loginError}</div>}
            
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-[11px] tracking-[0.84px] text-warm-cream/50 font-semibold">USERNAME</label>
              <input
                type="text"
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="border border-sage-mist/20 bg-black/20 text-warm-cream p-3 rounded-[1px] text-body-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[11px] tracking-[0.84px] text-warm-cream/50 font-semibold">PASSWORD</label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border border-sage-mist/20 bg-black/20 text-warm-cream p-3 rounded-[1px] text-body-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
              />
            </div>

            <button type="submit" disabled={loginLoading} className="w-full font-sans text-body-sm font-semibold tracking-[0.64px] uppercase bg-lemon-zest text-black-olive py-3 px-5 rounded-[1px] transition-opacity duration-200 text-center hover:opacity-90 disabled:opacity-50">
              {loginLoading ? 'AUTHENTICATING...' : 'ACCESS PORTAL'}
            </button>
          </form>
          <div className="text-[12px] text-warm-cream/40 mt-4 text-center">
            * Demo access details: <strong>admin</strong> / <strong>password123</strong>
          </div>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD MAIN VIEW
  return (
    <div className="min-h-screen bg-black-olive text-warm-cream flex flex-col">
      <header className="flex justify-between items-center py-5 px-10 border-b border-sage-mist/10">
        <div className="flex items-center gap-3">
          <h2 className="text-body-lg font-medium tracking-[0.4px] text-warm-cream">LIMÓN ADMIN</h2>
          <span className="text-[10px] tracking-widest text-lemon-zest border border-lemon-zest py-0.5 px-1.5 rounded-[1px]">SECURE WORKSPACE</span>
        </div>
        <button onClick={logout} className="text-caption font-semibold text-warm-cream/60 flex items-center gap-1.5 hover:text-lemon-zest transition-colors duration-200">
          <LogOut size={16} /> LOGOUT
        </button>
      </header>

      {apiError && (
        <div className="bg-[#f7ea48]/10 border-b border-[#f7ea48]/20 py-2.5 px-10 flex items-center gap-2.5 text-body-sm text-lemon-zest">
          <ShieldAlert size={16} />
          <span>{apiError} Operations are running locally.</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-[280px] md:border-r border-b border-sage-mist/10 py-[30px] px-4 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-3 py-3 px-4 text-body-sm font-medium text-warm-cream/60 rounded-[1px] transition-all duration-200 text-left hover:bg-white/[0.03] hover:text-warm-cream ${activeTab === 'reservations' ? 'bg-white/[0.05] !text-lemon-zest' : ''}`}
          >
            <Calendar size={18} />
            <span>RESERVATIONS ({reservations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 py-3 px-4 text-body-sm font-medium text-warm-cream/60 rounded-[1px] transition-all duration-200 text-left hover:bg-white/[0.03] hover:text-warm-cream ${activeTab === 'orders' ? 'bg-white/[0.05] !text-lemon-zest' : ''}`}
          >
            <ShoppingBag size={18} />
            <span>ORDERS ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-3 py-3 px-4 text-body-sm font-medium text-warm-cream/60 rounded-[1px] transition-all duration-200 text-left hover:bg-white/[0.03] hover:text-warm-cream ${activeTab === 'menu' ? 'bg-white/[0.05] !text-lemon-zest' : ''}`}
          >
            <Coffee size={18} />
            <span>MANAGE MENU ({menuItems.length})</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-grow p-5 md:p-10 overflow-y-auto">
          {loadingData ? (
            <div className="text-body-sm text-warm-cream/40 tracking-[2px] text-center py-20">RETRIEVING SECURE DATA...</div>
          ) : (
            <>
              {/* TAB 1: RESERVATIONS */}
              {activeTab === 'reservations' && (
                <div className="flex flex-col gap-[30px]">
                  <h3 className="text-caption tracking-[0.84px] text-lemon-zest font-semibold">BOOKINGS JOURNAL</h3>
                  {reservations.length === 0 ? (
                    <p className="text-body-sm text-warm-cream/40">No tables reserved yet.</p>
                  ) : (
                    <div className="border border-sage-mist/10 rounded-[1px] overflow-x-auto">
                      <table className="w-full border-collapse text-sm text-left">
                        <thead>
                          <tr className="border-b border-sage-mist/10">
                            <th className="py-4 px-5 font-semibold text-warm-cream/50 text-[11px] tracking-[0.84px] uppercase">CUSTOMER</th>
                            <th className="py-4 px-5 font-semibold text-warm-cream/50 text-[11px] tracking-[0.84px] uppercase">DATE & TIME</th>
                            <th className="py-4 px-5 font-semibold text-warm-cream/50 text-[11px] tracking-[0.84px] uppercase">GUESTS</th>
                            <th className="py-4 px-5 font-semibold text-warm-cream/50 text-[11px] tracking-[0.84px] uppercase">SPECIAL REQUESTS</th>
                            <th className="py-4 px-5 font-semibold text-warm-cream/50 text-[11px] tracking-[0.84px] uppercase">STATUS</th>
                            <th className="py-4 px-5 font-semibold text-warm-cream/50 text-[11px] tracking-[0.84px] uppercase">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservations.map((res) => (
                            <tr key={res._id} className={`border-b border-sage-mist/5 ${res.status === 'cancelled' ? 'opacity-50' : ''}`}>
                              <td className="py-4 px-5">
                                <div className="font-medium text-warm-cream">{res.name}</div>
                                <div className="text-[12px] text-warm-cream/40">{res.phone} | {res.email}</div>
                              </td>
                              <td className="py-4 px-5">{res.date} @ {res.time}</td>
                              <td className="py-4 px-5">{res.guests} Pax</td>
                              <td className="py-4 px-5 max-w-[250px] italic text-warm-cream/70">{res.specialRequests || '—'}</td>
                              <td className="py-4 px-5">
                                <span className={`text-[10px] font-semibold py-1 px-2 rounded-full inline-block ${
                                  res.status === 'pending' ? 'bg-lemon-zest/10 text-lemon-zest' :
                                  res.status === 'confirmed' ? 'bg-[#48f76b]/10 text-[#48f76b]' :
                                  res.status === 'completed' ? 'bg-white/5 text-warm-cream/50' :
                                  'bg-red-500/10 text-red-500'
                                }`}>
                                  {res.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-4 px-5">
                                {res.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleUpdateReservationStatus(res._id, 'confirmed')}
                                      className="text-[11px] font-semibold py-1.5 px-3 rounded-[1px] transition-opacity duration-200 hover:opacity-80 bg-lemon-zest text-black-olive"
                                    >
                                      CONFIRM
                                    </button>
                                    <button
                                      onClick={() => handleUpdateReservationStatus(res._id, 'cancelled')}
                                      className="text-[11px] font-semibold py-1.5 px-3 rounded-[1px] transition-opacity duration-200 hover:opacity-80 bg-red-500/15 text-red-500 border border-red-500/20"
                                    >
                                      CANCEL
                                    </button>
                                  </div>
                                )}
                                {res.status !== 'pending' && <span className="text-warm-cream/40">—</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ORDERS */}
              {activeTab === 'orders' && (
                <div className="flex flex-col gap-[30px]">
                  <h3 className="text-caption tracking-[0.84px] text-lemon-zest font-semibold">KITCHEN SLIPS</h3>
                  {orders.length === 0 ? (
                    <p className="text-body-sm text-warm-cream/40">No active orders placed yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {orders.map((ord) => (
                        <div key={ord._id} className="bg-white/[0.02] border border-sage-mist/8 p-6 rounded-[1px] flex flex-col gap-4">
                          <div className="flex justify-between items-center border-b border-sage-mist/5 pb-3">
                            <span className="text-body-sm font-semibold">SLIP #{ord._id.substr(-6).toUpperCase()}</span>
                            <span className={`text-[10px] font-semibold py-1 px-2 rounded-full inline-block ${
                              ord.status === 'pending' ? 'bg-lemon-zest/10 text-lemon-zest' :
                              ord.status === 'preparing' ? 'bg-[#f7ea48]/20 text-[#f7ea48]' :
                              ord.status === 'completed' ? 'bg-[#48f76b]/10 text-[#48f76b]' :
                              'bg-red-500/10 text-red-500'
                            }`}>
                              {ord.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="text-sm text-warm-cream/70">
                            <div className="text-[16px] font-medium text-warm-cream mb-1">{ord.customerName}</div>
                            <div>Type: <strong>{ord.orderType.toUpperCase()}</strong></div>
                            <div>{ord.phone}</div>
                          </div>

                          <div className="bg-black/15 p-3 px-4 rounded-[1px]">
                            <h5 className="text-[11px] tracking-[0.84px] text-warm-cream/40 mb-2">ITEMS</h5>
                            <ul className="list-none flex flex-col gap-1.5">
                              {ord.items.map((it, idx) => (
                                <li key={idx} className="flex justify-between text-[13px]">
                                  <span>{it.quantity}x {it.name}</span>
                                  <span>${(it.price * it.quantity).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-auto pt-3 border-t border-sage-mist/5 flex justify-between items-center">
                            <div className="flex items-baseline gap-2 text-[12px]">
                              <span>TOTAL:</span>
                              <strong className="text-base text-lemon-zest">${ord.totalAmount.toFixed(2)}</strong>
                            </div>
                            
                            <div className="flex gap-2">
                              {ord.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord._id, 'preparing')}
                                  className="text-[11px] font-semibold py-1.5 px-3 rounded-[1px] transition-opacity duration-200 hover:opacity-80 bg-lemon-zest text-black-olive"
                                >
                                  PREPARE
                                </button>
                              )}
                              {ord.status === 'preparing' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord._id, 'completed')}
                                  className="text-[11px] font-semibold py-1.5 px-3 rounded-[1px] transition-opacity duration-200 hover:opacity-80 bg-lemon-zest text-black-olive"
                                >
                                  COMPLETE
                                </button>
                              )}
                              {['pending', 'preparing'].includes(ord.status) && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord._id, 'cancelled')}
                                  className="text-[11px] font-semibold py-1.5 px-3 rounded-[1px] transition-opacity duration-200 hover:opacity-80 bg-red-500/15 text-red-500 border border-red-500/20"
                                >
                                  CANCEL
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MANAGE MENU */}
              {activeTab === 'menu' && (
                <div className="flex flex-col gap-[30px]">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10">
                    {/* Add Dish Form */}
                    <div className="bg-white/[0.02] border border-sage-mist/8 p-[30px] rounded-[1px]">
                      <h4 className="text-body-sm font-semibold tracking-[0.64px] text-lemon-zest mb-6">ADD CULINARY ART</h4>
                      <form onSubmit={handleAddDish} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="dish-name" className="text-[11px] tracking-[0.84px] text-warm-cream/40">DISH NAME</label>
                          <input
                            type="text"
                            id="dish-name"
                            required
                            value={newDish.name}
                            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                            placeholder="e.g. Lime Caviar Salmon"
                            className="border border-sage-mist/20 bg-black/20 text-warm-cream p-2.5 rounded-[1px] text-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label htmlFor="dish-price" className="text-[11px] tracking-[0.84px] text-warm-cream/40">PRICE ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              id="dish-price"
                              required
                              value={newDish.price}
                              onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                              placeholder="24.00"
                              className="border border-sage-mist/20 bg-black/20 text-warm-cream p-2.5 rounded-[1px] text-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label htmlFor="dish-category" className="text-[11px] tracking-[0.84px] text-warm-cream/40">CATEGORY</label>
                            <select
                              id="dish-category"
                              value={newDish.category}
                              onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                              className="border border-sage-mist/20 bg-black/20 text-warm-cream p-2.5 rounded-[1px] text-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
                            >
                              <option value="Appetizers" className="bg-black-olive text-warm-cream">Appetizers</option>
                              <option value="Mains" className="bg-black-olive text-warm-cream">Mains</option>
                              <option value="Sides" className="bg-black-olive text-warm-cream">Sides</option>
                              <option value="Desserts" className="bg-black-olive text-warm-cream">Desserts</option>
                              <option value="Drinks" className="bg-black-olive text-warm-cream">Drinks</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor="dish-image" className="text-[11px] tracking-[0.84px] text-warm-cream/40">IMAGE URL</label>
                          <input
                            type="url"
                            id="dish-image"
                            required
                            value={newDish.image}
                            onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="border border-sage-mist/20 bg-black/20 text-warm-cream p-2.5 rounded-[1px] text-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor="dish-desc" className="text-[11px] tracking-[0.84px] text-warm-cream/40">DESCRIPTION</label>
                          <textarea
                            id="dish-desc"
                            required
                            rows="3"
                            value={newDish.description}
                            onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                            placeholder="Detail flavor pairings..."
                            className="border border-sage-mist/20 bg-black/20 text-warm-cream p-2.5 rounded-[1px] text-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200 resize-none"
                          />
                        </div>

                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            id="dish-featured"
                            checked={newDish.isFeatured}
                            onChange={(e) => setNewDish({ ...newDish, isFeatured: e.target.checked })}
                            className="border border-sage-mist/20 bg-black/20 text-warm-cream focus:outline-none"
                          />
                          <label htmlFor="dish-featured" className="text-[11px] tracking-[0.84px] text-warm-cream/50">FEATURE THIS DISH ON LANDING BANNER</label>
                        </div>

                        <button type="submit" disabled={menuSubmitting} className="w-full font-sans text-body-sm font-semibold tracking-[0.64px] uppercase bg-lemon-zest text-black-olive py-3 px-5 rounded-[1px] transition-opacity duration-200 text-center hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5">
                          <Plus size={16} /> {menuSubmitting ? 'SAVING...' : 'PUBLISH ITEM'}
                        </button>
                      </form>
                    </div>

                    {/* Dish List */}
                    <div className="flex flex-col">
                      <h4 className="text-body-sm font-semibold tracking-[0.64px] text-lemon-zest mb-6">PUBLISHED MENU</h4>
                      <div className="flex flex-col gap-4">
                        {menuItems.map((item) => (
                          <div key={item._id} className="flex gap-4 p-4 bg-white/[0.01] border border-sage-mist/5 rounded-[1px]">
                            <img src={item.image} alt={item.name} className="w-[90px] h-[90px] object-cover rounded-[1px]" />
                            <div className="flex flex-col flex-grow gap-1">
                              <div className="flex justify-between items-baseline">
                                <span className="text-[10px] text-lemon-zest tracking-[0.5px]">{item.category.toUpperCase()}</span>
                                <span className="text-body-sm font-semibold">${Number(item.price).toFixed(2)}</span>
                              </div>
                              <h5 className="text-[16px] font-medium text-warm-cream">{item.name}</h5>
                              {item.isFeatured && <span className="text-[9px] font-semibold bg-lemon-zest text-black-olive py-0.5 px-1.5 rounded-full self-start">FEATURED</span>}
                              <button
                                onClick={() => handleDeleteDish(item._id)}
                                className="text-red-500/80 text-[11px] self-start flex items-center gap-1 mt-1 hover:text-red-400 transition-colors duration-200"
                                title="Remove dish"
                              >
                                <Trash2 size={14} /> REMOVE
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
