"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export type AppMode = "customer" | "helper";

const STORAGE_KEY = "app_mode";
const DEFAULT_MODE: AppMode = "customer";

interface AppModeContextValue {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
  isCustomer: boolean;
  isHelper: boolean;
  isHydrated: boolean;
}

const AppModeContext = createContext<AppModeContextValue | null>(null);

export function AppModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(DEFAULT_MODE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "customer" || stored === "helper") {
      setModeState(stored);
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage when mode changes
  const setMode = useCallback((newMode: AppMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  }, []);

  // Toggle between modes
  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "customer" ? "helper" : "customer";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<AppModeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode,
      isCustomer: mode === "customer",
      isHelper: mode === "helper",
      isHydrated,
    }),
    [mode, setMode, toggleMode, isHydrated]
  );

  return (
    <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>
  );
}

export function useAppMode(): AppModeContextValue {
  const context = useContext(AppModeContext);
  if (!context) {
    throw new Error("useAppMode must be used within an AppModeProvider");
  }
  return context;
}
