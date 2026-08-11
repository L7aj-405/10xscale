import { Head, Link, usePage } from '@inertiajs/react';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { useI18n } from '../i18n/I18nContext';

export default function ThankYou() {
    const { flash = {} } = usePage().props;
    const { t } = useI18n();

    return (
        <>
            <Head title={t('thankYou.metaTitle')}>
                <meta content={t('thankYou.metaDescription')} name="description" />
                <meta content="noindex,follow" name="robots" />
            </Head>

            <Navigation />

            <main className="flex min-h-[72vh] items-center border-b-2 border-border bg-surface-muted px-6 py-20 text-foreground min-[760px]:py-28" id="top">
                <section className="mx-auto w-full max-w-[820px] overflow-hidden rounded-[20px] border-2 border-border bg-surface shadow-[12px_12px_0_var(--color-border)]">
                    <div className="border-b-2 border-border p-7 min-[600px]:p-11">
                        <div className="grid size-16 place-items-center rounded-full border-2 border-border bg-marker text-marker-ink min-[600px]:size-20">
                            <svg aria-hidden="true" className="size-8 min-[600px]:size-10" fill="none" viewBox="0 0 24 24">
                                <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
                            </svg>
                        </div>

                        <p className="mt-7 font-['IBM_Plex_Mono'] text-[10.5px] font-semibold tracking-[0.14em] text-copy-muted uppercase">
                            {t('thankYou.eyebrow')}
                        </p>
                        <h1 className="mt-3 font-[Archivo] text-[clamp(36px,6vw,60px)] leading-[1.04] font-black tracking-[-0.03em] text-balance rtl:leading-[1.35]">
                            {t('thankYou.title')}
                        </h1>
                        <p className="mt-5 max-w-[680px] text-[17px] leading-[1.7] text-copy">
                            {flash.audit_success || t('thankYou.description')}
                        </p>
                    </div>

                    <div className="bg-surface-muted p-7 min-[600px]:p-11">
                        <h2 className="font-[Archivo] text-xl font-bold">{t('thankYou.nextTitle')}</h2>
                        <ol className="mt-5 grid gap-3">
                            {t('thankYou.nextSteps').map((step, index) => (
                                <li className="flex items-start gap-3 rounded-xl border border-border-soft bg-surface p-4" key={step}>
                                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground font-['IBM_Plex_Mono'] text-[11px] font-bold text-page">
                                        {index + 1}
                                    </span>
                                    <span className="pt-0.5 text-[15px] leading-relaxed text-copy">{step}</span>
                                </li>
                            ))}
                        </ol>

                        <div className="mt-7 flex flex-col gap-3 min-[520px]:flex-row">
                            <Link className="rounded-full bg-foreground px-6 py-3.5 text-center font-[Archivo] text-sm font-extrabold text-page no-underline hover:bg-marker hover:text-marker-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-leak" href="/">
                                {t('thankYou.home')}
                            </Link>
                            <Link className="rounded-full border-2 border-border bg-surface px-6 py-3 text-center font-[Archivo] text-sm font-extrabold text-foreground no-underline hover:bg-surface-muted focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-marker" href="/blog">
                                {t('thankYou.blog')}
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
