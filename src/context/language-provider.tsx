
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
  isLanguageInitialized: boolean;
}

const initialState: LanguageProviderState = {
  language: "en", // This will be the effective default on server
  setLanguage: () => null,
  t: (key: string, fallback?: string) => fallback || key,
  isLanguageInitialized: false, // Server and initial client will be false
};

const LanguageProviderContext = createContext<LanguageProviderState>(initialState);

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "hygienea-language",
}: LanguageProviderProps) {
  // Initialize with defaultLanguage. This ensures server and initial client render are consistent.
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  // Flag to indicate that the client-side specific language has been loaded.
  const [isLanguageInitialized, setIsLanguageInitialized] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    const storedLanguage = localStorage.getItem(storageKey) as Language | null;
    if (storedLanguage && LANGUAGES.find(l => l.code === storedLanguage)) {
      setLanguageState(storedLanguage);
    } else {
      // If no stored language, or it's invalid, ensure it's set to defaultLanguage.
      // This is mostly redundant if useState already initialized to defaultLanguage,
      // but good for explicitness.
      setLanguageState(defaultLanguage);
    }
    setIsLanguageInitialized(true); // Mark that client-side language setup is done.
  }, [storageKey, defaultLanguage]);

  const setLanguage = useCallback((newLanguage: Language) => {
    if (LANGUAGES.find(l => l.code === newLanguage)) {
      setLanguageState(newLanguage);
      localStorage.setItem(storageKey, newLanguage);
    }
  }, [storageKey]);

  const t = useCallback((key: string, fallback?: string): string => {
    // Use `defaultLanguage` if client-side language hasn't been initialized yet.
    // Otherwise, use the current `language` state.
    const langToUse = isLanguageInitialized ? language : defaultLanguage;
    const currentTranslations = allTranslations[langToUse] || allTranslations.en; // Fallback to 'en' just in case
    return currentTranslations[key] || fallback || key;
  }, [language, defaultLanguage, isLanguageInitialized]);

  const value = {
    language,
    setLanguage,
    t,
    isLanguageInitialized,
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
