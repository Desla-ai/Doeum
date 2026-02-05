"use client";

import { useState, useEffect, useCallback } from "react";
import { isMockAuthed, mockLogin, mockLogout } from "@/lib/mockAuth";

interface UseMockAuthReturn {
  authed: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

export function useMockAuth(): UseMockAuthReturn {
  const [authed, setAuthed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Read auth state on mount
  useEffect(() => {
    setAuthed(isMockAuthed());
    setIsLoading(false);
  }, []);

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorage = () => {
      setAuthed(isMockAuthed());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = useCallback(() => {
    mockLogin();
    setAuthed(true);
  }, []);

  const logout = useCallback(() => {
    mockLogout();
    setAuthed(false);
  }, []);

  return { authed, isLoading, login, logout };
}
