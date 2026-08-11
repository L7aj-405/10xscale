export default function MonthCard({ index, items, tag, title }) {
    return (
        <article
            className={`p-[26px] min-[901px]:p-8 ${
                index > 0
                    ? 'border-t-2 border-border min-[901px]:border-t-0 min-[901px]:border-s-2'
                    : ''
            }`}
        >
            <p className="inline-block rounded-md bg-foreground px-2.5 py-[5px] font-['IBM_Plex_Mono'] text-xs leading-[1.55] font-semibold tracking-[0.12em] text-page">
                {tag}
            </p>

            <h3 className="my-4 font-[Archivo] text-[21px] leading-[1.04] font-extrabold tracking-[-0.02em]">
                {title}
            </h3>

            <ul>
                {items.map(({ highlighted = false, text }) => (
                    <li
                        className={`relative border-t border-border-soft py-2 pe-0 ps-6 text-[14.5px] leading-[1.55] ${
                            highlighted
                                ? '-mx-2 mt-2 rounded-md border-t-0 bg-marker pe-2 ps-8 font-semibold text-marker-ink'
                                : ''
                        }`}
                        key={text}
                    >
                        <span
                            aria-hidden="true"
                            className={`absolute top-2 font-['IBM_Plex_Mono'] font-semibold ${
                                highlighted ? 'start-2' : 'start-0'
                            }`}
                        >
                            →
                        </span>
                        {text}
                    </li>
                ))}
            </ul>
        </article>
    );
}
