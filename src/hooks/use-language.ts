
// This file can be a re-export or just used as an alias if LanguageProvider exports useLanguage directly.
// For simplicity and explicitness, we are using the direct export from language-provider.tsx.
// If you prefer a separate file for the hook:
/*
"use client";

import { useContext } from 'react';
import { LanguageProviderContext, LanguageProviderState } from '@/context/language-provider'; // Adjust path if needed

export const useLanguage = (): LanguageProviderState => {
  const context = useContext(LanguageProviderContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
*/

// Since useLanguage is already defined and exported in language-provider.tsx,
// this file is not strictly necessary unless you want to separate it for architectural reasons.
// For now, ensure you import useLanguage directly from '@/context/language-provider'.
// This file is left as a placeholder for potential future separation.
// No actual code needed here if importing directly from the provider file.
// If you keep this file, you would import and re-export:
export { useLanguage } from '@/context/language-provider';
