import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('limon_lang') || 'en';
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('limon_lang', lang);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', language);
    if (language === 'ar') {
      root.setAttribute('dir', 'rtl');
      root.classList.add('rtl-layout');
    } else {
      root.setAttribute('dir', 'ltr');
      root.classList.remove('rtl-layout');
    }
  }, [language]);

  const t = (keyPath, fallback = '') => {
    const keys = keyPath.split('.');
    let current = translations[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English if translation is missing in the current language
        let enFallback = translations['en'];
        for (const enKey of keys) {
          if (enFallback && typeof enFallback === 'object' && enKey in enFallback) {
            enFallback = enFallback[enKey];
          } else {
            enFallback = null;
            break;
          }
        }
        return enFallback || fallback || keyPath;
      }
    }

    return current || fallback || keyPath;
  };

  const isRtl = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
