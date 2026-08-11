const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const Menu = require('../models/Menu');
const User = require('../models/User');

const menuItems = [
  {
    name: 'Yellowtail Ceviche & Mango',
    description: 'Fresh yellowtail sashimi, compressed mango, red onion, chili crisp, cilantro, drenched in fresh lime zest emulsion.',
    price: 18.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: true
  },
  {
    name: 'Charred Tortilla Chips & Smoked Salsa',
    description: 'House-made stone ground corn tortillas, roasted heirloom tomato salsa, mashed charred avocado with lime rind.',
    price: 12.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: false
  },
  {
    name: 'Limon Green Crunch Salad',
    description: 'Crisp romaine, shaved cucumbers, sage leaves, avocado slices, tossed in rich green herb dressing with toasted pepitas.',
    price: 16.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: false
  },
  {
    name: 'Citrus Glazed Duck Breast',
    description: 'Pan-seared duck breast with sweet lemon-orange reduction, charred broccolini, and parsnip purée.',
    price: 34.00,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: true
  },
  {
    name: 'Olive Ink Cod',
    description: 'Black cod poached in olive oil and squid ink broth, served with fingerling potatoes and saffron aioli.',
    price: 36.00,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: false
  },
  {
    name: 'Prime Brasserie Ribeye',
    description: '14oz grass-fed ribeye, grilled over hickory wood, topped with green pepper butter, served with roasted garlic.',
    price: 48.00,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: false
  },
  {
    name: 'Spiced Charred Broccolini',
    description: 'Broccolini stems charred under direct flame, finished with lemon juice, sea salt, and toasted sesame.',
    price: 9.00,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1580041065738-e72023775cdc?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: false
  },
  {
    name: 'Truffle Parsnip Purée',
    description: 'Silky smooth whipped parsnips infused with white truffle oil, olive oil, and fresh cracked pepper.',
    price: 11.00,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: false
  },
  {
    name: 'Warm Chocolate Lava Cake',
    description: 'Decadent dark chocolate flourless cake with liquid center, topped with a scoop of toasted vanilla cream gelée.',
    price: 14.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: true
  },
  {
    name: 'Lemon Zest Gelato Tart',
    description: 'Shortbread crust, fresh lemon-curd filling, topped with dynamic meringue shards and sage leaf glaze.',
    price: 13.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: false
  },
  {
    name: 'The candlelight Sour',
    description: 'Premium mezcal, fresh lemon juice, agave nectar, activated charcoal float, served over single block ice.',
    price: 16.00,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: true
  },
  {
    name: 'Forest Ink Tonic',
    description: 'Gin, elderflower liqueur, lime juice, cucumber bitters, splash of organic match tonic water.',
    price: 15.00,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: false
  }
];

const seedData = async () => {
  // 1. Seed fallback JSON DB
  const fallbackPath = path.join(__dirname, '../data/fallback_db.json');
  const fallbackDir = path.dirname(fallbackPath);
  console.log('Seeding fallback database file...');
  try {
    if (!fs.existsSync(fallbackDir)) {
      fs.mkdirSync(fallbackDir, { recursive: true });
    }
    const passwordHash = await bcrypt.hash('password123', 10);
    const dbData = {
      menu: menuItems.map((item, idx) => ({
        ...item,
        _id: `m_${idx + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })),
      reservations: [],
      orders: [],
      users: [
        {
          _id: 'admin_1',
          username: 'admin',
          password: passwordHash,
          createdAt: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(fallbackPath, JSON.stringify(dbData, null, 2), 'utf8');
    console.log('Fallback database seeded successfully!');
  } catch (err) {
    console.error('Error seeding fallback database:', err);
  }

  // 2. Try seeding MongoDB if URI is available
  const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/limon_restaurant';
  console.log(`Connecting to MongoDB for seeding at: ${connUri}`);
  try {
    await mongoose.connect(connUri, { serverSelectionTimeoutMS: 3000 });
    
    // Clear existing
    await Menu.deleteMany({});
    await User.deleteMany({});

    // Seed menu
    await Menu.insertMany(menuItems);
    console.log(`Seeded ${menuItems.length} menu items in MongoDB.`);

    // Seed admin user
    const adminUser = new User({
      username: 'admin',
      password: 'password123'
    });
    await adminUser.save();
    console.log('Seeded admin user in MongoDB (username: admin, password: password123).');

    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.warn('Could not seed MongoDB. Only fallback JSON database seeded.');
    console.warn(`Reason: ${error.message}`);
  }
};

seedData();
