const Menu = require('../models/Menu');
const db = require('../config/db');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    if (db.isFallback()) {
      const items = db.fallback.getCollection('menu');
      return res.status(200).json(items);
    }
    
    const items = await Menu.find({});
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving menu items', error: error.message });
  }
};

// @desc    Get single menu item by ID
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (db.isFallback()) {
      const items = db.fallback.getCollection('menu');
      const item = items.find(i => (i._id === id || i.id === id));
      if (!item) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      return res.status(200).json(item);
    }
    
    const item = await Menu.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving menu item', error: error.message });
  }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, available, isFeatured } = req.body;
    
    const itemData = {
      name,
      description,
      price: Number(price),
      category,
      image,
      available: available !== undefined ? available : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false
    };

    if (db.isFallback()) {
      const newItem = db.fallback.saveToCollection('menu', itemData);
      return res.status(201).json(newItem);
    }
    
    const newItem = await Menu.create(itemData);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu item', error: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.price) {
      updates.price = Number(updates.price);
    }

    if (db.isFallback()) {
      const updated = db.fallback.updateInCollection('menu', id, updates);
      if (!updated) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      return res.status(200).json(updated);
    }
    
    const updated = await Menu.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (db.isFallback()) {
      const success = db.fallback.deleteFromCollection('menu', id);
      if (!success) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      return res.status(200).json({ message: 'Menu item removed successfully' });
    }
    
    const deleted = await Menu.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
