import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import useTheme from '../hooks/useTheme';
import { useI18n } from '../i18n/I18nContext';
import BrandLogo from './BrandLogo';

const navigationTargets = [
    { key: 'home', href: '#top' },
    { key: 'gap', href: '#problem' },
    { key: 'plan', href: '#plan' },
    { key: 'guarantee', href: '#guarantee' },
    { key: 'caseStudies', href: '#case-studies' },
    { key: 'team', href: '#team' },
    { key: 'faq', href: '#faq' },
    { key: 'blog', href: '/blog', page: true },
];

export default function Navigation() {
    const [activeSection, setActiveSection] = useState('#top');
    const [menuOpen, setMenuOpen] = useState(false);
    const { url } = usePage();
    const { isDark, toggleTheme } = useTheme();
    const { language, languages, setLanguage, t } = useI18n();
    const currentPath = url.split('?')[0];
    const isLandingPage = currentPath === '/';
    const isBlogPage = currentPath.startsWith('/blog');
    const navigationItems = navigationTargets.map(({ href, key, page }) => ({
        href: page || isLandingPage ? href : `/${href}`,
        target: href,
        page,
        label: t(`nav.${key}`),
    }));

    useEffect(() => {
        const sections = navigationTargets
            .filter(({ page }) => !page)
            .map(({ href }) => document.querySelector(href))
            .filter(Boolean);

        if (!sections.length) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSection = entries.find((entry) => entry.isIntersecting);

                if (visibleSection) {
                    setActiveSection(`#${visibleSection.target.id}`);
                }
            },
            { rootMargin: '-30% 0px -60% 0px' },
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [isLandingPage]);

    useEffect(() => {
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        };

        window.addEventListener('keydown', closeOnEscape);

        return () => window.removeEventListener('keydown', closeOnEscape);
    }, []);

    const isItemActive = ({ page, target }) => (
        page ? isBlogPage : isLandingPage && activeSection === target
    );
    const homeHref = isLandingPage ? '#top' : '/';
    const auditHref = isLandingPage ? '#audit' : '/#audit';

    return (
        <div className="sticky left-0 top-2.5 z-50 px-2.5 min-[901px]:top-3.5 min-[901px]:px-4" dir="ltr">
            <nav
                aria-label={t('nav.aria')}
                className="relative mx-auto max-w-[1280px] rounded-[30px] bg-nav shadow-[0_8px_28px_rgba(0,0,0,0.18)] min-[1280px]:rounded-full"
            >
                <MobileHeader
                    auditHref={auditHref}
                    homeHref={homeHref}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    t={t}
                />

                <DesktopHeader
                    activeSection={activeSection}
                    auditHref={auditHref}
                    homeHref={homeHref}
                    isDark={isDark}
                    isItemActive={isItemActive}
                    language={language}
                    languages={languages}
                    navigationItems={navigationItems}
                    setActiveSection={setActiveSection}
                    setLanguage={setLanguage}
                    t={t}
                    toggleTheme={toggleTheme}
                />

                {menuOpen ? (
                    <div
                        className="absolute inset-x-0 top-[calc(100%+8px)] max-h-[calc(100vh-88px)] overflow-y-auto rounded-[22px] border border-white/15 bg-nav p-2 shadow-[0_12px_30px_rgba(0,0,0,0.28)] min-[1280px]:hidden"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                        id="mobile-navigation"
                    >
                        {navigationItems.map((item) => {
                            const isActive = isItemActive(item);

                            return (
                                <a
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`block rounded-2xl px-4 py-3 text-sm font-semibold no-underline ${isActive ? 'bg-marker text-marker-ink' : 'text-on-nav-muted hover:bg-nav-hover'}`}
                                    href={item.href}
                                    key={item.target}
                                    onClick={() => {
                                        setActiveSection(item.target);
                                        setMenuOpen(false);
                                    }}
                                >
                                    {item.label}
                                </a>
                            );
                        })}
                        <MobilePreferences
                            isDark={isDark}
                            language={language}
                            languages={languages}
                            setLanguage={setLanguage}
                            t={t}
                            toggleTheme={toggleTheme}
                        />
                        <a
                            className="mt-1 block rounded-2xl bg-marker px-4 py-3 text-center font-[Archivo] text-sm font-extrabold text-marker-ink no-underline"
                            href={auditHref}
                            onClick={() => setMenuOpen(false)}
                        >
                            {t('nav.audit')}
                        </a>
                    </div>
                ) : null}
            </nav>
        </div>
    );
}

function MobileHeader({ auditHref, homeHref, menuOpen, setMenuOpen, t }) {
    return (
        <div className="relative flex h-[60px] items-center px-2 min-[1280px]:hidden" dir="ltr">
            <MenuToggle menuOpen={menuOpen} onClick={() => setMenuOpen((open) => !open)} t={t} />

            <LogoLink className="absolute left-1/2 -translate-x-1/2" homeHref={homeHref} t={t}>
                <BrandLogo className="h-[25px] w-auto min-[420px]:h-[27px]" />
            </LogoLink>

            <a
                className="ml-auto shrink-0 rounded-full bg-marker px-3 py-2 font-[Archivo] text-[11px] font-extrabold whitespace-nowrap text-marker-ink no-underline transition-[background-color,transform] hover:bg-white active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white rtl:order-first rtl:ml-0 min-[420px]:px-4 min-[420px]:text-xs"
                href={auditHref}
            >
                {t('nav.audit')}
            </a>
        </div>
    );
}

