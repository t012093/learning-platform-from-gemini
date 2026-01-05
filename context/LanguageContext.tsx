import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'jp';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'lumina:language';

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === 'jp' ? 'jp' : 'en';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    }
  };

  const toggleLanguage = () => setLanguage(language === 'en' ? 'jp' : 'en');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language === 'jp' ? 'ja' : 'en';
    }
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, toggleLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
