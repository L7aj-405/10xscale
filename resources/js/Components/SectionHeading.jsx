import Reveal from './Reveal';

export default function SectionHeading({
    description,
    eyebrow,
    title,
    className = '',
}) {
    return (
        <Reveal className={`mb-[52px] max-w-[720px] ${className}`}>
            <span className="inline-flex items-center gap-2.5 font-['IBM_Plex_Mono'] text-[10.5px] font-semibold tracking-[0.08em] uppercase before:h-0.5 before:w-[22px] before:shrink-0 before:bg-foreground min-[901px]:text-xs min-[901px]:tracking-[0.14em]">
                {eyebrow}
            </span>

            <h2 className="mt-[18px] font-[Archivo] text-[clamp(30px,4vw,46px)] leading-[1.04] font-extrabold tracking-[-0.02em] text-balance rtl:leading-[1.35]">
                {title}
            </h2>

            {description ? (
                <p className="mt-4 text-[17.5px] leading-[1.55] text-copy">
                    {description}
                </p>
            ) : null}
        </Reveal>
    );
}
