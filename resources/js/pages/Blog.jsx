import { Head } from '@inertiajs/react';
import BlogCard from '../Components/BlogCard';
import Footer from '../Components/Footer';
import Highlight from '../Components/Highlight';
import Navigation from '../Components/Navigation';
import Reveal from '../Components/Reveal';
import { useI18n } from '../i18n/I18nContext';

export default function Blog({ posts = [] }) {
    const { language, t } = useI18n();
    const description = {
        en: 'Practical, actionable retention and Klaviyo guidance for growing Shopify teams.',
        fr: 'Des conseils pratiques et concrets sur la rétention et Klaviyo pour les équipes Shopify en croissance.',
        ar: 'إرشادات عملية وقابلة للتطبيق حول الاحتفاظ وKlaviyo لفرق Shopify النامية.',
    }[language];

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
                                {description}
                            </p>
                        </Reveal>

                        <div className="grid grid-cols-1 gap-[22px] min-[760px]:grid-cols-6">
                            {posts.map((article, index) => (
                                <BlogCard article={article} index={index} key={article.id} />
                            ))}
                        </div>
                        {!posts.length ? <p className="rounded-xl border-2 border-dashed border-border-soft bg-surface-muted px-6 py-14 text-center text-copy-muted">{{ en: 'No published articles yet.', fr: 'Aucun article publié pour le moment.', ar: 'لا توجد مقالات منشورة حالياً.' }[language]}</p> : null}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
