import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function ReservationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f7ea48', '#103b15', '#fcf9f0']
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
        specialRequests: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to submit reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reservations" className="reservation-section section-padding">
      <div className="container reservation-container">
        <div className="reservation-info">
          <span className="section-subtitle text-lemon">RESERVATIONS</span>
          <h2 className="section-title text-cream">Experience the Candlelight</h2>
          <p className="section-text text-cream-muted">
            Secure your table at Limón. Under moody olive-black canvases, bathed in warm overhead illumination, discover our signature still-life culinary expressions.
          </p>
          <div className="brasserie-hours">
            <h4 className="hours-title">Hours of Illumination</h4>
            <p className="hours-detail">Wednesday — Sunday: 5:00 PM — 11:30 PM</p>
            <p className="hours-detail">Monday — Tuesday: Closed for Culinary Prep</p>
          </div>
        </div>

        <div className="reservation-card">
          {success ? (
            <div className="reservation-success">
              <h3 className="success-heading">Table Reserved</h3>
              <p className="success-text">
                Your reservation at Limón has been recorded. We will illuminate your table and send a confirmation email shortly.
              </p>
              <button onClick={() => setSuccess(false)} className="filled-cta-btn">
                BOOK ANOTHER TABLE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="reservation-form">
              {error && <div className="form-error-msg">{error}</div>}

              <div className="form-group-row">
                <div className="form-input-group">
                  <label htmlFor="name">NAME</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                  />
                </div>
                <div className="form-input-group">
                  <label htmlFor="email">EMAIL</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-input-group">
                  <label htmlFor="phone">PHONE</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-input-group">
                  <label htmlFor="guests">GUESTS</label>
                  <select
                    id="guests"
                    name="guests"
                    required
                    value={formData.guests}
                    onChange={handleChange}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-input-group">
                  <label htmlFor="date">DATE</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-input-group">
                  <label htmlFor="time">TIME</label>
                  <select
                    id="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                  >
                    <option value="">Select Time</option>
                    {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-input-group">
                <label htmlFor="specialRequests">SPECIAL REQUESTS (OPTIONAL)</label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows="3"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Dietary details, birthday events, or seating requests..."
                />
              </div>

              <button type="submit" disabled={loading} className="filled-cta-btn submit-btn">
                {loading ? 'SECURING TABLE...' : 'RESERVE TABLE'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
