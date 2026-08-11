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
        const res = await fetch('http://localhost:5000/api/reservations', { headers });
        if (!res.ok) throw new Error('Failed to load reservations');
        const data = await res.json();
        setReservations(data);
      } else if (activeTab === 'orders') {
        const res = await fetch('http://localhost:5000/api/orders', { headers });
        if (!res.ok) throw new Error('Failed to load orders');
        const data = await res.json();
        setOrders(data);
      } else if (activeTab === 'menu') {
        const res = await fetch('http://localhost:5000/api/menu');
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
      const res = await fetch(`http://localhost:5000/api/reservations/${id}/status`, {
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
      const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
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
      const res = await fetch('http://localhost:5000/api/menu', {
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
      const res = await fetch(`http://localhost:5000/api/menu/${id}`, {
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
    return <div className="admin-loading">SECURE PORTAL INITIALIZING...</div>;
  }

  // 1. LOGIN SCREEN
  if (!admin) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h2 className="admin-login-title">LIMÓN</h2>
            <p className="admin-login-subtitle">ADMINISTRATOR CONTROL PORTAL</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="admin-login-form">
            {loginError && <div className="admin-login-error">{loginError}</div>}
            
            <div className="login-input-group">
              <label htmlFor="username">USERNAME</label>
              <input
                type="text"
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
              />
            </div>

            <div className="login-input-group">
              <label htmlFor="password">PASSWORD</label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loginLoading} className="filled-cta-btn login-btn">
              {loginLoading ? 'AUTHENTICATING...' : 'ACCESS PORTAL'}
            </button>
          </form>
          <div className="login-hint">
            * Demo access details: <strong>admin</strong> / <strong>password123</strong>
          </div>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD MAIN VIEW
  return (
    <div className="admin-dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-title-area">
          <h2 className="dashboard-title">LIMÓN ADMIN</h2>
          <span className="admin-tag">SECURE WORKSPACE</span>
        </div>
        <button onClick={logout} className="logout-btn">
          <LogOut size={16} /> LOGOUT
        </button>
      </header>

      {apiError && (
        <div className="api-warning-banner">
          <ShieldAlert size={16} />
          <span>{apiError} Operations are running locally.</span>
        </div>
      )}

      <div className="dashboard-body">
        {/* Sidebar Nav */}
        <aside className="dashboard-sidebar">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`sidebar-nav-item ${activeTab === 'reservations' ? 'nav-active' : ''}`}
          >
            <Calendar size={18} />
            <span>RESERVATIONS ({reservations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`sidebar-nav-item ${activeTab === 'orders' ? 'nav-active' : ''}`}
          >
            <ShoppingBag size={18} />
            <span>ORDERS ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`sidebar-nav-item ${activeTab === 'menu' ? 'nav-active' : ''}`}
          >
            <Coffee size={18} />
            <span>MANAGE MENU ({menuItems.length})</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="dashboard-content">
          {loadingData ? (
            <div className="dashboard-loading">RETRIEVING SECURE DATA...</div>
          ) : (
            <>
              {/* TAB 1: RESERVATIONS */}
              {activeTab === 'reservations' && (
                <div className="tab-view">
                  <h3 className="tab-heading">BOOKINGS JOURNAL</h3>
                  {reservations.length === 0 ? (
                    <p className="no-data-msg">No tables reserved yet.</p>
                  ) : (
                    <div className="bookings-table-wrapper">
                      <table className="bookings-table">
                        <thead>
                          <tr>
                            <th>CUSTOMER</th>
                            <th>DATE & TIME</th>
                            <th>GUESTS</th>
                            <th>SPECIAL REQUESTS</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservations.map((res) => (
                            <tr key={res._id} className={`status-row-${res.status}`}>
                              <td>
                                <div className="client-name">{res.name}</div>
                                <div className="client-contact">{res.phone} | {res.email}</div>
                              </td>
                              <td>{res.date} @ {res.time}</td>
                              <td>{res.guests} Pax</td>
                              <td className="requests-cell">{res.specialRequests || '—'}</td>
                              <td>
                                <span className={`status-badge badge-${res.status}`}>
                                  {res.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="actions-cell">
                                {res.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateReservationStatus(res._id, 'confirmed')}
                                      className="action-btn btn-confirm"
                                    >
                                      CONFIRM
                                    </button>
                                    <button
                                      onClick={() => handleUpdateReservationStatus(res._id, 'cancelled')}
                                      className="action-btn btn-cancel"
                                    >
                                      CANCEL
                                    </button>
                                  </>
                                )}
                                {res.status !== 'pending' && <span className="action-done">—</span>}
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
                <div className="tab-view">
                  <h3 className="tab-heading">KITCHEN SLIPS</h3>
                  {orders.length === 0 ? (
                    <p className="no-data-msg">No active orders placed yet.</p>
                  ) : (
                    <div className="orders-grid">
                      {orders.map((ord) => (
                        <div key={ord._id} className={`order-card order-status-${ord.status}`}>
                          <div className="order-card-header">
                            <span className="order-id">SLIP #{ord._id.substr(-6).toUpperCase()}</span>
                            <span className={`status-badge badge-${ord.status}`}>
                              {ord.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="order-details-info">
                            <div className="order-client">{ord.customerName}</div>
                            <div className="order-meta">Type: <strong>{ord.orderType.toUpperCase()}</strong></div>
                            <div className="order-meta">{ord.phone}</div>
                          </div>

                          <div className="order-items-summary">
                            <h5 className="items-title">ITEMS</h5>
                            <ul className="items-list">
                              {ord.items.map((it, idx) => (
                                <li key={idx} className="item-line">
                                  <span>{it.quantity}x {it.name}</span>
                                  <span>${(it.price * it.quantity).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="order-footer">
                            <div className="order-total">
                              <span>TOTAL:</span>
                              <strong>${ord.totalAmount.toFixed(2)}</strong>
                            </div>
                            
                            <div className="order-action-buttons">
                              {ord.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord._id, 'preparing')}
                                  className="action-btn btn-confirm"
                                >
                                  PREPARE
                                </button>
                              )}
                              {ord.status === 'preparing' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord._id, 'completed')}
                                  className="action-btn btn-confirm"
                                >
                                  COMPLETE
                                </button>
                              )}
                              {['pending', 'preparing'].includes(ord.status) && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord._id, 'cancelled')}
                                  className="action-btn btn-cancel"
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
                <div className="tab-view">
                  <div className="menu-manager-split">
                    {/* Add Dish Form */}
                    <div className="menu-creator-card">
                      <h4 className="creator-heading">ADD CULINARY ART</h4>
                      <form onSubmit={handleAddDish} className="dish-form">
                        <div className="creator-group">
                          <label htmlFor="dish-name">DISH NAME</label>
                          <input
                            type="text"
                            id="dish-name"
                            required
                            value={newDish.name}
                            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                            placeholder="e.g. Lime Caviar Salmon"
                          />
                        </div>

                        <div className="creator-row">
                          <div className="creator-group">
                            <label htmlFor="dish-price">PRICE ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              id="dish-price"
                              required
                              value={newDish.price}
                              onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                              placeholder="24.00"
                            />
                          </div>

                          <div className="creator-group">
                            <label htmlFor="dish-category">CATEGORY</label>
                            <select
                              id="dish-category"
                              value={newDish.category}
                              onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                            >
                              <option value="Appetizers">Appetizers</option>
                              <option value="Mains">Mains</option>
                              <option value="Sides">Sides</option>
                              <option value="Desserts">Desserts</option>
                              <option value="Drinks">Drinks</option>
                            </select>
                          </div>
                        </div>

                        <div className="creator-group">
                          <label htmlFor="dish-image">IMAGE URL</label>
                          <input
                            type="url"
                            id="dish-image"
                            required
                            value={newDish.image}
                            onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>

                        <div className="creator-group">
                          <label htmlFor="dish-desc">DESCRIPTION</label>
                          <textarea
                            id="dish-desc"
                            required
                            rows="3"
                            value={newDish.description}
                            onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                            placeholder="Detail flavor pairings..."
                          />
                        </div>

                        <div className="checkbox-group">
                          <input
                            type="checkbox"
                            id="dish-featured"
                            checked={newDish.isFeatured}
                            onChange={(e) => setNewDish({ ...newDish, isFeatured: e.target.checked })}
                          />
                          <label htmlFor="dish-featured">FEATURE THIS DISH ON LANDING BANNER</label>
                        </div>

                        <button type="submit" disabled={menuSubmitting} className="filled-cta-btn add-dish-btn">
                          <Plus size={16} /> {menuSubmitting ? 'SAVING...' : 'PUBLISH ITEM'}
                        </button>
                      </form>
                    </div>

                    {/* Dish List */}
                    <div className="menu-list-wrapper">
                      <h4 className="creator-heading">PUBLISHED MENU</h4>
                      <div className="admin-menu-list">
                        {menuItems.map((item) => (
                          <div key={item._id} className="admin-menu-item">
                            <img src={item.image} alt={item.name} className="admin-menu-item-img" />
                            <div className="admin-menu-item-details">
                              <div className="admin-menu-item-top">
                                <span className="admin-menu-category">{item.category.toUpperCase()}</span>
                                <span className="admin-menu-price">${Number(item.price).toFixed(2)}</span>
                              </div>
                              <h5 className="admin-menu-name">{item.name}</h5>
                              {item.isFeatured && <span className="badge-featured">FEATURED</span>}
                              <button
                                onClick={() => handleDeleteDish(item._id)}
                                className="delete-dish-btn"
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
