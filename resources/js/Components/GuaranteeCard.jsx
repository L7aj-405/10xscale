import Reveal from './Reveal';

export default function GuaranteeCard({ delay = 0, description, term, title }) {
    return (
        <Reveal
            as="article"
            className="rounded-[10px] border-2 border-border bg-surface p-[26px]"
            delay={delay}
        >
            <p className="font-['IBM_Plex_Mono'] text-xs tracking-[0.12em] text-copy-subtle">
                {term}
            </p>
            <h3 className="my-2.5 font-[Archivo] text-xl leading-[1.04] font-extrabold tracking-[-0.02em]">
                {title}
            </h3>
            <p className="text-[15px] leading-[1.55] text-copy">
                {description}
            </p>
        </Reveal>
    );
}
