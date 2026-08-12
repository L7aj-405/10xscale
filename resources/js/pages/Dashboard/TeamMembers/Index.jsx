import { router, useForm } from '@inertiajs/react';
import DashboardLayout from '../../../Components/Dashboard/DashboardLayout';
import PageHeader from '../../../Components/Dashboard/PageHeader';

const locales = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'French' },
    { code: 'ar', label: 'Arabic' },
];

const emptyMember = () => ({
    name: localized(),
    role: localized(),
    bio: localized(),
    photo_label: localized(),
    initials: '',
    photo: null,
    linkedin_url: '',
    x_url: '',
    website_url: '',
    position: 0,
    is_active: true,
});

export default function Index({ teamMembers, storeUrl }) {
    return (
        <DashboardLayout title="Team members">
            <PageHeader
                description="Manage the people shown in the landing-page team carousel, including localized content, photos and social links."
                eyebrow="Admin only"
                title="Team section"
            />

            <div className="grid items-start gap-6 2xl:grid-cols-[430px_minmax(0,1fr)]">
                <CreateForm storeUrl={storeUrl} />

                <section className="rounded-2xl border border-border-soft bg-surface p-5 shadow-sm min-[700px]:p-7">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="font-[Archivo] text-xl font-black">Current team</h2>
                            <p className="mt-1 text-sm text-copy-muted">Lower position numbers appear first. Hidden members remain saved in the dashboard.</p>
                        </div>
                        <p className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-bold text-copy-muted">{teamMembers.length} members</p>
                    </div>

                    <div className="mt-6 grid gap-5">
                        {teamMembers.map((member) => <MemberEditor key={member.id} member={member} />)}
                        {!teamMembers.length ? <EmptyState /> : null}
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}

function CreateForm({ storeUrl }) {
    const form = useForm(emptyMember());

    const submit = (event) => {
        event.preventDefault();
        form.post(storeUrl, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <form className="rounded-2xl border border-border-soft bg-surface p-5 shadow-sm 2xl:sticky 2xl:top-[104px]" encType="multipart/form-data" onSubmit={submit}>
            <h2 className="font-[Archivo] text-xl font-black">Add a team member</h2>
            <p className="mt-1 text-sm text-copy-muted">English is required. French and Arabic automatically fall back to English when left blank.</p>
            <MemberFields form={form} photoRequired={false} />
            <button className={primaryButtonClass} disabled={form.processing} type="submit">
                {form.processing ? 'Adding…' : 'Add team member'}
            </button>
        </form>
    );
}

function MemberEditor({ member }) {
    const form = useForm({
        name: normalizeLocalized(member.name),
        role: normalizeLocalized(member.role),
        bio: normalizeLocalized(member.bio),
        photo_label: normalizeLocalized(member.photo_label),
        initials: member.initials,
        photo: null,
        linkedin_url: member.linkedin_url ?? '',
        x_url: member.x_url ?? '',
        website_url: member.website_url ?? '',
        position: member.position,
        is_active: member.is_active,
    });

    const submit = (event) => {
        event.preventDefault();
        form
            .transform((data) => ({ ...data, _method: 'put' }))
            .post(member.update_url, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => form.reset('photo'),
            });
    };

    const remove = () => {
        const name = member.name?.en || member.initials;
        if (window.confirm(`Delete ${name} from the team section?`)) {
            router.delete(member.delete_url, { preserveScroll: true });
        }
    };

    return (
        <form className="rounded-xl border border-border-soft bg-surface-muted p-4 min-[700px]:p-5" encType="multipart/form-data" onSubmit={submit}>
            <div className="mb-5 flex items-center gap-4 border-b border-border-soft pb-5">
                <Avatar member={member} />
                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-[Archivo] text-lg font-black">{member.name?.en || member.initials}</h3>
                    <p className="truncate text-sm text-copy-muted">{member.role?.en}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${member.is_active ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-surface text-copy-muted'}`}>
                    {member.is_active ? 'Visible' : 'Hidden'}
                </span>
            </div>

            <MemberFields form={form} />

            <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-border-soft pt-4">
                <button className="cursor-pointer rounded-lg bg-foreground px-4 py-2 text-xs font-bold text-page hover:bg-marker hover:text-marker-ink disabled:cursor-wait disabled:opacity-60" disabled={form.processing || !form.isDirty} type="submit">Save changes</button>
                <button className="cursor-pointer rounded-lg border border-leak/30 px-4 py-2 text-xs font-bold text-leak hover:bg-leak/10" onClick={remove} type="button">Delete</button>
            </div>
        </form>
    );
}

function MemberFields({ form }) {
    const setLocalized = (field, locale, value) => {
        form.setData(field, { ...form.data[field], [locale]: value });
    };

    return (
        <div className="mt-6 grid gap-5">
            <div className="grid gap-4 min-[700px]:grid-cols-2">
                <Field error={errorFor(form.errors, 'initials')} label="Initials">
                    <input className={inputClass} maxLength="6" onChange={(event) => form.setData('initials', event.target.value.toUpperCase())} placeholder="AB" required value={form.data.initials} />
                </Field>
                <Field error={errorFor(form.errors, 'position')} label="Display position">
                    <input className={inputClass} min="0" onChange={(event) => form.setData('position', Number(event.target.value))} required type="number" value={form.data.position} />
                </Field>
            </div>

            <div className="grid gap-4">
                {locales.map((locale) => (
                    <fieldset className="rounded-xl border border-border-soft bg-surface p-4" dir={locale.code === 'ar' ? 'rtl' : 'ltr'} key={locale.code}>
                        <legend className="px-2 font-['IBM_Plex_Mono'] text-[10px] font-bold tracking-[0.12em] text-copy-muted uppercase">{locale.label} content</legend>
                        <div className="grid gap-4">
                            <Field error={errorFor(form.errors, `name.${locale.code}`)} label="Name">
                                <input className={inputClass} onChange={(event) => setLocalized('name', locale.code, event.target.value)} required={locale.code === 'en'} value={form.data.name[locale.code]} />
                            </Field>
                            <Field error={errorFor(form.errors, `role.${locale.code}`)} label="Role">
                                <input className={inputClass} onChange={(event) => setLocalized('role', locale.code, event.target.value)} required={locale.code === 'en'} value={form.data.role[locale.code]} />
                            </Field>
                            <Field error={errorFor(form.errors, `bio.${locale.code}`)} label="Bio">
                                <textarea className={`${inputClass} min-h-24 resize-y`} maxLength="1000" onChange={(event) => setLocalized('bio', locale.code, event.target.value)} required={locale.code === 'en'} value={form.data.bio[locale.code]} />
                            </Field>
                            <Field error={errorFor(form.errors, `photo_label.${locale.code}`)} label="Photo placeholder label">
                                <input className={inputClass} maxLength="100" onChange={(event) => setLocalized('photo_label', locale.code, event.target.value)} placeholder="Add team photo" value={form.data.photo_label[locale.code]} />
                            </Field>
                        </div>
                    </fieldset>
                ))}
            </div>

            <Field error={errorFor(form.errors, 'photo')} label="Photo (optional)">
                <input accept="image/png,image/jpeg,image/webp" className={fileClass} onChange={(event) => form.setData('photo', event.target.files[0] ?? null)} type="file" />
                <span className="mt-1.5 block text-xs font-normal text-copy-muted">PNG, JPG or WEBP up to 5 MB. A portrait crop works best.</span>
            </Field>

            <div className="grid gap-4 min-[700px]:grid-cols-2">
                <Field error={errorFor(form.errors, 'linkedin_url')} label="LinkedIn URL">
                    <input className={inputClass} onChange={(event) => form.setData('linkedin_url', event.target.value)} placeholder="https://linkedin.com/in/..." type="url" value={form.data.linkedin_url} />
                </Field>
                <Field error={errorFor(form.errors, 'x_url')} label="X / Twitter URL">
                    <input className={inputClass} onChange={(event) => form.setData('x_url', event.target.value)} placeholder="https://x.com/..." type="url" value={form.data.x_url} />
                </Field>
                <Field error={errorFor(form.errors, 'website_url')} label="Website URL">
                    <input className={inputClass} onChange={(event) => form.setData('website_url', event.target.value)} placeholder="https://example.com" type="url" value={form.data.website_url} />
                </Field>
                <Toggle checked={form.data.is_active} label="Visible on the landing page" onChange={(checked) => form.setData('is_active', checked)} />
            </div>
        </div>
    );
}

function Avatar({ member }) {
    return member.photo_url ? (
        <img alt="" className="size-16 shrink-0 rounded-xl border border-border-soft object-cover" src={member.photo_url} />
    ) : (
        <span className="grid size-16 shrink-0 place-items-center rounded-xl border border-border-soft bg-surface font-[Archivo] text-xl font-black">{member.initials}</span>
    );
}

function EmptyState() {
    return (
        <div className="rounded-xl border border-dashed border-border-soft bg-surface-muted px-6 py-12 text-center">
            <p className="font-[Archivo] text-lg font-black">No team members yet</p>
            <p className="mt-1 text-sm text-copy-muted">Add the first member and they will appear in the public carousel.</p>
        </div>
    );
}

function Toggle({ checked, label, onChange }) {
    return (
        <label className="flex cursor-pointer items-center gap-2.5 self-end rounded-xl border border-border-soft bg-surface px-3.5 py-3 text-sm font-semibold">
            <input checked={checked} className="size-4 accent-[var(--color-marker)]" onChange={(event) => onChange(event.target.checked)} type="checkbox" />
            {label}
        </label>
    );
}

function Field({ children, error, label }) {
    return (
        <label className="block text-sm font-semibold">
            {label}
            {children}
            {error ? <span className="mt-1.5 block text-xs font-medium text-leak">{error}</span> : null}
        </label>
    );
}

function localized(value = '') {
    return { en: value, fr: '', ar: '' };
}

function normalizeLocalized(value) {
    return { en: value?.en ?? '', fr: value?.fr ?? '', ar: value?.ar ?? '' };
}

function errorFor(errors, path) {
    return errors[path] ?? path.split('.').reduce((value, key) => value?.[key], errors);
}

const inputClass = 'mt-2 w-full rounded-xl border border-border-soft bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-foreground focus:ring-2 focus:ring-marker';
const fileClass = 'mt-2 block w-full cursor-pointer rounded-xl border border-border-soft bg-surface text-xs text-copy-muted file:me-3 file:cursor-pointer file:border-0 file:bg-foreground file:px-3 file:py-2.5 file:font-bold file:text-page hover:file:bg-marker hover:file:text-marker-ink';
const primaryButtonClass = 'mt-6 w-full cursor-pointer rounded-xl bg-foreground px-5 py-3 font-[Archivo] text-sm font-bold text-page hover:bg-marker hover:text-marker-ink disabled:cursor-wait disabled:opacity-60';
