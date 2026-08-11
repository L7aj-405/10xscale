import { Head } from '@inertiajs/react';
import BlogCard from '../Components/BlogCard';
import Footer from '../Components/Footer';
import Highlight from '../Components/Highlight';
import Navigation from '../Components/Navigation';
import Reveal from '../Components/Reveal';
import { useI18n } from '../i18n/I18nContext';

export default function Blog() {
    const { t } = useI18n();

    return (
        <>
            <Head title={t('blog.metaTitle')}>
                <meta content={t('blog.metaDescription')} name="description" />
            </Head>

            <Navigation />

            <main className="bg-page" id="top">
                <section className="border-b-2 border-border py-[72px] min-[901px]:py-[96px]">
                    <div className="mx-auto max-w-[1120px] px-6">
                        <Reveal className="mb-[52px] max-w-[760px]">
                            <span className="inline-flex items-center gap-2.5 font-['IBM_Plex_Mono'] text-[10.5px] font-semibold tracking-[0.08em] uppercase before:h-0.5 before:w-[22px] before:bg-foreground min-[901px]:text-xs min-[901px]:tracking-[0.14em]">
                                {t('blog.eyebrow')}
                            </span>
                            <h1 className="mt-[18px] font-[Archivo] text-[clamp(38px,5vw,58px)] leading-[1.04] font-extrabold tracking-[-0.02em] text-balance rtl:leading-[1.35]">
                                {t('blog.titleBefore')}
                                <Highlight>{t('blog.titleHighlight')}</Highlight>
                            </h1>
                            <p className="mt-5 max-w-[720px] text-[17.5px] leading-[1.55] text-copy">
                                {t('blog.description')}
                            </p>
                        </Reveal>

                        <div className="grid grid-cols-1 gap-[22px] min-[760px]:grid-cols-6">
                            {t('blog.articles').map((article, index) => (
                                <BlogCard article={article} index={index} key={index} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
