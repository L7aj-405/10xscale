import Reveal from './Reveal';

export default function CaseStudyCard({ caseStudy, index }) {
    const number = String(index + 1).padStart(2, '0');

    return (
        <Reveal
            as="article"
            className="group overflow-hidden rounded-[10px] border-2 border-border bg-surface transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-border)]"
        >
            <div
                className={`case-media-pattern grid aspect-video place-items-center overflow-hidden border-b-2 border-border p-[18px] text-center ${
                    caseStudy.type === 'video'
                        ? 'case-media-video bg-nav text-on-nav'
                        : 'bg-surface-muted text-foreground'
                }`}
            >
                <div className="max-w-[250px] font-['IBM_Plex_Mono'] text-xs tracking-[0.1em] uppercase">
                    {caseStudy.type === 'video' ? (
                        <span className="mx-auto mb-3.5 grid size-[58px] place-items-center rounded-full bg-marker ps-1 font-[Archivo] text-[22px] text-marker-ink">
                            ▶
                        </span>
                    ) : null}
                    <b className="mb-1.5 block font-[Archivo] text-lg tracking-normal">
                        {caseStudy.placeholder} {number}
                    </b>
                    {caseStudy.mediaDescription}
                </div>
            </div>

            <div className="p-[23px]">
                <div className="flex items-center justify-between gap-3 font-['IBM_Plex_Mono'] text-[11px] tracking-[0.08em] text-copy-subtle uppercase">
                    <span>{caseStudy.label} {number}</span>
                    <span className="rounded-[5px] bg-marker px-2 py-1 font-semibold text-marker-ink">
                        {caseStudy.typeLabel}
                    </span>
                </div>
                <h3 className="mt-3.5 mb-2 font-[Archivo] text-xl leading-tight font-bold">
                    {caseStudy.title}
                </h3>
                <p className="text-[14.5px] text-copy">{caseStudy.description}</p>

                <div className="mt-[18px] grid grid-cols-2 border-t border-border-soft">
                    <Metric label={caseStudy.emailLabel} value={caseStudy.email} />
                    <Metric bordered label={caseStudy.openLabel} value={caseStudy.open} />
                    <Metric label={caseStudy.timeLabel} value={caseStudy.time} />
                    <Metric bordered label={caseStudy.revenueLabel} value={caseStudy.revenue} />
                </div>
            </div>
        </Reveal>
    );
}

function Metric({ bordered = false, label, value }) {
    const isComparison = Array.isArray(value);

    return (
        <div className={`border-b border-border-soft py-3.5 ${bordered ? 'border-s ps-3' : 'pe-3'}`}>
            <span className="mb-1.5 block font-['IBM_Plex_Mono'] text-[10px] tracking-[0.07em] text-copy-faint uppercase">
                {label}
            </span>
            <b className="font-[Archivo] text-[15px] leading-[1.35]">
                {isComparison ? (
                    <>
                        <span className="text-copy-faint line-through">{value[0]}</span>
                        {' → '}
                        <span className="rounded-[3px] bg-marker px-1 text-marker-ink">{value[1]}</span>
                    </>
                ) : value}
            </b>
        </div>
    );
}
