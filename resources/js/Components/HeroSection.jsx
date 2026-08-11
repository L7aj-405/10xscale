import Highlight from './Highlight';
import RevenueMeter from './RevenueMeter';
import { useI18n } from '../i18n/I18nContext';

export default function HeroSection() {
    const { t } = useI18n();

    return (
        <header
            className="scroll-mt-24 border-b-2 border-border bg-page py-14 text-foreground min-[901px]:pt-[88px] min-[901px]:pb-[72px]"
            id="top"
        >
            <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-12 px-6 min-[901px]:grid-cols-[1.15fr_0.85fr] min-[901px]:gap-16">
                <div>
                    <span className="inline-flex items-center gap-2.5 font-['IBM_Plex_Mono'] text-[10.5px] font-semibold tracking-[0.08em] uppercase before:h-0.5 before:w-[22px] before:bg-foreground min-[901px]:text-xs min-[901px]:tracking-[0.14em]">
                        {t('hero.eyebrow')}
                    </span>

                    <h1 className="mt-[22px] mb-7 font-[Archivo] text-[clamp(40px,5.4vw,64px)] leading-[1.08] font-extrabold tracking-[-0.02em] text-balance rtl:mb-10 rtl:leading-[1.4]">
                        {t('hero.titleBefore')}
                        <Highlight>{t('hero.titleHighlight')}</Highlight>
                        {t('hero.titleAfter')}
                    </h1>

                    <p className="max-w-[560px] text-[19px] leading-[1.55] text-copy">
                        {t('hero.ledeBeforeFee')}
                        <strong>{t('hero.fee')}</strong>
                        {t('hero.ledeBeforeFree')}
                        <strong>{t('hero.free')}</strong>
                    </p>

                    <div className="mt-9">
                        <a
                            className="group relative inline-block cursor-pointer overflow-hidden rounded-[10px] border-2 border-border bg-foreground px-[34px] py-[18px] font-[Archivo] text-[17px] font-extrabold tracking-[0.01em] text-page no-underline transition-colors duration-[250ms] before:absolute before:inset-0 before:translate-x-[-101%] before:bg-marker before:transition-transform before:duration-300 before:ease-[cubic-bezier(.7,0,.2,1)] hover:text-marker-ink hover:before:translate-x-0 rtl:before:translate-x-[101%] rtl:hover:before:translate-x-0 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-leak"
                            href="#audit"
                        >
                            <span className="relative z-10">
                                {t('hero.cta')}
                            </span>
                        </a>
                        <p className="mt-3 font-['IBM_Plex_Mono'] text-[12.5px] text-copy-muted">
                            {t('hero.sub')}
                        </p>
                    </div>
                </div>

                <RevenueMeter />
            </div>
        </header>
    );
}
