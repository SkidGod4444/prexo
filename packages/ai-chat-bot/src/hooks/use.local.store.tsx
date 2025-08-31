// /packages/ai-chat-sdk/src/hooks/use.local.store.tsx
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const isClient = typeof window !== "undefined";

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isClient) return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn("Failed to get from localStorage", error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (!isClient) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn("Failed to set in localStorage", error);
    }
  }, [key, storedValue, isClient]);

  return [storedValue, setStoredValue] as const;
}
