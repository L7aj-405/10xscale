import { router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../../Components/Dashboard/DashboardLayout';
import PageHeader from '../../../Components/Dashboard/PageHeader';

export default function Index({ teamMembers, storeUrl }) {
    const [editor, setEditor] = useState(null);
    const [memberToDelete, setMemberToDelete] = useState(null);

    return (
        <DashboardLayout title="Team members">
            <PageHeader
                description="Manage the people shown in the landing-page team carousel, including localized content, photos and social links."
                eyebrow="Admin only"
                title="Team section"
            />

            <section className="overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-sm">
                <div className="flex flex-col gap-4 border-b border-border-soft px-5 py-5 min-[640px]:flex-row min-[640px]:items-center min-[640px]:justify-between min-[700px]:px-7">
                    <div>
                        <h2 className="font-[Archivo] text-xl font-black">Team members</h2>
                        <p className="mt-1 text-sm text-copy-muted">Select a row to edit its profile. Lower position numbers appear first.</p>
                    </div>
                    <button className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 font-[Archivo] text-sm font-bold text-page hover:bg-marker hover:text-marker-ink focus-visible:outline-3 focus-visible:outline-marker" onClick={() => setEditor({ mode: 'create' })} type="button">
                        <PlusIcon className="size-4" />
                        Add New Team Member
                    </button>
                </div>

                {teamMembers.length ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] border-collapse text-left">
                            <thead className="bg-surface-muted">
                                <tr className="border-b border-border-soft font-['IBM_Plex_Mono'] text-[10px] font-bold tracking-[0.1em] text-copy-muted uppercase">
                                    <th className="px-5 py-3.5 min-[700px]:ps-7" scope="col">Member</th>
                                    <th className="px-5 py-3.5" scope="col">Role</th>
                                    <th className="px-5 py-3.5" scope="col">Social links</th>
                                    <th className="px-5 py-3.5 text-center" scope="col">Position</th>
                                    <th className="px-5 py-3.5" scope="col">Status</th>
                                    <th className="px-5 py-3.5 text-right min-[700px]:pe-7" scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-soft">
                                {teamMembers.map((member) => (
                                    <TeamMemberRow
                                        key={member.id}
                                        member={member}
                                        onDelete={() => setMemberToDelete(member)}
                                        onEdit={() => setEditor({ member, mode: 'edit' })}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState onAdd={() => setEditor({ mode: 'create' })} />
                )}

                <div className="flex items-center justify-between border-t border-border-soft bg-surface-muted px-5 py-3 text-xs text-copy-muted min-[700px]:px-7">
                    <span>{teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'}</span>
                    <span>Active profiles appear on the website</span>
                </div>
            </section>

            {editor ? (
                <MemberEditorModal
                    key={editor.member?.id ?? 'new'}
                    member={editor.member}
                    onClose={() => setEditor(null)}
                    storeUrl={storeUrl}
                />
            ) : null}

            {memberToDelete ? (
                <DeleteConfirmationModal
                    member={memberToDelete}
                    onClose={() => setMemberToDelete(null)}
                />
            ) : null}
        </DashboardLayout>
    );
}

function TeamMemberRow({ member, onDelete, onEdit }) {
    const socials = [member.linkedin_url, member.x_url, member.website_url].filter(Boolean).length;

    const handleKeyDown = (event) => {
        if (event.target !== event.currentTarget) return;

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onEdit();
        }
    };

    return (
        <tr
            aria-label={`Edit ${member.name?.en || member.initials}`}
            className="cursor-pointer transition-colors hover:bg-surface-muted focus:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-marker"
            onClick={onEdit}
            onKeyDown={handleKeyDown}
            tabIndex="0"
        >
            <td className="px-5 py-4 min-[700px]:ps-7">
                <div className="flex items-center gap-3.5">
                    <Avatar member={member} />
                    <div className="min-w-0">
                        <p className="max-w-52 truncate font-[Archivo] text-sm font-bold text-foreground">{member.name?.en || member.initials}</p>
                        <p className="mt-0.5 text-xs text-copy-muted">{member.initials}</p>
                    </div>
                </div>
            </td>
            <td className="px-5 py-4">
                <p className="max-w-52 truncate text-sm font-semibold text-foreground">{member.role?.en}</p>
                <p className="mt-0.5 text-xs text-copy-muted">EN · FR · AR</p>
            </td>
            <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1.5 text-sm text-copy-muted">
                    <LinkIcon className="size-4" />
                    {socials ? `${socials} connected` : 'None'}
                </span>
            </td>
            <td className="px-5 py-4 text-center">
                <span className="inline-grid min-w-8 place-items-center rounded-lg border border-border-soft bg-surface-muted px-2 py-1 text-xs font-bold">{member.position}</span>
            </td>
            <td className="px-5 py-4">
                <StatusBadge active={member.is_active} />
            </td>
            <td className="px-5 py-4 min-[700px]:pe-7">
                <div className="flex justify-end gap-2">
                    <button aria-label={`Edit ${member.name?.en || member.initials}`} className={iconButtonClass} onClick={(event) => { event.stopPropagation(); onEdit(); }} type="button">
                        <EditIcon className="size-4" />
                    </button>
                    <button aria-label={`Delete ${member.name?.en || member.initials}`} className={`${iconButtonClass} border-leak/30 text-leak hover:bg-leak/10`} onClick={(event) => { event.stopPropagation(); onDelete(); }} type="button">
                        <TrashIcon className="size-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function MemberEditorModal({ member, onClose, storeUrl }) {
    const editing = Boolean(member);
    const form = useForm(member ? memberFormData(member) : emptyMember());

    useModalBehavior(onClose, form.processing);

    const submit = (event) => {
        event.preventDefault();

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: onClose,
        };

        if (editing) {
            form.transform((data) => ({ ...data, _method: 'put' })).post(member.update_url, options);
        } else {
            form.post(storeUrl, options);
        }
    };

    return (
        <ModalShell labelledBy="team-member-modal-title" onClose={() => !form.processing && onClose()}>
            <form className="flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-2xl" encType="multipart/form-data" onSubmit={submit}>
                <div className="flex items-start justify-between gap-5 border-b border-border-soft px-5 py-5 min-[700px]:px-7">
                    <div>
                        <p className="font-['IBM_Plex_Mono'] text-[10px] font-bold tracking-[0.14em] text-copy-muted uppercase">{editing ? 'Edit profile' : 'New profile'}</p>
                        <h2 className="mt-1 font-[Archivo] text-2xl font-black" id="team-member-modal-title">{editing ? `Edit ${member.name?.en || member.initials}` : 'Add New Team Member'}</h2>
                        <p className="mt-1 text-sm text-copy-muted">Enter the profile in English. French and Arabic are generated automatically when you save.</p>
                    </div>
                    <button aria-label="Close team member editor" className={iconButtonClass} disabled={form.processing} onClick={onClose} type="button"><CloseIcon className="size-5" /></button>
                </div>

                <div className="overflow-y-auto px-5 py-6 min-[700px]:px-7">
                    {form.errors.translation ? (
                        <div className="mb-5 rounded-xl border border-leak/30 bg-leak/10 px-4 py-3 text-sm font-semibold text-leak" role="alert">{form.errors.translation}</div>
                    ) : null}
                    <MemberFields existingPhotoUrl={member?.photo_url} form={form} />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-border-soft bg-surface-muted px-5 py-4 min-[520px]:flex-row min-[520px]:justify-end min-[700px]:px-7">
                    <button className={secondaryButtonClass} disabled={form.processing} onClick={onClose} type="button">Cancel</button>
                    <button className={primaryButtonClass} disabled={form.processing} type="submit">{form.processing ? 'Saving…' : 'Save'}</button>
                </div>
            </form>
        </ModalShell>
    );
}

function MemberFields({ existingPhotoUrl, form }) {
    return (
        <div className="grid gap-6">
            <div className="flex items-start gap-3 rounded-xl border border-marker/40 bg-marker/10 px-4 py-3">
                <LanguageIcon className="mt-0.5 size-5 shrink-0 text-foreground" />
                <div>
                    <p className="text-sm font-bold text-foreground">Automatic translation enabled</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-copy-muted">English content is translated to French and Arabic in the backend every time this profile is saved.</p>
                </div>
            </div>

            <div className="grid gap-4 min-[640px]:grid-cols-2">
                <Field error={errorFor(form.errors, 'initials')} label="Initials">
                    <input className={inputClass} maxLength="6" onChange={(event) => form.setData('initials', event.target.value.toUpperCase())} placeholder="AB" required value={form.data.initials} />
                </Field>
                <Field error={errorFor(form.errors, 'position')} label="Display position">
                    <input className={inputClass} min="0" onChange={(event) => form.setData('position', Number(event.target.value))} required type="number" value={form.data.position} />
                </Field>
            </div>

            <fieldset className="rounded-xl border border-border-soft bg-surface-muted p-4 min-[700px]:p-5">
                <legend className="px-2 font-['IBM_Plex_Mono'] text-[10px] font-bold tracking-[0.12em] text-copy-muted uppercase">English profile content</legend>
                <div className="grid gap-4 min-[640px]:grid-cols-2">
                    <Field error={errorFor(form.errors, 'name')} label="Name">
                        <input className={inputClass} onChange={(event) => form.setData('name', event.target.value)} required value={form.data.name} />
                    </Field>
                    <Field error={errorFor(form.errors, 'role')} label="Role">
                        <input className={inputClass} onChange={(event) => form.setData('role', event.target.value)} required value={form.data.role} />
                    </Field>
                    <div className="min-[640px]:col-span-2">
                        <Field error={errorFor(form.errors, 'bio')} label="Bio">
                            <textarea className={`${inputClass} min-h-28 resize-y`} maxLength="1000" onChange={(event) => form.setData('bio', event.target.value)} required value={form.data.bio} />
                        </Field>
                    </div>
                    <div className="min-[640px]:col-span-2">
                        <Field error={errorFor(form.errors, 'photo_label')} label="Photo placeholder label (optional)">
                            <input className={inputClass} maxLength="100" onChange={(event) => form.setData('photo_label', event.target.value)} placeholder="Add team photo" value={form.data.photo_label} />
                        </Field>
                    </div>
                </div>
            </fieldset>

            <div className="grid items-start gap-4 min-[640px]:grid-cols-[120px_minmax(0,1fr)]">
                {existingPhotoUrl ? <img alt="Current team member" className="aspect-square w-[120px] rounded-xl border border-border-soft object-cover" src={existingPhotoUrl} /> : <div className="grid aspect-square w-[120px] place-items-center rounded-xl border border-dashed border-border-soft bg-surface-muted font-[Archivo] text-2xl font-black text-copy-muted">{form.data.initials || 'PHOTO'}</div>}
                <Field error={errorFor(form.errors, 'photo')} label={existingPhotoUrl ? 'Replace photo (optional)' : 'Photo (optional)'}>
                    <input accept="image/png,image/jpeg,image/webp" className={fileClass} onChange={(event) => form.setData('photo', event.target.files[0] ?? null)} type="file" />
                    <span className="mt-1.5 block text-xs font-normal text-copy-muted">PNG, JPG or WEBP up to 5 MB. A portrait crop works best.</span>
                </Field>
            </div>

            <div className="grid gap-4 min-[640px]:grid-cols-2 min-[900px]:grid-cols-3">
                <Field error={errorFor(form.errors, 'linkedin_url')} label="LinkedIn URL">
                    <input className={inputClass} onChange={(event) => form.setData('linkedin_url', event.target.value)} placeholder="https://linkedin.com/in/..." type="url" value={form.data.linkedin_url} />
                </Field>
                <Field error={errorFor(form.errors, 'x_url')} label="X / Twitter URL">
                    <input className={inputClass} onChange={(event) => form.setData('x_url', event.target.value)} placeholder="https://x.com/..." type="url" value={form.data.x_url} />
                </Field>
                <Field error={errorFor(form.errors, 'website_url')} label="Website URL">
                    <input className={inputClass} onChange={(event) => form.setData('website_url', event.target.value)} placeholder="https://example.com" type="url" value={form.data.website_url} />
                </Field>
            </div>

            <Toggle checked={form.data.is_active} label="Visible on the landing page" onChange={(checked) => form.setData('is_active', checked)} />
        </div>
    );
}

function DeleteConfirmationModal({ member, onClose }) {
    const [deleting, setDeleting] = useState(false);
    const name = member.name?.en || member.initials;

    useModalBehavior(onClose, deleting);

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(member.delete_url, {
            preserveScroll: true,
            onSuccess: onClose,
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <ModalShell labelledBy="delete-team-member-title" onClose={() => !deleting && onClose()}>
            <div className="w-full max-w-md rounded-2xl border border-border-soft bg-surface p-6 shadow-2xl min-[520px]:p-7">
                <div className="grid size-12 place-items-center rounded-full bg-leak/10 text-leak"><TrashIcon className="size-5" /></div>
                <h2 className="mt-5 font-[Archivo] text-2xl font-black" id="delete-team-member-title">Remove team member?</h2>
                <p className="mt-2 leading-relaxed text-copy-muted"><strong className="text-foreground">{name}</strong> will disappear from the dashboard and public team carousel. The record is soft deleted and can still be recovered from the database.</p>
                <div className="mt-7 flex flex-col-reverse gap-3 min-[420px]:flex-row min-[420px]:justify-end">
                    <button className={secondaryButtonClass} disabled={deleting} onClick={onClose} type="button">Cancel</button>
                    <button className="cursor-pointer rounded-xl bg-leak px-5 py-3 text-sm font-bold text-white hover:opacity-90 disabled:cursor-wait disabled:opacity-60" disabled={deleting} onClick={confirmDelete} type="button">{deleting ? 'Removing…' : 'Delete team member'}</button>
                </div>
            </div>
        </ModalShell>
    );
}

function ModalShell({ children, labelledBy, onClose }) {
    return (
        <div aria-labelledby={labelledBy} aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="dialog">
            {children}
        </div>
    );
}

function useModalBehavior(onClose, locked) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !locked) onClose();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [locked, onClose]);
}

