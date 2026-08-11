export default function PageHeader({ actions, eyebrow, title, description }) {
    return (
        <div className="mb-7 flex flex-col gap-5 min-[700px]:flex-row min-[700px]:items-end min-[700px]:justify-between">
            <div className="max-w-2xl">
                <p className="mb-2 font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.14em] text-copy-muted uppercase">{eyebrow}</p>
                <h1 className="font-[Archivo] text-[clamp(28px,4vw,40px)] leading-tight font-black tracking-[-0.02em]">{title}</h1>
                {description ? <p className="mt-2 max-w-xl text-[15px] text-copy-muted">{description}</p> : null}
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
    );
}
