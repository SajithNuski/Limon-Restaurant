const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const fallbackDir = path.join(__dirname, '../data');
const fallbackPath = path.join(fallbackDir, 'fallback_db.json');

// Ensure fallback directory and file exist
if (!fs.existsSync(fallbackDir)) {
  fs.mkdirSync(fallbackDir, { recursive: true });
}

const defaultData = {
  menu: [],
  reservations: [],
  orders: [],
  users: [] // For admin login
};

if (!fs.existsSync(fallbackPath)) {
  fs.writeFileSync(fallbackPath, JSON.stringify(defaultData, null, 2), 'utf8');
}

let isUsingFallback = false;

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/limon_restaurant';
    console.log(`Attempting to connect to MongoDB at: ${connUri}`);
    
    // Set a low timeout so it fails quickly if MongoDB isn't running, enabling fast fallback
    await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('MongoDB Connected Successfully.');
    isUsingFallback = false;
  } catch (error) {
    console.warn('MongoDB connection failed. Falling back to local JSON database storage.');
    console.warn(`Reason: ${error.message}`);
    isUsingFallback = true;
  }
};

// Fallback Helper Functions
const getFallbackDB = () => {
  try {
    const data = fs.readFileSync(fallbackPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading fallback DB:', err);
    return defaultData;
  }
};

const saveFallbackDB = (data) => {
  try {
    fs.writeFileSync(fallbackPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing fallback DB:', err);
  }
};

const getCollection = (collectionName) => {
  const db = getFallbackDB();
  return db[collectionName] || [];
};

const saveToCollection = (collectionName, item) => {
  const db = getFallbackDB();
  if (!db[collectionName]) {
    db[collectionName] = [];
  }
  
  // Assign simple ID if not present
  if (!item._id && !item.id) {
    item._id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  if (!item.createdAt) {
    item.createdAt = new Date().toISOString();
  }
  
  db[collectionName].push(item);
  saveFallbackDB(db);
  return item;
};

const updateInCollection = (collectionName, id, updates) => {
  const db = getFallbackDB();
  const list = db[collectionName] || [];
  const index = list.findIndex(item => (item._id === id || item.id === id));
  if (index !== -1) {
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    saveFallbackDB(db);
    return list[index];
  }
  return null;
};

const deleteFromCollection = (collectionName, id) => {
  const db = getFallbackDB();
  const list = db[collectionName] || [];
  const newList = list.filter(item => (item._id !== id && item.id !== id));
  db[collectionName] = newList;
  saveFallbackDB(db);
  return true;
};

module.exports = {
  connectDB,
  isFallback: () => isUsingFallback,
  fallback: {
    getCollection,
    saveToCollection,
    updateInCollection,
    deleteFromCollection
  }
};
