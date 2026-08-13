import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-black-olive border-t border-sage-mist/10 pt-20 pb-0 text-warm-cream font-sans">
      <div className="max-w-[1200px] mx-auto px-5 w-full flex flex-col lg:flex-row justify-between gap-10 pb-15">
        <div className="w-full lg:w-[40%]">
          <h2 className="text-heading-lg font-medium tracking-[1.84px] text-warm-cream mb-2 uppercase">{t('hero.title')}</h2>
          <p className="text-body-sm text-warm-cream/60 italic">{t('footer.subtext', 'Moody brasserie under candlelight')}</p>
        </div>
        
        <div className="w-full lg:w-[25%]">
          <h4 className="text-caption tracking-[0.84px] text-lemon-zest font-semibold mb-5 uppercase">{t('footer.nav', 'NAVIGATION')}</h4>
          <ul className="list-none flex flex-col gap-3">
            <li><Link to="/" className="text-body-sm text-warm-cream/80 hover:text-lemon-zest transition-colors duration-200">{t('nav.home')}</Link></li>
            <li><a href="/#menu" className="text-body-sm text-warm-cream/80 hover:text-lemon-zest transition-colors duration-200">{t('nav.menu')}</a></li>
            <li><a href="/#about" className="text-body-sm text-warm-cream/80 hover:text-lemon-zest transition-colors duration-200">{t('nav.about')}</a></li>
            <li><a href="/#reservations" className="text-body-sm text-warm-cream/80 hover:text-lemon-zest transition-colors duration-200">{t('reservations.tag')}</a></li>
            <li><Link to="/admin" className="text-body-sm text-warm-cream/80 hover:text-lemon-zest transition-colors duration-200">{t('nav.admin')}</Link></li>
          </ul>
        </div>

        <div className="w-full lg:w-[25%]">
          <h4 className="text-caption tracking-[0.84px] text-lemon-zest font-semibold mb-5 uppercase">{t('footer.contact', 'CONTACT & LOCALE')}</h4>
          <p className="text-body-sm text-warm-cream/80 mb-3 leading-[1.4]">{t('footer.address', '84 Candlelight Blvd, Brasserie District')}</p>
          <p className="text-body-sm text-warm-cream/80 mb-3 leading-[1.4]">reservations@limonbrasserie.com</p>
          <p className="text-body-sm text-warm-cream/80 mb-3 leading-[1.4]">+1 (555) 019-3829</p>
        </div>
      </div>
      
      <div className="border-t border-sage-mist/10 py-[30px] bg-black/15">
        <div className="max-w-[1200px] mx-auto px-5 w-full flex flex-col sm:flex-row justify-between items-center flex-wrap gap-4">
          <p className="text-[13px] text-warm-cream/50 tracking-[0.5px]">
            &copy; {new Date().getFullYear()} {t('footer.copyright', 'LIMÓN BRASSERIE. ALL RIGHTS RESERVED.')}
          </p>
          <div className="flex items-center gap-3 text-[12px] tracking-widest text-warm-cream/60">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-warm-cream/60 hover:text-lemon-zest transition-colors duration-200">INSTAGRAM</a>
            <span>·</span>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-warm-cream/60 hover:text-lemon-zest transition-colors duration-200">FACEBOOK</a>
            <span>·</span>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-warm-cream/60 hover:text-lemon-zest transition-colors duration-200">TWITTER</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

