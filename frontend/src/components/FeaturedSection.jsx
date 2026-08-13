import React from 'react';
import { useCart } from '../context/CartContext';
import { ArrowRight } from 'lucide-react';

export default function FeaturedSection({ dish }) {
  const { addToCart } = useCart();

  if (!dish) return null;

  return (
    <section className="bg-warm-cream text-black-olive py-20">
      <div className="max-w-[1200px] mx-auto px-5 w-full flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left column Content */}
        <div className="w-full lg:w-[42%] flex flex-col items-start">
          <span className="text-caption tracking-[0.84px] text-forest-ink font-semibold uppercase mb-2">TODAY'S SPECIALTY</span>
          <h2 className="text-heading-lg font-medium tracking-[0.9px] leading-[1.15] text-black-olive mb-4">{dish.name}</h2>
          <p className="text-[19px] leading-[1.45] text-forest-ink/80 mb-5">{dish.description}</p>
          <div className="text-subheading font-semibold mb-[30px]">${dish.price.toFixed(2)}</div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 w-full sm:w-auto">
            <button 
              onClick={() => addToCart(dish)} 
              className="font-sans text-body-sm font-semibold tracking-[0.64px] uppercase bg-lemon-zest text-black-olive py-3 px-5 rounded-[1px] transition-opacity duration-200 text-center hover:opacity-90"
            >
              ADD TO ORDER
            </button>
            <a 
              href="#reservations" 
              className="group font-sans text-body-sm font-medium tracking-[0.64px] uppercase inline-flex items-center justify-center gap-1.5 py-2 transition-all duration-200 border-b border-transparent hover:border-current text-forest-ink"
            >
              BOOK A TABLE
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Right column Image */}
        <div className="w-full lg:w-[55%]">
          <img src={dish.image} alt={dish.name} className="w-full h-[380px] lg:h-[480px] object-cover rounded-none" />
        </div>
      </div>
    </section>
  );
}
