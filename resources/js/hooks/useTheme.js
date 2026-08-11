import { useEffect, useState } from 'react';

const storageKey = '10xscale-theme';

function getCurrentTheme() {
    if (typeof document === 'undefined') {
        return 'light';
    }

    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export default function useTheme() {
    const [theme, setTheme] = useState(getCurrentTheme);

    useEffect(() => {
        const root = document.documentElement;
        const isDark = theme === 'dark';

        root.classList.toggle('dark', isDark);
        root.style.colorScheme = theme;

        try {
            window.localStorage.setItem(storageKey, theme);
        } catch {
            // The visual toggle still works when storage is unavailable.
        }
    }, [theme]);

    useEffect(() => {
        const syncTheme = (event) => {
            if (event.key === storageKey && ['dark', 'light'].includes(event.newValue)) {
                setTheme(event.newValue);
            }
        };

        window.addEventListener('storage', syncTheme);

        return () => window.removeEventListener('storage', syncTheme);
    }, []);

    return {
        isDark: theme === 'dark',
        theme,
        toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    };
}
