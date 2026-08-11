import Reveal from './Reveal';

export default function TeamCard({ member }) {
    return (
        <Reveal
            as="article"
            className="overflow-hidden rounded-[10px] border-2 border-border bg-surface"
        >
            <div className="relative grid aspect-4/5 place-items-center border-b-2 border-border bg-surface-muted">
                <span className="font-[Archivo] text-[54px] font-black text-surface-muted [-webkit-text-stroke:2px_var(--color-border)]">
                    {member.initials}
                </span>
                <span className="absolute bottom-3 start-3 rounded-[5px] bg-foreground px-2 py-1.5 font-['IBM_Plex_Mono'] text-[10px] tracking-[0.08em] text-page uppercase">
                    {member.photoLabel}
                </span>
            </div>
            <div className="p-5">
                <h3 className="mb-1 font-[Archivo] text-[19px] font-bold">{member.name}</h3>
                <p className="mb-[11px] font-['IBM_Plex_Mono'] text-[11.5px] font-semibold tracking-[0.08em] text-leak uppercase">
                    {member.role}
                </p>
                <p className="text-sm text-copy">{member.description}</p>
            </div>
        </Reveal>
    );
}