function Avatar({ member }) {
    return member.photo_url ? (
        <img alt="" className="size-11 shrink-0 rounded-xl border border-border-soft object-cover" src={member.photo_url} />
    ) : (
        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border-soft bg-surface-muted font-[Archivo] text-sm font-black">{member.initials}</span>
    );
}

function StatusBadge({ active }) {
    return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${active ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-surface-muted text-copy-muted'}`}><span className={`size-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-copy-muted'}`} />{active ? 'Visible' : 'Hidden'}</span>;
}

function EmptyState({ onAdd }) {
    return (
        <div className="px-6 py-16 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-surface-muted text-copy-muted"><TeamIcon className="size-6" /></div>
            <p className="mt-4 font-[Archivo] text-lg font-black">No team members yet</p>
            <p className="mt-1 text-sm text-copy-muted">Add the first profile to populate the public carousel.</p>
            <button className={`${primaryButtonClass} mt-5`} onClick={onAdd} type="button">Add New Team Member</button>
        </div>
    );
}

function Toggle({ checked, label, onChange }) {
    return <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl border border-border-soft bg-surface-muted px-4 py-3 text-sm font-semibold"><input checked={checked} className="size-4 accent-[var(--color-marker)]" onChange={(event) => onChange(event.target.checked)} type="checkbox" />{label}</label>;
}

function Field({ children, error, label }) {
    return <label className="block text-sm font-semibold">{label}{children}{error ? <span className="mt-1.5 block text-xs font-medium text-leak">{error}</span> : null}</label>;
}

function emptyMember() { return { name: '', role: '', bio: '', photo_label: '', initials: '', photo: null, linkedin_url: '', x_url: '', website_url: '', position: 0, is_active: true }; }

function memberFormData(member) {
    return { name: member.name?.en ?? '', role: member.role?.en ?? '', bio: member.bio?.en ?? '', photo_label: member.photo_label?.en ?? '', initials: member.initials, photo: null, linkedin_url: member.linkedin_url ?? '', x_url: member.x_url ?? '', website_url: member.website_url ?? '', position: member.position, is_active: member.is_active };
}

function errorFor(errors, path) { return errors[path] ?? path.split('.').reduce((value, key) => value?.[key], errors); }

function PlusIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /></svg>; }
function EditIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><path d="m14.7 5.3 4 4M4 20l4.5-1 10.2-10.2a2.83 2.83 0 0 0-4-4L4.5 15 4 20Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function TrashIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><path d="M4 7h16M9 11v6m6-6v6M6 7l1 14h10l1-14M9 7l1-3h4l1 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function CloseIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /></svg>; }
function LinkIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><path d="m10 13.5 4-4m-7.5 7.9-1.9 1.9a3.54 3.54 0 0 1-5-5l3.5-3.5a3.54 3.54 0 0 1 5 0m7.4-4.2 1.9-1.9a3.54 3.54 0 0 1 5 5l-3.5 3.5a3.54 3.54 0 0 1-5 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>; }
function TeamIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>; }
function LanguageIcon({ className }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M3.5 12h17M12 3c2.2 2.47 3.33 5.47 3.4 9-.07 3.53-1.2 6.53-3.4 9-2.2-2.47-3.33-5.47-3.4-9C8.67 8.47 9.8 5.47 12 3Z" stroke="currentColor" strokeWidth="1.8" /></svg>; }

const inputClass = 'mt-2 w-full rounded-xl border border-border-soft bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-foreground focus:ring-2 focus:ring-marker';
const fileClass = 'mt-2 block w-full cursor-pointer rounded-xl border border-border-soft bg-surface text-xs text-copy-muted file:me-3 file:cursor-pointer file:border-0 file:bg-foreground file:px-3 file:py-2.5 file:font-bold file:text-page hover:file:bg-marker hover:file:text-marker-ink';
const primaryButtonClass = 'cursor-pointer rounded-xl bg-foreground px-5 py-3 font-[Archivo] text-sm font-bold text-page hover:bg-marker hover:text-marker-ink disabled:cursor-wait disabled:opacity-60';
const secondaryButtonClass = 'cursor-pointer rounded-xl border border-border-soft bg-surface px-5 py-3 text-sm font-bold text-foreground hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60';
const iconButtonClass = 'grid size-9 cursor-pointer place-items-center rounded-lg border border-border-soft bg-surface text-copy-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-marker disabled:cursor-not-allowed disabled:opacity-50';
