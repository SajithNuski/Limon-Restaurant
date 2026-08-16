import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

export default function ReservationForm() {
  const { t } = useLanguage();
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/reservations`, {
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
    <section id="reservations" className="bg-black-olive border-t border-sage-mist/10 py-[60px]">
      <div className="max-w-[1200px] mx-auto px-5 w-full flex flex-col lg:flex-row justify-between gap-[50px]">
        <div className="w-full lg:w-[40%]">
          <span className="block text-caption tracking-[0.84px] font-semibold uppercase mb-2 text-lemon-zest">
            {t('reservations.tag')}
          </span>
          <h2 className="text-heading font-medium tracking-[1.08px] mb-3 uppercase text-warm-cream">
            {t('reservations.title')}
          </h2>
          <p className="text-body-lg leading-[1.5] mb-[30px] text-warm-cream/70">
            {t('reservations.subtitle')}
          </p>
          <div className="border-t border-sage-mist/20 pt-5">
            <h4 className="text-body-lg tracking-[0.4px] mb-2 text-warm-cream">
              {t('reservations.hoursTitle')}
            </h4>
            <p className="text-body-sm text-warm-cream/60 mb-1">{t('reservations.hoursWedSun')}</p>
            <p className="text-body-sm text-warm-cream/60 mb-1">{t('reservations.hoursMonTue')}</p>
          </div>
        </div>

        <div className="w-full lg:w-[55%] bg-white/[0.02] p-10 border border-sage-mist/10 rounded-[1px]">
          {success ? (
            <div className="text-center py-10">
              <h3 className="text-subheading text-lemon-zest mb-4 tracking-[1px]">
                {t('reservations.successTitle')}
              </h3>
              <p className="text-body-sm mb-[30px] text-warm-cream/80">
                {t('reservations.successText')}
              </p>
              <button 
                onClick={() => setSuccess(false)} 
                className="font-sans text-body-sm font-semibold tracking-[0.64px] uppercase bg-lemon-zest text-black-olive py-3 px-5 rounded-[1px] transition-opacity duration-200 text-center hover:opacity-90 inline-block"
              >
                {t('reservations.bookAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && <div className="bg-red-500/10 text-[#ff6b6b] border border-red-500/20 p-3 text-body-sm rounded-[1px]">{error}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="text-[12px] tracking-[0.84px] text-warm-cream/50 font-semibold">
                    {t('reservations.labels.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('reservations.placeholders.name')}
                    className="border border-sage-mist/20 bg-black/20 text-warm-cream p-3 rounded-[1px] text-body-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-[12px] tracking-[0.84px] text-warm-cream/50 font-semibold">
                    {t('reservations.labels.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('reservations.placeholders.email')}
                    className="border border-sage-mist/20 bg-black/20 text-warm-cream p-3 rounded-[1px] text-body-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="phone" className="text-[12px] tracking-[0.84px] text-warm-cream/50 font-semibold">
                    {t('reservations.labels.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('reservations.placeholders.phone')}
                    className="border border-sage-mist/20 bg-black/20 text-warm-cream p-3 rounded-[1px] text-body-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="guests" className="text-[12px] tracking-[0.84px] text-warm-cream/50 font-semibold">
                    {t('reservations.labels.guests')}
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    required
                    value={formData.guests}
                    onChange={handleChange}
                    className="border border-sage-mist/20 bg-black/20 text-warm-cream p-3 rounded-[1px] text-body-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n} className="bg-black-olive text-warm-cream">
                        {n} {n === 1 ? t('reservations.guestOptions.singular') : t('reservations.guestOptions.plural')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="date" className="text-[12px] tracking-[0.84px] text-warm-cream/50 font-semibold">
                    {t('reservations.labels.date')}
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="border border-sage-mist/20 bg-black/20 text-warm-cream p-3 rounded-[1px] text-body-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="time" className="text-[12px] tracking-[0.84px] text-warm-cream/50 font-semibold">
                    {t('reservations.labels.time')}
                  </label>
                  <select
                    id="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="border border-sage-mist/20 bg-black/20 text-warm-cream p-3 rounded-[1px] text-body-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200"
                  >
                    <option value="" className="bg-black-olive text-warm-cream">
                      {t('reservations.placeholders.time')}
                    </option>
                    {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map((tVal) => (
                      <option key={tVal} value={tVal} className="bg-black-olive text-warm-cream">
                        {tVal}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="specialRequests" className="text-[12px] tracking-[0.84px] text-warm-cream/50 font-semibold">
                  {t('reservations.labels.special')}
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows="3"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder={t('reservations.placeholders.special')}
                  className="border border-sage-mist/20 bg-black/20 text-warm-cream p-3 rounded-[1px] text-body-sm focus:outline-none focus:border-lemon-zest transition-colors duration-200 resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="mt-2.5 w-full font-sans text-body-sm font-semibold tracking-[0.64px] uppercase bg-lemon-zest text-black-olive py-3 px-5 rounded-[1px] transition-opacity duration-200 text-center hover:opacity-90 disabled:opacity-50"
              >
                {loading ? t('reservations.placeholders.submitting') : t('reservations.placeholders.submit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

