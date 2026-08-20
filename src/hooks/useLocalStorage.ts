import { useCallback, useState } from 'react';

export default function useLocalStorage<T>(key: string, initialValue: T) {
  // Get the value from localStorage or use the initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error retrieving localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Function to update both the state and localStorage. Uses a functional
  // state update (rather than closing over storedValue) so the returned
  // setter has a stable identity across renders, like useState's setter.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((prevValue) => {
        const valueToStore =
          value instanceof Function ? value(prevValue) : value;

        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
        }

        return valueToStore;
      });
    },
    [key],
  );

  return [storedValue, setValue] as const;
}