function MobilePreferences({ isDark, language, languages, setLanguage, t, toggleTheme }) {
    return (
        <div className="my-2 rounded-2xl border border-white/15 bg-white/5 p-3">
            <p className="mb-2 px-1 font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.12em] text-on-nav-muted uppercase">
                {t('nav.language')} · {isDark ? t('nav.lightMode') : t('nav.darkMode')}
            </p>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                <LanguageSwitcher
                    className="h-11 w-full rounded-xl px-3 text-start"
                    id="language-switcher-mobile-menu"
                    language={language}
                    languages={languages}
                    onChange={setLanguage}
                    t={t}
                />
                <ThemeToggle
                    className="size-11 rounded-xl"
                    isDark={isDark}
                    onClick={toggleTheme}
                    t={t}
                />
            </div>
        </div>
    );
}

function DesktopHeader({ auditHref, homeHref, isDark, isItemActive, language, languages, navigationItems, setActiveSection, setLanguage, t, toggleTheme }) {
    return (
        <div className="hidden h-[66px] items-center justify-between gap-3 py-0 pe-3 ps-6 min-[1280px]:flex">
            <LogoLink homeHref={homeHref} t={t}>
                <BrandLogo className="h-[30px] w-auto" />
            </LogoLink>

            <div className="flex items-center gap-0.5 rounded-full bg-nav-panel p-[5px]">
                {navigationItems.map((item) => {
                    const isActive = isItemActive(item);

                    return (
                        <a
                            aria-current={isActive ? 'page' : undefined}
                            className={`whitespace-nowrap rounded-full px-[18px] py-[9px] text-[14.5px] font-medium no-underline transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-marker ${isActive ? 'bg-marker font-semibold text-marker-ink' : 'text-on-nav-muted hover:bg-nav-hover'}`}
                            href={item.href}
                            key={item.target}
                            onClick={() => setActiveSection(item.target)}
                        >
                            {item.label}
                        </a>
                    );
                })}
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <LanguageSwitcher id="language-switcher-desktop" language={language} languages={languages} onChange={setLanguage} t={t} />
                <ThemeToggle isDark={isDark} onClick={toggleTheme} t={t} />
                <a
                    className="shrink-0 rounded-full bg-marker px-[18px] py-3 font-[Archivo] text-sm font-extrabold whitespace-nowrap text-marker-ink no-underline transition-[background-color,transform] hover:bg-white active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"
                    href={auditHref}
                >
                    {t('nav.audit')}
                </a>
            </div>
        </div>
    );
}

function LogoLink({ children, className = '', homeHref, t }) {
    return (
        <a
            aria-label={t('nav.homeLabel')}
            className={`flex shrink-0 items-center text-on-nav outline-none focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-marker focus-visible:ring-offset-2 focus-visible:ring-offset-nav ${className}`}
            href={homeHref}
        >
            {children}
        </a>
    );
}

function MenuToggle({ menuOpen, onClick, t }) {
    return (
        <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-white/25 bg-white/10 text-on-nav hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-marker rtl:order-3 rtl:ml-auto min-[420px]:size-10"
            onClick={onClick}
            type="button"
        >
            {menuOpen ? (
                <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
            ) : (
                <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
            )}
        </button>
    );
}

function LanguageSwitcher({ className = '', id, language, languages, onChange, t }) {
    return (
        <>
            <label className="sr-only" htmlFor={id}>
                {t('nav.language')}
            </label>
            <select
                aria-label={t('nav.language')}
                className={`h-9 w-14 cursor-pointer rounded-full border border-white/25 bg-white/10 px-2 text-center font-['IBM_Plex_Mono'] text-xs font-semibold text-on-nav outline-none hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-marker min-[420px]:h-10 ${className}`}
                id={id}
                onChange={(event) => onChange(event.target.value)}
                value={language}
            >
                {languages.map(({ code, label, shortLabel }) => (
                    <option className="bg-nav text-on-nav" key={code} value={code}>
                        {shortLabel} — {label}
                    </option>
                ))}
            </select>
        </>
    );
}

function ThemeToggle({ className = '', isDark, onClick, t }) {
    return (
        <button
            aria-label={isDark ? t('nav.lightMode') : t('nav.darkMode')}
            aria-pressed={isDark}
            className={`grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-white/25 bg-white/10 text-on-nav transition-[background-color,transform] hover:scale-105 hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-marker min-[420px]:size-10 ${className}`}
            onClick={onClick}
            title={isDark ? t('nav.lightMode') : t('nav.darkMode')}
            type="button"
        >
            {isDark ? (
                <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                </svg>
            ) : (
                <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                    <path d="M20.2 15.3A8.5 8.5 0 0 1 8.7 3.8 8.5 8.5 0 1 0 20.2 15.3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
                </svg>
            )}
        </button>
    );
}
