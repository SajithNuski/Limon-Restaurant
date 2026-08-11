const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservations,
  updateReservationStatus
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(createReservation)
  .get(protect, getReservations);

router.route('/:id/status')
  .put(protect, updateReservationStatus);

module.exports = router;
