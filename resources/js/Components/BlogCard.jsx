import Reveal from './Reveal';
import BlogCoverMedia from './BlogCoverMedia';
import { useI18n } from '../i18n/I18nContext';

const imageStyles = [
    'bg-surface-muted text-foreground',
    'bg-nav text-on-nav',
    'bg-marker text-marker-ink',
    'bg-[#dad6cb] text-ink dark:bg-[#4b4944] dark:text-white',
    'bg-nav text-on-nav',
];

export default function BlogCard({ article, index }) {
    const { language } = useI18n();
    const number = String(index + 1).padStart(2, '0');
    const title = localized(article.title, language);
    const excerpt = localized(article.excerpt, language);
    const visual = localized(article.visual, language);
    const category = localized(article.category, language);
    const coverLabel = localized(article.cover_label, language);
    const hasVideo = article.cover_media_type === 'video' && article.cover_video_url;
    const hasMedia = hasVideo || article.cover_image_url;
    const readLabel = language === 'fr' ? 'Lire l’article →' : language === 'ar' ? 'اقرأ المقال ←' : 'Read article →';

    return (
        <Reveal
            as="article"
            className={`group overflow-hidden rounded-[10px] border-2 border-border bg-surface transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-border)] ${
                index < 2 ? 'min-[760px]:col-span-3' : 'min-[760px]:col-span-2'
            }`}
            id={`article-${number}`}
        >
            <div
                aria-label={hasMedia ? undefined : coverLabel}
                className={`blog-cover-pattern relative aspect-video overflow-hidden border-b-2 border-border ${imageStyles[index % imageStyles.length]}`}
                role={hasMedia ? undefined : 'img'}
            >
                <BlogCoverMedia className="absolute inset-0 size-full border-0 object-cover" label={coverLabel} post={article} />
                <span className="pointer-events-none absolute end-4 top-2 z-10 font-[Archivo] text-[76px] leading-none font-black text-transparent opacity-20 [-webkit-text-stroke:2px_currentColor]">
                    {number}
                </span>
                <span className={`pointer-events-none absolute start-5 z-10 rounded-md border border-ink bg-paper px-2.5 py-[7px] font-['IBM_Plex_Mono'] text-[11px] tracking-[0.09em] text-ink uppercase ${hasVideo ? 'top-4' : 'bottom-5'}`}>
                    {visual}
                </span>
            </div>
            <div className="p-[22px]">
                <span className="font-['IBM_Plex_Mono'] text-[10.5px] tracking-[0.08em] text-copy-subtle uppercase">
                    {category} · {article.reading_minutes} min
                </span>
                <h2 className="mt-2.5 mb-2.5 font-[Archivo] text-xl leading-[1.2] font-bold">
                    <a className="text-inherit no-underline" href={article.url}>{title}</a>
                </h2>
                <p className="text-[14.5px] text-copy">{excerpt}</p>
                <a
                    className="mt-[17px] inline-block border-b-2 border-marker font-['IBM_Plex_Mono'] text-[11.5px] font-semibold tracking-[0.06em] text-foreground uppercase no-underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-leak"
                    href={article.url}
                >
                    {readLabel}
                </a>
            </div>
        </Reveal>
    );
}

function localized(value, language) {
    return value?.[language] || value?.en || '';
}
