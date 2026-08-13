import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';

export default function FoodCard({ dish, darkTheme = false }) {
  const { addToCart } = useCart();
  const { t, isRtl } = useLanguage();

  const handleOrder = (e) => {
    e.preventDefault();
    addToCart(dish);
  };

  const dishName = t(`dishes.${dish._id}.name`, dish.name);
  const dishDesc = t(`dishes.${dish._id}.desc`, dish.description);

  return (
    <div className="group flex flex-col bg-transparent">
      <div className="relative w-full aspect-square overflow-hidden mb-[30px]">
        <img 
          src={dish.image} 
          alt={dishName} 
          className="w-full h-full object-cover transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" 
        />
      </div>
      <div className="flex flex-col items-start">
        <div className="flex justify-between items-baseline w-full mb-2">
          <h3 className={`text-body-lg font-medium tracking-[0.4px] ${darkTheme ? 'text-warm-cream' : 'text-forest-ink'}`}>
            {dishName}
          </h3>
          <span className={`text-body-lg font-semibold ${darkTheme ? 'text-lemon-zest' : 'text-forest-ink'}`}>
            ${dish.price.toFixed(2)}
          </span>
        </div>
        <p className={`text-[16px] leading-[1.4] mb-3 min-h-[48px] ${darkTheme ? 'text-warm-cream/70' : 'text-forest-ink/80'}`}>
          {dishDesc}
        </p>
        <button
          onClick={handleOrder}
          className={`group/btn font-sans text-body-sm font-medium tracking-[0.64px] uppercase inline-flex items-center gap-1.5 py-2 transition-all duration-200 border-b border-transparent hover:border-current ${darkTheme ? 'text-warm-cream' : 'text-forest-ink'}`}
        >
          {t('menu.orderNow')}
          <ArrowRight 
            size={14} 
            className={`transition-transform duration-200 ${isRtl ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'}`} 
          />
        </button>
      </div>
    </div>
  );
}

