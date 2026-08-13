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
    <div className="bg-black-olive">
      {/* Hero Section */}
      <section 
        className="relative w-full h-[calc(100vh-80px)] min-h-[550px] flex items-center bg-cover bg-center md:h-[calc(100vh-80px)] h-auto py-[100px] md:py-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&auto=format&fit=crop&q=80')" }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[#1d0b0d]/75 z-0"></div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-5 w-full animate-fade-in">
          <div className="max-w-[650px]">
            <h1 className="font-sans text-heading-lg md:text-display-xl font-normal leading-none tracking-[4.5px] text-lemon-zest mb-5">
              LIMÓN<br />BRASSERIE
            </h1>
            <p className="font-sans text-body-lg font-normal tracking-[0.4px] leading-[1.5] text-warm-cream mb-[30px]">
              A moody candlelit dining experience highlighting fresh ceviches, premium flame-kissed cuts, and curated citrus mixology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
              <a href="#menu" className="font-sans text-body-sm font-semibold tracking-[0.64px] uppercase bg-lemon-zest text-black-olive py-3 px-5 rounded-[1px] transition-opacity duration-200 text-center hover:opacity-90 inline-block">
                EXPLORE MENU
              </a>
              <a href="#reservations" className="font-sans text-body-sm font-semibold tracking-[0.64px] uppercase text-warm-cream border border-white py-3 px-4 rounded-[1px] transition-all duration-200 hover:bg-white hover:text-black-olive text-center inline-block">
                RESERVE A TABLE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <FeaturedSection dish={featuredDish} />

      {/* Menu Section */}
      <section id="menu" className="bg-warm-cream text-black-olive py-[60px]">
        <div className="max-w-[1200px] mx-auto px-5 w-full">
          <div className="mb-[50px] max-w-[650px]">
            <span className="text-caption tracking-[0.84px] font-semibold uppercase mb-2 text-forest-ink block">OUR GOURMET SELECTIONS</span>
            <h2 className="text-heading font-medium tracking-[1.08px] mb-3 uppercase text-forest-ink">The Brasserie Menu</h2>
            <p className="text-[19px] leading-[1.4] text-forest-ink/80">
              Flat, authentic food-first photography. Curated culinary still-life dishes served fresh to order.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10 border-b border-sage-mist pb-4 justify-center sm:justify-start">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-caption font-semibold tracking-[0.84px] py-2 px-4 transition-all duration-200 rounded-[1px] hover:text-forest-ink ${
                  selectedCategory === category 
                    ? 'text-black-olive bg-sage-mist' 
                    : 'text-forest-ink/60'
                }`}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-body-lg text-forest-ink tracking-[2px] text-center py-[60px]">ILLUMINATING DISHES...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[30px] gap-y-[45px]">
              {filteredMenu.map((dish) => (
                <FoodCard key={dish._id} dish={dish} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About / Story Section */}
      <section id="about" className="bg-black-olive text-warm-cream py-[60px]">
        <div className="max-w-[1200px] mx-auto px-5 w-full flex flex-col lg:flex-row items-center gap-[50px]">
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <span className="text-caption tracking-[0.84px] font-semibold uppercase mb-2 text-lemon-zest block">OUR PHILOSOPHY</span>
            <h2 className="text-heading font-medium tracking-[1.08px] mb-3 uppercase text-warm-cream">Candlelight & Ink</h2>
            <p className="text-[19px] leading-[1.45] mb-5 text-warm-cream">
              Limón is designed as an evening retreat. The visual grammar of our brasserie relies on olive-black surfaces and minimal structural decoration, allowing the plates and drinks to burn brightly under soft candlelight.
            </p>
            <p className="text-[19px] leading-[1.45] mb-5 text-warm-cream/70">
              We source organic ingredients, highlighting seasonal fruits and lime, pairing our dishes with deep botanical greens and full-bodied spices. Our space is sharp, unsoftened, and dedicated entirely to the presentation of culinary art.
            </p>
            <a 
              href="#reservations" 
              className="group font-sans text-body-sm font-medium tracking-[0.64px] uppercase inline-flex items-center gap-1.5 py-2 transition-all duration-200 border-b border-transparent hover:border-current text-warm-cream"
            >
              RESERVE SEATING
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
          <div className="w-full lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&auto=format&fit=crop&q=80"
              alt="Moody candlelight dining space"
              className="w-full h-[380px] lg:h-[520px] object-cover rounded-none"
            />
          </div>
        </div>
      </section>

      {/* Reservation Form Section */}
      <ReservationForm />

      {/* FAQ Section */}
      <section className="bg-warm-cream text-black-olive border-t border-sage-mist py-[60px]">
        <div className="max-w-[1200px] mx-auto px-5 w-full">
          <div className="mb-[50px] max-w-[650px] mx-auto text-center">
            <span className="text-caption tracking-[0.84px] font-semibold uppercase mb-2 text-forest-ink block">COMMON INQUIRIES</span>
            <h2 className="text-heading font-medium tracking-[1.08px] mb-3 uppercase text-forest-ink">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[900px] mx-auto">
            <div className="flex flex-col gap-2">
              <h4 className="text-body-lg font-medium tracking-[0.64px] flex items-center gap-2 text-forest-ink">
                <HelpCircle size={16} className="text-forest-ink shrink-0" />
                What is the attire recommendation?
              </h4>
              <p className="text-body-sm leading-[1.45] text-forest-ink/80 pl-6">
                We recommend smart casual attire. The atmosphere is an elegant, moody brasserie under candlelight, and dressing for the occasion is welcomed.
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <h4 className="text-body-lg font-medium tracking-[0.64px] flex items-center gap-2 text-forest-ink">
                <HelpCircle size={16} className="text-forest-ink shrink-0" />
                Do you accommodate food allergies?
              </h4>
              <p className="text-body-sm leading-[1.45] text-forest-ink/80 pl-6">
                Yes, our chefs can customize yellowtail ceviches, salads, and main courses to fit gluten-free, nut-free, and shell-fish allergies. Please detail your requests in the reservation form.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-body-lg font-medium tracking-[0.64px] flex items-center gap-2 text-forest-ink">
                <HelpCircle size={16} className="text-forest-ink shrink-0" />
                Can we host private events?
              </h4>
              <p className="text-body-sm leading-[1.45] text-forest-ink/80 pl-6">
                We accommodate private buyouts for groups of up to 45 guests. Email events@limonbrasserie.com for inquiries.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-body-lg font-medium tracking-[0.64px] flex items-center gap-2 text-forest-ink">
                <HelpCircle size={16} className="text-forest-ink shrink-0" />
                Is parking available?
              </h4>
              <p className="text-body-sm leading-[1.45] text-forest-ink/80 pl-6">
                Complimentary valet service is available directly outside our main entrance starting at 5:00 PM Wednesday through Sunday.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
