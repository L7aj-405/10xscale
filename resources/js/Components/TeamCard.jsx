import Reveal from './Reveal';

export default function TeamCard({ language, member }) {
    const name = localized(member.name, language);
    const role = localized(member.role, language);
    const bio = localized(member.bio, language);
    const photoLabel = localized(member.photo_label, language);
    const socialLinks = [
        { href: member.linkedin_url, label: 'LinkedIn', icon: LinkedInIcon },
        { href: member.x_url, label: 'X', icon: XIcon },
        { href: member.website_url, label: 'Website', icon: WebsiteIcon },
    ].filter((link) => link.href);

    return (
        <Reveal as="article" className="flex h-full min-h-[570px] flex-col overflow-hidden rounded-[10px] border-2 border-border bg-surface min-[560px]:min-h-[540px]">
            <div className="relative grid aspect-4/5 shrink-0 place-items-center overflow-hidden border-b-2 border-border bg-surface-muted">
                {member.photo_url ? (
                    <img alt={name} className="size-full object-cover transition-transform duration-500 hover:scale-[1.03]" loading="lazy" src={member.photo_url} />
                ) : (
                    <span className="font-[Archivo] text-[54px] font-black text-surface-muted [-webkit-text-stroke:2px_var(--color-border)]">{member.initials}</span>
                )}
                {!member.photo_url && photoLabel ? (
                    <span className="absolute bottom-3 start-3 rounded-[5px] bg-foreground px-2 py-1.5 font-['IBM_Plex_Mono'] text-[10px] tracking-[0.08em] text-page uppercase">{photoLabel}</span>
                ) : null}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-1 font-[Archivo] text-[19px] font-bold">{name}</h3>
                <p className="mb-[11px] font-['IBM_Plex_Mono'] text-[11.5px] font-semibold tracking-[0.08em] text-leak uppercase">{role}</p>
                <p className="text-sm leading-relaxed text-copy">{bio}</p>

                {socialLinks.length ? (
                    <div className="mt-auto flex gap-2 pt-5">
                        {socialLinks.map(({ href, icon: Icon, label }) => (
                            <a aria-label={`${name} — ${label}`} className="grid size-9 place-items-center rounded-full border border-border-soft text-copy-muted transition-colors hover:border-foreground hover:bg-foreground hover:text-page" href={href} key={label} rel="noreferrer" target="_blank">
                                <Icon className="size-4" />
                            </a>
                        ))}
                    </div>
                ) : null}
            </div>
        </Reveal>
    );
}

function localized(value, language) {
    if (!value || typeof value !== 'object') return value ?? '';
    return value[language] || value.en || Object.values(value).find(Boolean) || '';
}

function LinkedInIcon({ className }) {
    return <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M6.5 8.3H3V21h3.5V8.3ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.7c0-3.83-2.04-5.61-4.77-5.61-2.2 0-3.18 1.21-3.73 2.06V8.3H9V21h3.5v-6.29c0-1.66.32-3.27 2.38-3.27 2.03 0 2.05 1.9 2.05 3.38V21H21v-7.3Z" /></svg>;
}

function XIcon({ className }) {
    return <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M18.9 3H22l-6.77 7.74L23.2 21h-6.24l-4.89-6.39L6.48 21H3.36l7.26-8.3L2.98 3h6.4l4.42 5.84L18.9 3Zm-1.1 16.2h1.73L8.44 4.71H6.59L17.8 19.2Z" /></svg>;
}

function WebsiteIcon({ className }) {
    return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M3.5 12h17M12 3c2.2 2.47 3.33 5.47 3.4 9-.07 3.53-1.2 6.53-3.4 9-2.2-2.47-3.33-5.47-3.4-9C8.67 8.47 9.8 5.47 12 3Z" stroke="currentColor" strokeWidth="1.8" /></svg>;
}
