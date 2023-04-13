
import { useEffect, useLayoutEffect, useRef } from 'react';

export const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;


export function useInterval(callback: () => void, delay: number | null): void {
    const savedCallback = useRef(callback);

    // Remember the latest callback if it changes.
    useIsomorphicLayoutEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        // Don't schedule if no delay is specified.
        // Note: 0 is a valid value for delay.
        if (!delay && delay !== 0) {
            return;
        }

        const id = setInterval(() => savedCallback.current(), delay);

        return () => clearInterval(id);
    }, [delay]);
}

export function useTimeout(callback: () => void, delay: number | null): void {
    const timeoutRef = useRef(null);
    const savedCallback = useRef(callback);

    // Remember the latest callback if it changes.
    useIsomorphicLayoutEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the timeout.
    useEffect(() => {
        // Don't schedule if no delay is specified.
        // Note: 0 is a valid value for delay.

        if (!delay && delay !== 0) {
            return;
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        const id = setTimeout(() => {
            savedCallback.current();
            timeoutRef.current = null;
        }, delay);
        timeoutRef.current = id;
        return () => clearTimeout(id);
    }, [delay]);
}
