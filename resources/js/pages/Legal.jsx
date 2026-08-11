import { Head } from '@inertiajs/react';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import Reveal from '../Components/Reveal';
import { useI18n } from '../i18n/I18nContext';

export default function Legal({ document }) {
    const { t } = useI18n();
    const key = `legal.documents.${document}`;

    return (
        <>
            <Head title={t(`${key}.title`)}>
                <meta content={t(`${key}.summary`)} name="description" />
            </Head>
            <Navigation />
            <main className="bg-page" id="top">
                <section className="min-h-[58vh] border-b-2 border-border py-[72px] min-[901px]:py-[96px]">
                    <Reveal as="article" className="mx-auto max-w-[820px] px-6">
                        <span className="inline-flex items-center gap-2.5 font-['IBM_Plex_Mono'] text-xs font-semibold tracking-[0.14em] uppercase before:h-0.5 before:w-[22px] before:bg-foreground">
                            {t('legal.eyebrow')}
                        </span>
                        <h1 className="mt-[18px] font-[Archivo] text-[clamp(38px,5vw,58px)] leading-[1.08] font-extrabold tracking-[-0.02em] rtl:leading-[1.35]">
                            {t(`${key}.title`)}
                        </h1>
                        <p className="mt-6 text-lg leading-[1.7] text-copy">{t(`${key}.summary`)}</p>
                        <div className="mt-10 border-s-4 border-marker ps-5">
                            <h2 className="font-[Archivo] text-xl font-bold">{t('legal.contactTitle')}</h2>
                            <p className="mt-2 text-copy">
                                {t('legal.contactText')}{' '}
                                <a className="font-semibold text-foreground underline decoration-marker decoration-2 underline-offset-4" href="mailto:hello@10xscale.com">hello@10xscale.com</a>.
                            </p>
                        </div>
                    </Reveal>
                </section>
            </main>
            <Footer />
        </>
    );
}
