import { Head, Link, useForm } from '@inertiajs/react';
import BrandLogo from '../../Components/BrandLogo';
import useTheme from '../../hooks/useTheme';

export default function Login() {
    const { isDark, toggleTheme } = useTheme();
    const form = useForm({ email: '', password: '', remember: false });

    const submit = (event) => {
        event.preventDefault();
        form.post('/login', {
            onFinish: () => form.reset('password'),
        });
    };

    return (
        <main className="grid min-h-screen bg-page text-foreground min-[900px]:grid-cols-[0.9fr_1.1fr]" dir="ltr">
            <Head title="Team login" />

            <section className="relative hidden overflow-hidden bg-nav p-12 text-on-nav min-[900px]:flex min-[900px]:flex-col min-[1100px]:p-16">
                <div className="absolute -right-24 -bottom-24 size-[420px] rounded-full border-[80px] border-marker/10" />
                <Link aria-label="10Xscale home" className="relative z-10" href="/">
                    <BrandLogo className="h-9 w-auto" />
                </Link>
                <div className="relative z-10 my-auto max-w-lg">
                    <p className="font-['IBM_Plex_Mono'] text-xs font-semibold tracking-[0.15em] text-marker uppercase">Private workspace</p>
                    <h1 className="mt-5 font-[Archivo] text-[clamp(42px,5vw,66px)] leading-[1.02] font-black tracking-[-0.03em]">Retention operations, in one place.</h1>
                    <p className="mt-6 max-w-md text-lg leading-relaxed text-on-dark-muted">Review incoming audits, manage team access and keep the client pipeline moving.</p>
                </div>
                <p className="relative z-10 font-['IBM_Plex_Mono'] text-[11px] tracking-[0.08em] text-footer-muted uppercase">Authorized Admin & Team users only</p>
            </section>

            <section className="flex min-h-screen items-center justify-center p-5 min-[600px]:p-10">
                <div className="w-full max-w-md">
                    <div className="mb-12 flex items-center justify-between min-[900px]:justify-end">
                        <Link aria-label="10Xscale home" className="text-foreground min-[900px]:hidden" href="/">
                            <BrandLogo className="h-8 w-auto" />
                        </Link>
                        <button
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="grid size-11 cursor-pointer place-items-center rounded-full border border-border-soft bg-surface hover:bg-surface-muted focus-visible:outline-3 focus-visible:outline-marker"
                            onClick={toggleTheme}
                            type="button"
                        >
                            {isDark ? <SunIcon /> : <MoonIcon />}
                        </button>
                    </div>

                    <p className="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.15em] text-copy-muted uppercase">Secure sign in</p>
                    <h2 className="mt-2 font-[Archivo] text-4xl font-black tracking-[-0.02em]">Welcome back.</h2>
                    <p className="mt-3 text-copy-muted">Use your 10Xscale team account to continue.</p>

                    <form className="mt-9" onSubmit={submit}>
                        <Field error={form.errors.email} label="Email address">
                            <input autoComplete="username" autoFocus className={inputClass} onChange={(e) => form.setData('email', e.target.value)} required type="email" value={form.data.email} />
                        </Field>
                        <Field error={form.errors.password} label="Password">
                            <input autoComplete="current-password" className={inputClass} onChange={(e) => form.setData('password', e.target.value)} required type="password" value={form.data.password} />
                        </Field>
                        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-copy">
                            <input checked={form.data.remember} className="size-4 accent-[#0b0b0b]" onChange={(e) => form.setData('remember', e.target.checked)} type="checkbox" />
                            Keep me signed in on this device
                        </label>
                        <button className="mt-7 w-full cursor-pointer rounded-xl bg-foreground px-5 py-3.5 font-[Archivo] text-base font-extrabold text-page hover:bg-marker hover:text-marker-ink disabled:cursor-wait disabled:opacity-60" disabled={form.processing} type="submit">
                            {form.processing ? 'Signing in…' : 'Sign in to dashboard'}
                        </button>
                    </form>
                    <p className="mt-6 text-center text-xs leading-relaxed text-copy-muted">Login attempts are rate-limited. Contact an administrator if you need access.</p>
                </div>
            </section>
        </main>
    );
}

const inputClass = 'mt-2 w-full rounded-xl border border-border-soft bg-surface px-4 py-3.5 text-foreground outline-none focus:border-foreground focus:ring-2 focus:ring-marker';
function Field({ children, error, label }) { return <label className="mb-5 block text-sm font-semibold">{label}{children}{error ? <span className="mt-1.5 block text-xs font-medium text-leak">{error}</span> : null}</label>; }
function SunIcon() { return <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>; }
function MoonIcon() { return <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24"><path d="M20.2 15.3A8.5 8.5 0 0 1 8.7 3.8 8.5 8.5 0 1 0 20.2 15.3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
