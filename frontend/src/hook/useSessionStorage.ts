"use client";

export function useSessionStorage() {
  // Initialize state with function to avoid unnecessary re-renders

  const getValue = (key: string) => {
    if (typeof window === "undefined") return;

    try {
      const item = window.sessionStorage.getItem(key);
      if (item) {
        return item;
      }
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
    }
  };

  // Update localStorage when state changes
  const setValue = (key: string, value: string) => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  // Clear the stored value
  const clearValue = (key: string) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error clearing sessionStorage key "${key}":`, error);
    }
  };

  return { setValue, clearValue, getValue };
}
