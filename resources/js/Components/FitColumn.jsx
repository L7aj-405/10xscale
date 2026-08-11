import Reveal from './Reveal';

export default function FitColumn({ delay = 0, items, title, variant = 'yes' }) {
    const isPositive = variant === 'yes';

    return (
        <Reveal
            as="article"
            className="rounded-[10px] border-2 border-border bg-surface p-[30px]"
            delay={delay}
        >
            <h3 className="font-[Archivo] text-xl leading-[1.04] font-extrabold tracking-[-0.02em]">
                {title}
            </h3>
            <ul className="mt-4">
                {items.map((item) => (
                    <li
                        className="relative border-t border-border-soft py-2.5 pe-0 ps-[26px] text-[15.5px] leading-[1.55]"
                        key={item}
                    >
                        <span
                            aria-hidden="true"
                            className={`absolute start-0.5 font-bold ${
                                isPositive ? 'text-foreground' : 'text-leak'
                            }`}
                        >
                            {isPositive ? '✓' : '✕'}
                        </span>
                        {item}
                    </li>
                ))}
            </ul>
        </Reveal>
    );
}
