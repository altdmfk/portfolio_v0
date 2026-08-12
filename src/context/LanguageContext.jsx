import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('user_lang') || 'en';
  });

  useEffect(() => {
    if (localStorage.getItem('user_lang')) return;

    // Detect browser language
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('ko')) {
      setLangState('ko');
      return;
    }

    // Geolocation IP detection fallback
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country_code === 'KR') {
          setLangState('ko');
        }
      })
      .catch(() => {
        // Fallback silently if API is offline or blocked
      });
  }, []);

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('user_lang', newLang);
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
