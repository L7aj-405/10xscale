import Reveal from './Reveal';

const imageStyles = [
    'bg-surface-muted text-foreground',
    'bg-nav text-on-nav',
    'bg-marker text-marker-ink',
    'bg-[#dad6cb] text-ink dark:bg-[#4b4944] dark:text-white',
    'bg-nav text-on-nav',
];

export default function BlogCard({ article, index }) {
    const number = String(index + 1).padStart(2, '0');

    return (
        <Reveal
            as="article"
            className={`group overflow-hidden rounded-[10px] border-2 border-border bg-surface transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-border)] ${
                index < 2 ? 'min-[760px]:col-span-3' : 'min-[760px]:col-span-2'
            }`}
            id={`article-${number}`}
        >
            <div
                aria-label={article.coverLabel}
                className={`blog-cover-pattern relative flex aspect-video items-end overflow-hidden border-b-2 border-border p-5 ${imageStyles[index]}`}
                role="img"
            >
                <span className="absolute end-4 top-2 font-[Archivo] text-[76px] leading-none font-black text-transparent opacity-20 [-webkit-text-stroke:2px_currentColor]">
                    {number}
                </span>
                <span className="relative z-10 rounded-md border border-ink bg-paper px-2.5 py-[7px] font-['IBM_Plex_Mono'] text-[11px] tracking-[0.09em] text-ink uppercase">
                    {article.visual}
                </span>
            </div>
            <div className="p-[22px]">
                <span className="font-['IBM_Plex_Mono'] text-[10.5px] tracking-[0.08em] text-copy-subtle uppercase">
                    {article.tag}
                </span>
                <h2 className="mt-2.5 mb-2.5 font-[Archivo] text-xl leading-[1.2] font-bold">
                    {article.title}
                </h2>
                <p className="text-[14.5px] text-copy">{article.description}</p>
                <a
                    className="mt-[17px] inline-block border-b-2 border-marker font-['IBM_Plex_Mono'] text-[11.5px] font-semibold tracking-[0.06em] text-foreground uppercase no-underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-leak"
                    href={`#article-${number}`}
                >
                    {article.link}
                </a>
            </div>
        </Reveal>
    );
}
