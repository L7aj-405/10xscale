import { Head } from '@inertiajs/react';
import Footer from '../Components/Footer';
import BlogCoverMedia from '../Components/BlogCoverMedia';
import Navigation from '../Components/Navigation';
import Reveal from '../Components/Reveal';
import { useI18n } from '../i18n/I18nContext';

const labels = {
    en: { back: 'Back to journal', min: 'min read', published: 'Published' },
    fr: { back: 'Retour au journal', min: 'min de lecture', published: 'Publié le' },
    ar: { back: 'العودة إلى المدونة', min: 'دقائق للقراءة', published: 'نُشر في' },
};

export default function BlogPost({ post }) {
    const { language } = useI18n();
    const copy = labels[language] ?? labels.en;
    const title = localized(post.title, language);
    const excerpt = localized(post.excerpt, language);
    const content = localized(post.content, language);
    const category = localized(post.category, language);
    const visual = localized(post.visual, language);
    const coverLabel = localized(post.cover_label, language);
    const hasMedia = post.cover_image_url || (post.cover_media_type === 'video' && post.cover_video_url);

    return (
        <>
            <Head title={title}>
                <meta content={excerpt} name="description" />
            </Head>
            <Navigation />
            <main className="bg-page" id="top">
                <article>
                    <header className="border-b-2 border-border py-16 min-[901px]:py-24">
                        <Reveal className="mx-auto max-w-[900px] px-6">
                            <a className="font-['IBM_Plex_Mono'] text-xs font-semibold tracking-[0.08em] text-foreground uppercase no-underline hover:border-b-2 hover:border-marker" href="/blog">← {copy.back}</a>
                            <div className="mt-8 flex flex-wrap items-center gap-3 font-['IBM_Plex_Mono'] text-[11px] tracking-[0.08em] text-copy-muted uppercase">
                                <span className="rounded-full bg-marker px-3 py-1.5 font-bold text-marker-ink">{category}</span>
                                <span>{post.reading_minutes} {copy.min}</span>
                                <span>{copy.published} {formatDate(post.published_at, language)}</span>
                            </div>
                            <h1 className="mt-5 font-[Archivo] text-[clamp(38px,7vw,72px)] leading-[1.02] font-black tracking-[-0.035em] text-balance rtl:leading-[1.3]">{title}</h1>
                            <p className="mt-6 max-w-[780px] text-[clamp(17px,2vw,21px)] leading-relaxed text-copy">{excerpt}</p>
                            <p className="mt-5 text-sm font-semibold text-copy-muted">{post.author}</p>
                        </Reveal>
                    </header>

                    <div className="mx-auto max-w-[1000px] px-6 pt-10">
                        <div
                            aria-label={hasMedia ? undefined : coverLabel}
                            className={`blog-cover-pattern relative grid aspect-[16/8] place-items-center overflow-hidden rounded-xl border-2 border-border ${post.cover_image_url ? '' : 'bg-nav text-on-nav'}`}
                            role={hasMedia ? undefined : 'img'}
                        >
                            <BlogCoverMedia className="absolute inset-0 size-full border-0 object-cover" label={coverLabel} post={post} />
                            {!hasMedia ? <span className="rounded-md border border-ink bg-paper px-4 py-2 font-['IBM_Plex_Mono'] text-xs font-semibold tracking-[0.1em] text-ink uppercase">{visual}</span> : null}
                        </div>
                    </div>

                    <Reveal className="mx-auto max-w-[760px] px-6 py-14 min-[901px]:py-20">
                        <div className="grid gap-7 text-[17px] leading-[1.85] text-copy">
                            {content.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                        </div>
                        <div className="mt-14 border-t-2 border-border pt-8">
                            <a className="inline-flex rounded-full bg-foreground px-6 py-3 font-[Archivo] text-sm font-bold text-page no-underline hover:bg-marker hover:text-marker-ink" href="/blog">← {copy.back}</a>
                        </div>
                    </Reveal>
                </article>
            </main>
            <Footer />
        </>
    );
}

function localized(value, language) { return value?.[language] || value?.en || ''; }
function formatDate(value, language) {
    if (!value) return '';
    return new Intl.DateTimeFormat(language, { dateStyle: 'long' }).format(new Date(`${value}T00:00:00`));
}
