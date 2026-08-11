export default function FaqItem({ answer, question }) {
    return (
        <details className="group mb-3.5 overflow-hidden rounded-[10px] border-2 border-border bg-surface open:bg-surface-muted">
            <summary className="relative cursor-pointer list-none py-5 pe-[58px] ps-[22px] font-[Archivo] text-[17.5px] leading-[1.3] font-bold marker:hidden focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-marker [&::-webkit-details-marker]:hidden">
                {question}
                <span
                    aria-hidden="true"
                    className="absolute top-1/2 end-[22px] -translate-y-1/2 font-['IBM_Plex_Mono'] text-2xl font-medium transition-transform duration-200 group-open:rotate-45"
                >
                    +
                </span>
            </summary>
            <p className="max-w-[760px] px-[22px] pb-[22px] text-[15.5px] leading-[1.55] text-copy">
                {answer}
            </p>
        </details>
    );
}
