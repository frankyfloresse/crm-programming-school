import { useCallback, useRef } from "react";

// Debounce function
export const useDebounce = <T = unknown>(callback: (...args: T[]) => void, delay: number) => {
    const debounceTimer = useRef<number | null>(null);

    return useCallback((...args: T[]) => {
    if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
    }

    const timer = window.setTimeout(() => {
        callback(...args);
    }, delay);

    debounceTimer.current = timer;
    }, [callback, delay]);
};