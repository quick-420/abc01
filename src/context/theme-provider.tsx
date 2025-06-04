
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme?: "light" | "dark";
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light", // Default to light until client-side hydration
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "hygienea-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Initial state on client should try to read from localStorage
    // For server, this won't run, or localStorage won't be available.
    // The effect below handles initial client-side setting.
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    // Try to determine initial resolved theme (won't be perfect on SSR for "system")
    if (typeof window !== "undefined") {
      if (theme === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return theme;
    }
    return "light"; // SSR default
  });


  useEffect(() => {
    // This effect runs on the client after hydration
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      setThemeState(defaultTheme); // Apply default if nothing in storage
    }
  }, [storageKey, defaultTheme]);


  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let currentThemeToApply: "light" | "dark";

    if (theme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");
      currentThemeToApply = systemPrefersDark.matches ? "dark" : "light";
      root.classList.add(currentThemeToApply);
    } else {
      currentThemeToApply = theme;
      root.classList.add(theme);
    }
    setResolvedTheme(currentThemeToApply);
    localStorage.setItem(storageKey, theme); // Persist the user's explicit choice

  }, [theme, storageKey]);

  // Listener for system theme changes
  useEffect(() => {
    if (theme !== "system") {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const systemIsDark = mediaQuery.matches;
      setResolvedTheme(systemIsDark ? "dark" : "light");
      // The main effect [theme, storageKey] will re-apply class if theme is "system"
      // due to resolvedTheme changing, but to be safe, explicit re-application:
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(systemIsDark ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]); // Only run if theme is 'system'

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const value = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

