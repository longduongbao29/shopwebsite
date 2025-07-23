/**
 * Global mounting state manager để đảm bảo all components mount consistently
 */

let globalMountingPromise: Promise<void> | null = null;

export function createMountingDelay(delay: number = 100): Promise<void> {
    if (!globalMountingPromise) {
        globalMountingPromise = new Promise(resolve => {
            setTimeout(resolve, delay);
        });
    }
    return globalMountingPromise;
}

export function resetMountingState() {
    globalMountingPromise = null;
}

// Utility to check if we're on client side
export function isClient(): boolean {
    return typeof window !== 'undefined';
}

// Safe localStorage access
export function safeLocalStorage() {
    if (!isClient()) return null;

    return {
        getItem: (key: string) => {
            try {
                return localStorage.getItem(key);
            } catch (error) {
                console.error('localStorage getItem error:', error);
                return null;
            }
        },
        setItem: (key: string, value: string) => {
            try {
                localStorage.setItem(key, value);
            } catch (error) {
                console.error('localStorage setItem error:', error);
            }
        },
        removeItem: (key: string) => {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error('localStorage removeItem error:', error);
            }
        }
    };
}
