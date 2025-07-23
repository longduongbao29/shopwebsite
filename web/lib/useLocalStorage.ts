import { useState, useEffect } from 'react';

/**
 * Custom hook để xử lý localStorage safely với SSR
 * Tránh hydration mismatch
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
    // State để lưu value
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isLoaded, setIsLoaded] = useState(false);

    // Lấy value từ localStorage sau khi component mount
    useEffect(() => {
        try {
            const item = localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
        } finally {
            setIsLoaded(true);
        }
    }, [key]);

    // Hàm để set value
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Cho phép value là function để update dựa trên previous value
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Lưu vào state
            setStoredValue(valueToStore);

            // Lưu vào localStorage
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    // Hàm để xóa value
    const removeValue = () => {
        try {
            localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue, removeValue, isLoaded] as const;
}
