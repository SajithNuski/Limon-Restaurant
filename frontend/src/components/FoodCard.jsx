import React from 'react';
import { useCart } from '../context/CartContext';
import { ArrowRight } from 'lucide-react';

export default function FoodCard({ dish, darkTheme = false }) {
  const { addToCart } = useCart();

  const handleOrder = (e) => {
    e.preventDefault();
    addToCart(dish);
  };

  return (
    <div className="group flex flex-col bg-transparent">
      <div className="relative w-full aspect-square overflow-hidden mb-[30px]">
        <img 
          src={dish.image} 
          alt={dish.name} 
          className="w-full h-full object-cover transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" 
        />
      </div>
      <div className="flex flex-col items-start">
        <div className="flex justify-between items-baseline w-full mb-2">
          <h3 className={`text-body-lg font-medium tracking-[0.4px] ${darkTheme ? 'text-warm-cream' : 'text-forest-ink'}`}>
            {dish.name}
          </h3>
          <span className={`text-body-lg font-semibold ${darkTheme ? 'text-lemon-zest' : 'text-forest-ink'}`}>
            ${dish.price.toFixed(2)}
          </span>
        </div>
        <p className={`text-[16px] leading-[1.4] mb-3 min-h-[48px] ${darkTheme ? 'text-warm-cream/70' : 'text-forest-ink/80'}`}>
          {dish.description}
        </p>
        <button
          onClick={handleOrder}
          className={`group/btn font-sans text-body-sm font-medium tracking-[0.64px] uppercase inline-flex items-center gap-1.5 py-2 transition-all duration-200 border-b border-transparent hover:border-current ${darkTheme ? 'text-warm-cream' : 'text-forest-ink'}`}
        >
          ORDER NOW
          <ArrowRight size={14} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
