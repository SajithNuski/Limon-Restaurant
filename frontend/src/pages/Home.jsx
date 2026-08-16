import React, { useState, useEffect } from 'react';
import FoodCard from '../components/FoodCard';
import FeaturedSection from '../components/FeaturedSection';
import ReservationForm from '../components/ReservationForm';
import { useLanguage } from '../context/LanguageContext';
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
  const { t, isRtl } = useLanguage();
  const [menu, setMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/menu`);
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
              {t('hero.title')}<br />{t('hero.brasserie')}
            </h1>
            <p className="font-sans text-body-lg font-normal tracking-[0.4px] leading-[1.5] text-warm-cream mb-[30px]">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
              <a href="#menu" className="font-sans text-body-sm font-semibold tracking-[0.64px] uppercase bg-lemon-zest text-black-olive py-3 px-5 rounded-[1px] transition-opacity duration-200 text-center hover:opacity-90 inline-block animate-none">
                {t('hero.explore')}
              </a>
              <a href="#reservations" className="font-sans text-body-sm font-semibold tracking-[0.64px] uppercase text-warm-cream border border-white py-3 px-4 rounded-[1px] transition-all duration-200 hover:bg-white hover:text-black-olive text-center inline-block">
                {t('hero.reserve')}
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
            <span className="text-caption tracking-[0.84px] font-semibold uppercase mb-2 text-forest-ink block">
              {t('menu.tag')}
            </span>
            <h2 className="text-heading font-medium tracking-[1.08px] mb-3 uppercase text-forest-ink">
              {t('menu.title')}
            </h2>
            <p className="text-[19px] leading-[1.4] text-forest-ink/80">
              {t('menu.subtitle')}
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
                {t(`menu.categories.${category.toLowerCase()}`, category).toUpperCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-body-lg text-forest-ink tracking-[2px] text-center py-[60px]">
              {t('menu.loading')}
            </div>
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
            <span className="text-caption tracking-[0.84px] font-semibold uppercase mb-2 text-lemon-zest block">
              {t('about.tag')}
            </span>
            <h2 className="text-heading font-medium tracking-[1.08px] mb-3 uppercase text-warm-cream">
              {t('about.title')}
            </h2>
            <p className="text-[19px] leading-[1.45] mb-5 text-warm-cream">
              {t('about.p1')}
            </p>
            <p className="text-[19px] leading-[1.45] mb-5 text-warm-cream/70">
              {t('about.p2')}
            </p>
            <a 
              href="#reservations" 
              className="group font-sans text-body-sm font-medium tracking-[0.64px] uppercase inline-flex items-center gap-1.5 py-2 transition-all duration-200 border-b border-transparent hover:border-current text-warm-cream"
            >
              {t('about.reserve')}
              <ArrowRight 
                size={14} 
                className={`transition-transform duration-200 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} 
              />
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
            <span className="text-caption tracking-[0.84px] font-semibold uppercase mb-2 text-forest-ink block">
              {t('faq.tag')}
            </span>
            <h2 className="text-heading font-medium tracking-[1.08px] mb-3 uppercase text-forest-ink">
              {t('faq.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[900px] mx-auto">
            <div className="flex flex-col gap-2">
              <h4 className="text-body-lg font-medium tracking-[0.64px] flex items-center gap-2 text-forest-ink">
                <HelpCircle size={16} className="text-forest-ink shrink-0" />
                {t('faq.q1')}
              </h4>
              <p className="text-body-sm leading-[1.45] text-forest-ink/80 ps-6">
                {t('faq.a1')}
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <h4 className="text-body-lg font-medium tracking-[0.64px] flex items-center gap-2 text-forest-ink">
                <HelpCircle size={16} className="text-forest-ink shrink-0" />
                {t('faq.q2')}
              </h4>
              <p className="text-body-sm leading-[1.45] text-forest-ink/80 ps-6">
                {t('faq.a2')}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-body-lg font-medium tracking-[0.64px] flex items-center gap-2 text-forest-ink">
                <HelpCircle size={16} className="text-forest-ink shrink-0" />
                {t('faq.q3')}
              </h4>
              <p className="text-body-sm leading-[1.45] text-forest-ink/80 ps-6">
                {t('faq.a3')}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-body-lg font-medium tracking-[0.64px] flex items-center gap-2 text-forest-ink">
                <HelpCircle size={16} className="text-forest-ink shrink-0" />
                {t('faq.q4')}
              </h4>
              <p className="text-body-sm leading-[1.45] text-forest-ink/80 ps-6">
                {t('faq.a4')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

