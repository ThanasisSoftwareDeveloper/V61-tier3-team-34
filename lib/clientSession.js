"use client";

const STORAGE_KEY = "dashfetch_session";

/**
 * Minimal client-side persistence so the Home -> Job Summary ->
 * Interview Questions -> Mock Interview flow can pass data between
 * pages without a global state library. Backed by sessionStorage,
 * so it survives navigation but clears when the tab closes.
 */
export function saveSession(data) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadSession() || {};
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...existing, ...data })
    );
  } catch (err) {
    console.error("Could not save session to sessionStorage:", err);
  }
}

export function loadSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Could not read session from sessionStorage:", err);
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}
