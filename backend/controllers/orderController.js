const Order = require('../models/Order');
const db = require('../config/db');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const { customerName, email, phone, items, totalAmount, orderType } = req.body;
    
    if (!customerName || !email || !phone || !items || !items.length || !totalAmount) {
      return res.status(400).json({ message: 'Missing order details' });
    }

    const orderData = {
      customerName,
      email,
      phone,
      items,
      totalAmount: Number(totalAmount),
      orderType: orderType || 'pickup',
      status: 'pending'
    };

    if (db.isFallback()) {
      const newOrder = db.fallback.saveToCollection('orders', orderData);
      return res.status(201).json(newOrder);
    }
    
    const newOrder = await Order.create(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    if (db.isFallback()) {
      const list = db.fallback.getCollection('orders');
      // Sort newest first
      const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json(sorted);
    }
    
    const list = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders', error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'preparing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (db.isFallback()) {
      const updated = db.fallback.updateInCollection('orders', id, { status });
      if (!updated) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.status(200).json(updated);
    }
    
    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus
};
