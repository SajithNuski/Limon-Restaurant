import React, { useState, useEffect } from 'react';
import FoodCard from '../components/FoodCard';
import FeaturedSection from '../components/FeaturedSection';
import ReservationForm from '../components/ReservationForm';
import { ArrowRight, HelpCircle } from 'lucide-react';

// Hardcoded fallback data in case backend API is not reachable
const fallbackMenu = [
  {
    _id: 'm_1',
    name: 'Yellowtail Ceviche & Mango',
    description: 'Fresh yellowtail sashimi, compressed mango, red onion, chili crisp, cilantro, drenched in fresh lime zest emulsion.',
    price: 18.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: true
  },
  {
    _id: 'm_2',
    name: 'Charred Tortilla Chips & Smoked Salsa',
    description: 'House-made stone ground corn tortillas, roasted heirloom tomato salsa, mashed charred avocado with lime rind.',
    price: 12.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: false
  },
  {
    _id: 'm_3',
    name: 'Limon Green Crunch Salad',
    description: 'Crisp romaine, shaved cucumbers, sage leaves, avocado slices, tossed in rich green herb dressing with toasted pepitas.',
    price: 16.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: false
  },
  {
    _id: 'm_4',
    name: 'Citrus Glazed Duck Breast',
    description: 'Pan-seared duck breast with sweet lemon-orange reduction, charred broccolini, and parsnip purée.',
    price: 34.00,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: true
  },
  {
    _id: 'm_5',
    name: 'Olive Ink Cod',
    description: 'Black cod poached in olive oil and squid ink broth, served with fingerling potatoes and saffron aioli.',
    price: 36.00,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: false
  },
  {
    _id: 'm_6',
    name: 'Prime Brasserie Ribeye',
    description: '14oz grass-fed ribeye, grilled over hickory wood, topped with green pepper butter, served with roasted garlic.',
    price: 48.00,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: false
  },
  {
    _id: 'm_9',
    name: 'Warm Chocolate Lava Cake',
    description: 'Decadent dark chocolate flourless cake with liquid center, topped with a scoop of toasted vanilla cream gelée.',
    price: 14.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: true
  },
  {
    _id: 'm_11',
    name: 'The candlelight Sour',
    description: 'Premium mezcal, fresh lemon juice, agave nectar, activated charcoal float, served over single block ice.',
    price: 16.00,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80',
    available: true,
    isFeatured: true
  }
];

const categories = ['All', 'Appetizers', 'Mains', 'Sides', 'Desserts', 'Drinks'];

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/menu');
        if (!response.ok) throw new Error('Failed to fetch menu');
        const data = await response.json();
        setMenu(data);
      } catch (err) {
        console.warn('Unable to connect to backend server. Using static frontend menu items.');
        setMenu(fallbackMenu);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredMenu = selectedCategory === 'All'
    ? menu.filter(item => item.available)
    : menu.filter(item => item.category === selectedCategory && item.available);

  // Find a featured dish for the FeaturedSection banner
  const featuredDish = menu.find(item => item.isFeatured) || menu[0];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>
        <div className="container hero-container animate-fade-in">
          <div className="hero-text-block">
            <h1 className="hero-display-text">
              LIMÓN<br />BRASSERIE
            </h1>
            <p className="hero-subline">
              A moody candlelit dining experience highlighting fresh ceviches, premium flame-kissed cuts, and curated citrus mixology.
            </p>
            <div className="hero-actions">
              <a href="#menu" className="filled-cta-btn">
                EXPLORE MENU
              </a>
              <a href="#reservations" className="hero-ghost-btn">
                RESERVE A TABLE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <FeaturedSection dish={featuredDish} />

      {/* Menu Section */}
      <section id="menu" className="menu-section section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle text-forest">OUR GOURMET SELECTIONS</span>
            <h2 className="section-title text-forest">The Brasserie Menu</h2>
            <p className="section-desc text-forest-muted">
              Flat, authentic food-first photography. Curated culinary still-life dishes served fresh to order.
            </p>
          </div>

          {/* Category Filter */}
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-filter-btn ${
                  selectedCategory === category ? 'filter-active' : ''
                }`}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="menu-loading">ILLUMINATING DISHES...</div>
          ) : (
            <div className="menu-grid">
              {filteredMenu.map((dish) => (
                <FoodCard key={dish._id} dish={dish} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About / Story Section */}
      <section id="about" className="about-section section-padding">
        <div className="container about-container">
          <div className="about-text-content">
            <span className="section-subtitle text-lemon">OUR PHILOSOPHY</span>
            <h2 className="section-title text-cream">Candlelight & Ink</h2>
            <p className="about-paragraph text-cream">
              Limón is designed as an evening retreat. The visual grammar of our brasserie relies on olive-black surfaces and minimal structural decoration, allowing the plates and drinks to burn brightly under soft candlelight.
            </p>
            <p className="about-paragraph text-cream-muted">
              We source organic ingredients, highlighting seasonal fruits and lime, pairing our dishes with deep botanical greens and full-bodied spices. Our space is sharp, unsoftened, and dedicated entirely to the presentation of culinary art.
            </p>
            <a href="#reservations" className="ghost-link-btn ghost-link-light">
              RESERVE SEATING
              <ArrowRight size={14} className="ghost-link-icon" />
            </a>
          </div>
          <div className="about-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&auto=format&fit=crop&q=80"
              alt="Moody candlelight dining space"
              className="about-image"
            />
          </div>
        </div>
      </section>

      {/* Reservation Form Section */}
      <ReservationForm />

      {/* FAQ Section */}
      <section className="faq-section section-padding">
        <div className="container">
          <div className="section-header centered">
            <span className="section-subtitle text-forest">COMMON INQUIRIES</span>
            <h2 className="section-title text-forest">Frequently Asked Questions</h2>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h4 className="faq-question">
                <HelpCircle size={16} className="faq-icon" />
                What is the attire recommendation?
              </h4>
              <p className="faq-answer">
                We recommend smart casual attire. The atmosphere is an elegant, moody brasserie under candlelight, and dressing for the occasion is welcomed.
              </p>
            </div>
            
            <div className="faq-item">
              <h4 className="faq-question">
                <HelpCircle size={16} className="faq-icon" />
                Do you accommodate food allergies?
              </h4>
              <p className="faq-answer">
                Yes, our chefs can customize yellowtail ceviches, salads, and main courses to fit gluten-free, nut-free, and shell-fish allergies. Please detail your requests in the reservation form.
              </p>
            </div>

            <div className="faq-item">
              <h4 className="faq-question">
                <HelpCircle size={16} className="faq-icon" />
                Can we host private events?
              </h4>
              <p className="faq-answer">
                We accommodate private buyouts for groups of up to 45 guests. Email events@limonbrasserie.com for inquiries.
              </p>
            </div>

            <div className="faq-item">
              <h4 className="faq-question">
                <HelpCircle size={16} className="faq-icon" />
                Is parking available?
              </h4>
              <p className="faq-answer">
                Complimentary valet service is available directly outside our main entrance starting at 5:00 PM Wednesday through Sunday.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
