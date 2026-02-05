"use client";

const STORAGE_KEY = "mock_authed";

export function isMockAuthed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function mockLogin(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, "1");
    // Dispatch storage event for other tabs
    window.dispatchEvent(new Event("storage"));
  } catch {
    // Ignore storage errors
  }
}

export function mockLogout(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, "0");
    // Dispatch storage event for other tabs
    window.dispatchEvent(new Event("storage"));
  } catch {
    // Ignore storage errors
  }
}
