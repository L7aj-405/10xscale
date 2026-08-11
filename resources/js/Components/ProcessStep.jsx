import Reveal from './Reveal';

export default function ProcessStep({ delay = 0, description, number, title }) {
    return (
        <Reveal
            as="article"
            className="rounded-[10px] border-2 border-border bg-surface p-7"
            delay={delay}
        >
            <span
                aria-hidden="true"
                className="mb-4 block font-[Archivo] text-[44px] leading-none font-black text-surface [-webkit-text-stroke:2px_var(--color-border)]"
            >
                {String(number).padStart(2, '0')}
            </span>
            <h3 className="mb-2.5 font-[Archivo] text-[19px] leading-[1.04] font-extrabold tracking-[-0.02em]">
                {title}
            </h3>
            <p className="text-[15px] leading-[1.55] text-copy">
                {description}
            </p>
        </Reveal>
    );
}
