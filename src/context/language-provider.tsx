
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Import translations
import enTranslations from '@/locales/en.json';
import bnTranslations from '@/locales/bn.json';
import hiTranslations from '@/locales/hi.json';

export type Language = "en" | "bn" | "hi";
export const LANGUAGES: { code: Language; name: string }[] = [
  { code: "en", name: "English" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "hi", name: "हिन्दी (Hindi)" },
];

type Translations = Record<string, string>;
const allTranslations: Record<Language, Translations> = {
  en: enTranslations,
  bn: bnTranslations,
  hi: hiTranslations,
};

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
}

interface LanguageProviderState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const initialState: LanguageProviderState = {
  language: "en",
  setLanguage: () => null,
  t: (key: string, fallback?: string) => fallback || key,
};

const LanguageProviderContext = createContext<LanguageProviderState>(initialState);

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "hygienea-language",
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as Language) || defaultLanguage;
    }
    return defaultLanguage;
  });

  useEffect(() => {
    const storedLanguage = localStorage.getItem(storageKey) as Language | null;
    if (storedLanguage && LANGUAGES.find(l => l.code === storedLanguage)) {
      setLanguageState(storedLanguage);
    } else {
      setLanguageState(defaultLanguage);
    }
  }, [storageKey, defaultLanguage]);

  const setLanguage = useCallback((newLanguage: Language) => {
    if (LANGUAGES.find(l => l.code === newLanguage)) {
      setLanguageState(newLanguage);
      localStorage.setItem(storageKey, newLanguage);
    }
  }, [storageKey]);

  const t = useCallback((key: string, fallback?: string): string => {
    const currentTranslations = allTranslations[language] || allTranslations.en;
    return currentTranslations[key] || fallback || key;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
