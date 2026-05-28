import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value by a specified delay.
 * 
 * @param {*} value The value to debounce
 * @param {number} delay Delay in milliseconds (defaults to 400ms)
 * @returns {*} The debounced value
 */
export default function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
