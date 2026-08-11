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

    return (
        <div className="sticky top-2.5 z-50 px-2.5 min-[901px]:top-3.5 min-[901px]:px-4">
            <nav
                aria-label={t('nav.aria')}
                className="relative mx-auto max-w-[1280px] rounded-[30px] bg-nav shadow-[0_8px_28px_rgba(0,0,0,0.18)] min-[1280px]:rounded-full"
            >
                <div className="flex h-[60px] items-center justify-between gap-3 py-0 pe-2 ps-5 min-[901px]:h-[66px] min-[901px]:pe-3 min-[901px]:ps-6">
                    <a
                        aria-label={t('nav.homeLabel')}
                        className="flex shrink-0 items-center text-on-nav outline-none focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-marker focus-visible:ring-offset-2 focus-visible:ring-offset-nav"
                        href={isLandingPage ? '#top' : '/'}
                    >
                        <BrandLogo className="h-[26px] w-auto min-[901px]:h-[30px]" />
                    </a>

                    <div className="hidden items-center gap-0.5 rounded-full bg-nav-panel p-[5px] min-[1280px]:flex">
                        {navigationItems.map((item) => {
                            const { label, href, target } = item;
                            const isActive = isItemActive(item);

                            return (
                                <a
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`whitespace-nowrap rounded-full px-[18px] py-[9px] text-[14.5px] font-medium no-underline transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-marker ${
                                        isActive
                                            ? 'bg-marker font-semibold text-marker-ink'
                                            : 'text-on-nav-muted hover:bg-nav-hover'
                                    }`}
                                    href={href}
                                    key={target}
                                    onClick={() => setActiveSection(target)}
                                >
                                    {label}
                                </a>
                            );
                        })}
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 min-[420px]:gap-2">
                        <label className="sr-only" htmlFor="language-switcher">
                            {t('nav.language')}
                        </label>
                        <select
                            aria-label={t('nav.language')}
                            className="h-9 w-14 cursor-pointer rounded-full border border-white/25 bg-white/10 px-2 text-center font-['IBM_Plex_Mono'] text-xs font-semibold text-on-nav outline-none hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-marker min-[420px]:h-10"
                            id="language-switcher"
                            onChange={(event) => setLanguage(event.target.value)}
                            value={language}
                        >
                            {languages.map(({ code, label, shortLabel }) => (
                                <option className="bg-nav text-on-nav" key={code} value={code}>
                                    {shortLabel} — {label}
                                </option>
                            ))}
                        </select>

                        <button
                            aria-label={isDark ? t('nav.lightMode') : t('nav.darkMode')}
                            aria-pressed={isDark}
                            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-white/25 bg-white/10 text-on-nav transition-[background-color,transform] hover:scale-105 hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-marker min-[420px]:size-10"
                            onClick={toggleTheme}
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

                        <button
                            aria-controls="mobile-navigation"
                            aria-expanded={menuOpen}
                            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
                            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-white/25 bg-white/10 text-on-nav hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-marker min-[420px]:size-10 min-[1280px]:hidden"
                            onClick={() => setMenuOpen((open) => !open)}
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

                        <a
                            className="hidden shrink-0 rounded-full bg-marker px-3 py-3 font-[Archivo] text-xs font-extrabold whitespace-nowrap text-marker-ink no-underline transition-[background-color,transform] hover:bg-white active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white min-[560px]:inline-block min-[560px]:px-[18px] min-[560px]:text-sm"
                            href={isLandingPage ? '#audit' : '/#audit'}
                        >
                            {t('nav.audit')}
                        </a>
                    </div>
                </div>

                {menuOpen ? (
                    <div
                        className="absolute inset-x-0 top-[calc(100%+8px)] overflow-hidden rounded-[22px] border border-white/15 bg-nav p-2 shadow-[0_12px_30px_rgba(0,0,0,0.28)] min-[1280px]:hidden"
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
                        <a
                            className="mt-1 block rounded-2xl bg-marker px-4 py-3 text-center font-[Archivo] text-sm font-extrabold text-marker-ink no-underline min-[560px]:hidden"
                            href={isLandingPage ? '#audit' : '/#audit'}
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
