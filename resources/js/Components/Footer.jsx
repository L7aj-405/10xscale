import BrandLogo from './BrandLogo';
import { useI18n } from '../i18n/I18nContext';
import { usePage } from '@inertiajs/react';

export default function Footer() {
    const { t } = useI18n();
    const { url } = usePage();
    const isHome = url.split('?')[0] === '/';
    const landingLink = (anchor) => (isHome ? anchor : `/${anchor}`);

    return (
        <footer className="border-t border-nav-hover bg-nav py-11 text-footer-muted">
            <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-5 px-6">
                <a
                    aria-label={t('footer.homeLabel')}
                    className="text-on-nav focus-visible:rounded-sm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-marker"
                    href={landingLink('#top')}
                >
                    <BrandLogo className="h-[26px] w-auto" dynamicSize />
                </a>
                <p className="max-w-[760px] font-['IBM_Plex_Mono'] text-xs tracking-[0.04em]">
                    {t('footer.tagline')}
                </p>
            </div>

            <div className="mx-auto mt-9 grid max-w-[1120px] grid-cols-1 gap-8 border-t border-nav-hover px-6 pt-8 min-[680px]:grid-cols-2 min-[901px]:grid-cols-[1.4fr_1fr_1fr] min-[901px]:gap-11">
                <div className="min-[680px]:col-span-2 min-[901px]:col-span-1">
                    <h2 className="mb-3.5 font-[Archivo] text-sm font-bold text-on-nav">{t('footer.heading')}</h2>
                    <p className="max-w-[400px] text-sm leading-[1.65]">{t('footer.description')}</p>
                    <a className="mt-3.5 inline-block font-['IBM_Plex_Mono'] text-sm text-[#bebebe] hover:text-marker" href="mailto:hello@10xscale.com">hello@10xscale.com</a>
                </div>
                <FooterColumn title={t('footer.explore')}>
                    <a href={landingLink('#case-studies')}>{t('nav.caseStudies')}</a>
                    <a href={landingLink('#team')}>{t('nav.team')}</a>
                    <a href="/blog">{t('nav.blog')}</a>
                    <a href={landingLink('#faq')}>{t('nav.faq')}</a>
                    <a href={landingLink('#audit')}>{t('nav.audit')}</a>
                </FooterColumn>
                <FooterColumn title={t('footer.policies')}>
                    <a href="/privacy-policy">{t('footer.privacy')}</a>
                    <a href="/terms-and-conditions">{t('footer.terms')}</a>
                    <a href="/cookie-policy">{t('footer.cookies')}</a>
                    <a href="/data-processing-agreement">{t('footer.dpa')}</a>
                </FooterColumn>
            </div>

            <div className="mx-auto mt-8 flex max-w-[1120px] flex-wrap justify-between gap-4 border-t border-nav-hover px-6 pt-[22px] font-['IBM_Plex_Mono'] text-[11.5px]">
                <span>{t('footer.copyright')}</span>
                <span>{t('footer.contact')}</span>
            </div>
        </footer>
    );
}

function FooterColumn({ children, title }) {
    return (
        <div>
            <h2 className="mb-3.5 font-[Archivo] text-sm font-bold text-on-nav">{title}</h2>
            <div className="grid gap-2.5 text-sm text-[#bebebe] [&_a]:no-underline [&_a]:hover:text-marker [&_a]:focus-visible:rounded-sm [&_a]:focus-visible:outline-3 [&_a]:focus-visible:outline-offset-3 [&_a]:focus-visible:outline-marker">
                {children}
            </div>
        </div>
    );
}
