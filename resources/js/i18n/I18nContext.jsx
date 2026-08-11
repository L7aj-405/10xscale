import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { languages, translations } from './translations';

const storageKey = '10xscale-locale';
const supportedLanguages = languages.map(({ code }) => code);
const I18nContext = createContext(null);

function getInitialLanguage() {
    if (typeof document === 'undefined') {
        return 'en';
    }

    return supportedLanguages.includes(document.documentElement.lang)
        ? document.documentElement.lang
        : 'en';
}

function getTranslation(language, key) {
    const read = (dictionary) => key.split('.').reduce((value, part) => value?.[part], dictionary);

    return read(translations[language]) ?? read(translations.en) ?? key;
}

export function I18nProvider({ children }) {
    const [language, setLanguageState] = useState(getInitialLanguage);

    const setLanguage = useCallback((nextLanguage) => {
        if (supportedLanguages.includes(nextLanguage)) {
            setLanguageState(nextLanguage);
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;

        root.lang = language;
        root.dir = language === 'ar' ? 'rtl' : 'ltr';

        try {
            window.localStorage.setItem(storageKey, language);
        } catch {
            // Language switching still works when storage is unavailable.
        }
    }, [language]);

    useEffect(() => {
        const syncLanguage = (event) => {
            if (event.key === storageKey && supportedLanguages.includes(event.newValue)) {
                setLanguageState(event.newValue);
            }
        };

        window.addEventListener('storage', syncLanguage);

        return () => window.removeEventListener('storage', syncLanguage);
    }, []);

    const t = useCallback((key) => getTranslation(language, key), [language]);
    const value = useMemo(
        () => ({ direction: language === 'ar' ? 'rtl' : 'ltr', language, languages, setLanguage, t }),
        [language, setLanguage, t],
    );

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error('useI18n must be used inside I18nProvider.');
    }

    return context;
}
