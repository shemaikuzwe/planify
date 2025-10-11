import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string|undefined, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      if(!key) {
        setIsHydrated(true);
        return;
      }
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.log(error);
    }
    setIsHydrated(true);
  }, [key, initialValue]);

  const setValue = (value: T | ((val: T) => T)) => {

    try {
      if(!key) return;
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (isHydrated) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Return initial value during SSR/hydration to prevent mismatches
  return [isHydrated ? storedValue : initialValue, setValue] as const;
}
