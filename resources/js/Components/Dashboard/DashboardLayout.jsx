import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import useTheme from '../../hooks/useTheme';
import BrandLogo from '../BrandLogo';

const navigation = [
    { label: 'Overview', href: '/dashboard', icon: HomeIcon },
    { label: 'Audit requests', href: '/dashboard/audit-requests', icon: InboxIcon },
    { label: 'Brand logos', href: '/dashboard/brand-logos', icon: ImageIcon, adminOnly: true },
    { label: 'Team members', href: '/dashboard/team-members', icon: UsersIcon, adminOnly: true },
    { label: 'Site appearance', href: '/dashboard/appearance', icon: PaletteIcon, adminOnly: true },
    { label: 'Users', href: '/dashboard/users', icon: UsersIcon, adminOnly: true },
];

export default function DashboardLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const { url } = usePage();
    const { isDark, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = auth?.user ?? null;

    useEffect(() => setSidebarOpen(false), [url]);

    const logout = () => router.post('/logout');

    return (
        <div className="min-h-screen bg-surface-muted text-foreground" dir="ltr">
            <Head title={title} />

            <aside className={`fixed inset-y-0 left-0 z-[60] flex w-[278px] flex-col bg-nav text-on-nav transition-transform duration-300 min-[1024px]:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-20 items-center border-b border-white/10 px-7">
                    <Link aria-label="10Xscale home" href="/">
                        <BrandLogo className="h-8 w-auto" />
                    </Link>
                </div>

                <div className="px-5 pt-7">
                    <p className="px-3 font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.16em] text-on-nav-muted uppercase">
                        Team workspace
                    </p>
                    <nav aria-label="Dashboard navigation" className="mt-3 grid gap-1.5">
                        {navigation.filter((item) => !item.adminOnly || user.is_admin).map((item) => {
                            const active = item.href === '/dashboard'
                                ? url === '/dashboard'
                                : url.startsWith(item.href);
                            const Icon = item.icon;

                            return (
                                <Link
                                    aria-current={active ? 'page' : undefined}
                                    className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold no-underline transition-colors ${active ? 'bg-marker text-marker-ink' : 'text-on-nav-muted hover:bg-nav-hover hover:text-on-nav'}`}
                                    href={item.href}
                                    key={item.href}
                                >
                                    <Icon className="size-[19px] shrink-0" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto border-t border-white/10 p-5">
                    <div className="mb-4 flex items-center gap-3 px-2">
                        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-marker font-[Archivo] text-sm font-black text-marker-ink">
                            {initials(user.name)}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-on-nav">{user.name}</p>
                            <p className="truncate text-xs text-on-nav-muted">{user.email}</p>
                        </div>
                    </div>
                    <button
                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-on-nav-muted hover:bg-nav-hover hover:text-on-nav focus-visible:outline-3 focus-visible:outline-marker"
                        onClick={logout}
                        type="button"
                    >
                        <LogoutIcon className="size-[18px]" />
                        Sign out
                    </button>
                </div>
            </aside>

            {sidebarOpen ? (
                <button
                    aria-label="Close sidebar"
                    className="fixed inset-0 z-50 cursor-default bg-black/50 min-[1024px]:hidden"
                    onClick={() => setSidebarOpen(false)}
                    type="button"
                />
            ) : null}

            <div className="min-h-screen min-[1024px]:pl-[278px]">
                <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border-soft bg-surface/90 px-5 backdrop-blur-xl min-[700px]:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            aria-label="Open sidebar"
                            className="grid size-10 cursor-pointer place-items-center rounded-full border border-border-soft bg-surface hover:bg-surface-muted min-[1024px]:hidden"
                            onClick={() => setSidebarOpen(true)}
                            type="button"
                        >
                            <MenuIcon className="size-5" />
                        </button>
                        <div>
                            <p className="font-['IBM_Plex_Mono'] text-[10px] tracking-[0.13em] text-copy-muted uppercase">10Xscale dashboard</p>
                            <p className="font-[Archivo] text-base font-bold">{title}</p>
                        </div>
                    </div>

                    <button
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        className="grid size-10 cursor-pointer place-items-center rounded-full border border-border-soft bg-surface text-foreground hover:bg-surface-muted focus-visible:outline-3 focus-visible:outline-marker"
                        onClick={toggleTheme}
                        type="button"
                    >
                        {isDark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
                    </button>
                </header>

                <main className="mx-auto max-w-[1440px] p-5 min-[700px]:p-8">
                    {flash?.success ? <FlashMessage tone="success">{flash.success}</FlashMessage> : null}
                    {flash?.error ? <FlashMessage tone="error">{flash.error}</FlashMessage> : null}
                    {children}
                </main>
            </div>
        </div>
    );
}

function FlashMessage({ children, tone }) {
    return (
        <div className={`mb-6 rounded-xl border px-4 py-3 text-sm font-semibold ${tone === 'error' ? 'border-leak/40 bg-leak/10 text-leak' : 'border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'}`} role="status">
            {children}
        </div>
    );
}

function initials(name) {
    return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function HomeIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function InboxIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><path d="M4 5h16v14H4V5Zm0 9h4l2 2h4l2-2h4" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function UsersIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>; }
function PaletteIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a1.5 1.5 0 0 1 0-3h2.5A6.5 6.5 0 0 0 21 7.5C21 5 17 3 12 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /><circle cx="7.5" cy="10.5" r="1" fill="currentColor" /><circle cx="10" cy="6.8" r="1" fill="currentColor" /><circle cx="15" cy="7" r="1" fill="currentColor" /></svg>; }
function ImageIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><rect height="16" rx="2" stroke="currentColor" strokeWidth="1.8" width="18" x="3" y="4" /><circle cx="8.5" cy="9" r="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="m4 17 4.5-4.5 3.5 3 2-2 6 5" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function LogoutIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><path d="M10 17l5-5-5-5m5 5H3m12-9h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function MenuIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /></svg>; }
function SunIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>; }
function MoonIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><path d="M20.2 15.3A8.5 8.5 0 0 1 8.7 3.8 8.5 8.5 0 1 0 20.2 15.3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
