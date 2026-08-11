const Reservation = require('../models/Reservation');
const db = require('../config/db');

// @desc    Create a reservation
// @route   POST /api/reservations
// @access  Public
const createReservation = async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, specialRequests } = req.body;
    
    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const reservationData = {
      name,
      email,
      phone,
      date,
      time,
      guests: Number(guests),
      specialRequests: specialRequests || '',
      status: 'pending'
    };

    if (db.isFallback()) {
      const newReservation = db.fallback.saveToCollection('reservations', reservationData);
      return res.status(201).json(newReservation);
    }
    
    const newReservation = await Reservation.create(reservationData);
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: 'Error booking reservation', error: error.message });
  }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Admin
const getReservations = async (req, res) => {
  try {
    if (db.isFallback()) {
      const list = db.fallback.getCollection('reservations');
      // Sort newest first
      const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json(sorted);
    }
    
    const list = await Reservation.find({}).sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reservations', error: error.message });
  }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id/status
// @access  Private/Admin
const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (db.isFallback()) {
      const updated = db.fallback.updateInCollection('reservations', id, { status });
      if (!updated) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      return res.status(200).json(updated);
    }
    
    const updated = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reservation status', error: error.message });
  }
};

module.exports = {
  createReservation,
  getReservations,
  updateReservationStatus
};
