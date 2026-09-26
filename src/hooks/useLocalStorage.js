import { useState, useEffect } from "react";

/**
 * Persists a piece of React state to localStorage under `key`.
 * Falls back to `initialValue` if nothing is stored yet or parsing fails.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage unavailable (e.g. private browsing quota) — fail silently
    }
  }, [key, value]);

  return [value, setValue];
}
