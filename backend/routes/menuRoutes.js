const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getMenuItems)
  .post(protect, createMenuItem);

router.route('/:id')
  .get(getMenuItemById)
  .put(protect, updateMenuItem)
  .delete(protect, deleteMenuItem);

module.exports = router;
