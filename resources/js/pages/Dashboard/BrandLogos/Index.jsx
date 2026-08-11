import { router, useForm } from '@inertiajs/react';
import DashboardLayout from '../../../Components/Dashboard/DashboardLayout';
import PageHeader from '../../../Components/Dashboard/PageHeader';

export default function Index({ brandLogos, storeUrl }) {
    return (
        <DashboardLayout title="Brand logos">
            <PageHeader
                description="Upload and arrange the customer or partner logos displayed in the landing-page carousel."
                eyebrow="Admin only"
                title="Brand logo carousel"
            />

            <div className="grid items-start gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
                <UploadForm storeUrl={storeUrl} />

                <section className="rounded-2xl border border-border-soft bg-surface p-5 shadow-sm min-[700px]:p-7">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="font-[Archivo] text-xl font-black">Carousel logos</h2>
                            <p className="mt-1 text-sm text-copy-muted">Lower position numbers appear first. Inactive logos stay saved but are hidden publicly.</p>
                        </div>
                        <p className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-bold text-copy-muted">{brandLogos.length} logos</p>
                    </div>

                    <div className="mt-6 grid gap-4">
                        {brandLogos.map((brandLogo) => <BrandLogoEditor brandLogo={brandLogo} key={brandLogo.id} />)}
                        {!brandLogos.length ? (
                            <div className="rounded-xl border border-dashed border-border-soft bg-surface-muted px-6 py-12 text-center">
                                <p className="font-[Archivo] text-lg font-black">No brand logos yet</p>
                                <p className="mt-1 text-sm text-copy-muted">Upload the first logo and it will replace the carousel placeholders.</p>
                            </div>
                        ) : null}
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}

function UploadForm({ storeUrl }) {
    const form = useForm({
        name: '',
        image: null,
        website_url: '',
        position: 0,
        is_active: true,
    });

    const submit = (event) => {
        event.preventDefault();
        form.post(storeUrl, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <form className="rounded-2xl border border-border-soft bg-surface p-5 shadow-sm xl:sticky xl:top-[104px]" encType="multipart/form-data" onSubmit={submit}>
            <h2 className="font-[Archivo] text-xl font-black">Add a logo</h2>
            <p className="mt-1 text-sm text-copy-muted">PNG, JPG or WEBP up to 4 MB. Transparent PNG or WEBP usually looks best.</p>

            <div className="mt-6 grid gap-4">
                <Field error={form.errors.name} label="Brand name">
                    <input className={inputClass} maxLength="100" name="name" onChange={(event) => form.setData('name', event.target.value)} placeholder="Example Brand" required value={form.data.name} />
                </Field>
                <Field error={form.errors.image} label="Logo image">
                    <input accept="image/png,image/jpeg,image/webp" className={fileClass} name="image" onChange={(event) => form.setData('image', event.target.files[0] ?? null)} required type="file" />
                </Field>
                <Field error={form.errors.website_url} label="Website link (optional)">
                    <input className={inputClass} name="website_url" onChange={(event) => form.setData('website_url', event.target.value)} placeholder="https://brand.com" type="url" value={form.data.website_url} />
                </Field>
                <Field error={form.errors.position} label="Display position">
                    <input className={inputClass} min="0" name="position" onChange={(event) => form.setData('position', Number(event.target.value))} required type="number" value={form.data.position} />
                </Field>
                <Toggle checked={form.data.is_active} label="Visible in carousel" onChange={(checked) => form.setData('is_active', checked)} />
            </div>

            <button className="mt-6 w-full cursor-pointer rounded-xl bg-foreground px-5 py-3 font-[Archivo] text-sm font-bold text-page hover:bg-marker hover:text-marker-ink disabled:cursor-wait disabled:opacity-60" disabled={form.processing} type="submit">
                {form.processing ? 'Uploading…' : 'Add logo'}
            </button>
        </form>
    );
}

function BrandLogoEditor({ brandLogo }) {
    const form = useForm({
        name: brandLogo.name,
        image: null,
        website_url: brandLogo.website_url ?? '',
        position: brandLogo.position,
        is_active: brandLogo.is_active,
    });

    const submit = (event) => {
        event.preventDefault();
        form
            .transform((data) => ({ ...data, _method: 'put' }))
            .post(brandLogo.update_url, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => form.reset('image'),
            });
    };

    const remove = () => {
        if (window.confirm(`Delete ${brandLogo.name} from the carousel?`)) {
            router.delete(brandLogo.delete_url, { preserveScroll: true });
        }
    };

    return (
        <form className="grid gap-5 rounded-xl border border-border-soft bg-surface-muted p-4 min-[760px]:grid-cols-[180px_minmax(0,1fr)]" encType="multipart/form-data" onSubmit={submit}>
            <div className="flex h-[110px] items-center justify-center rounded-xl border border-border-soft bg-white p-5">
                <img alt={brandLogo.name} className="max-h-full max-w-full object-contain" src={brandLogo.image_url} />
            </div>
            <div>
                <div className="grid gap-4 min-[760px]:grid-cols-2">
                    <Field error={form.errors.name} label="Brand name">
                        <input className={inputClass} maxLength="100" name="name" onChange={(event) => form.setData('name', event.target.value)} required value={form.data.name} />
                    </Field>
                    <Field error={form.errors.position} label="Position">
                        <input className={inputClass} min="0" name="position" onChange={(event) => form.setData('position', Number(event.target.value))} required type="number" value={form.data.position} />
                    </Field>
                    <Field error={form.errors.website_url} label="Website link">
                        <input className={inputClass} name="website_url" onChange={(event) => form.setData('website_url', event.target.value)} placeholder="https://brand.com" type="url" value={form.data.website_url} />
                    </Field>
                    <Field error={form.errors.image} label="Replace image (optional)">
                        <input accept="image/png,image/jpeg,image/webp" className={fileClass} name="image" onChange={(event) => form.setData('image', event.target.files[0] ?? null)} type="file" />
                    </Field>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-soft pt-4">
                    <Toggle checked={form.data.is_active} label="Visible" onChange={(checked) => form.setData('is_active', checked)} />
                    <div className="flex gap-2">
                        <button className="cursor-pointer rounded-lg bg-foreground px-4 py-2 text-xs font-bold text-page hover:bg-marker hover:text-marker-ink disabled:cursor-wait disabled:opacity-60" disabled={form.processing || !form.isDirty} type="submit">Save</button>
                        <button className="cursor-pointer rounded-lg border border-leak/30 px-4 py-2 text-xs font-bold text-leak hover:bg-leak/10" onClick={remove} type="button">Delete</button>
                    </div>
                </div>
            </div>
        </form>
    );
}

function Toggle({ checked, label, onChange }) {
    return (
        <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
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

const inputClass = 'mt-2 w-full rounded-xl border border-border-soft bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-foreground focus:ring-2 focus:ring-marker';
const fileClass = 'mt-2 block w-full cursor-pointer rounded-xl border border-border-soft bg-surface text-xs text-copy-muted file:me-3 file:cursor-pointer file:border-0 file:bg-foreground file:px-3 file:py-2.5 file:font-bold file:text-page hover:file:bg-marker hover:file:text-marker-ink';
