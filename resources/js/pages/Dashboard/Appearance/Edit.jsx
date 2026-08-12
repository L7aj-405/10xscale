import { router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../../Components/Dashboard/DashboardLayout';
import PageHeader from '../../../Components/Dashboard/PageHeader';
import { fontStacks } from '../../../siteAppearance';

const lightFields = [
    ['light_page_color', 'Page background'],
    ['light_surface_color', 'Cards and surfaces'],
    ['light_muted_color', 'Muted sections'],
    ['light_text_color', 'Primary text'],
    ['light_border_color', 'Borders'],
];

const darkFields = [
    ['dark_page_color', 'Page background'],
    ['dark_surface_color', 'Cards and surfaces'],
    ['dark_muted_color', 'Muted sections'],
    ['dark_text_color', 'Primary text'],
    ['dark_border_color', 'Borders'],
];

const brandFields = [
    ['accent_color', 'Accent / marker'],
    ['accent_text_color', 'Text on accent'],
    ['danger_color', 'Errors and warnings'],
];

const navigationFields = [
    ['nav_background_color', 'Navigation background'],
    ['nav_panel_color', 'Navigation panels'],
    ['nav_text_color', 'Navigation text'],
];

export default function Edit({ appearance, appearanceRoutes, fontOptions }) {
    const form = useForm({
        ...appearance,
        _method: 'put',
        light_logo: null,
        dark_logo: null,
    });
    const [previewMode, setPreviewMode] = useState('light');
    const lightUploadPreview = useObjectUrl(form.data.light_logo);
    const darkUploadPreview = useObjectUrl(form.data.dark_logo);
    const savedLightLogo = appearance.has_light_logo ? appearance.light_logo_url : null;
    const savedDarkLogo = appearance.has_dark_logo ? appearance.dark_logo_url : null;
    const rawLightLogo = lightUploadPreview ?? savedLightLogo;
    const rawDarkLogo = darkUploadPreview ?? savedDarkLogo;
    const logoPreviews = {
        light: rawLightLogo ?? rawDarkLogo,
        dark: rawDarkLogo ?? rawLightLogo,
    };

    const submit = (event) => {
        event.preventDefault();
        form.post(appearanceRoutes.update, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => form.reset('light_logo', 'dark_logo'),
        });
    };

    const setLogo = (name, file) => {
        form.clearErrors(name);

        if (file && file.size > 5 * 1024 * 1024) {
            form.setData(name, null);
            form.setError(name, 'The logo must be no larger than 5 MB.');
            return;
        }

        form.setData(name, file);
    };

    const reset = () => {
        if (window.confirm('Restore every appearance setting to the original 10Xscale design?')) {
            router.delete(appearanceRoutes.reset, { preserveScroll: true });
        }
    };

    return (
        <DashboardLayout title="Site appearance">
            <PageHeader
                eyebrow="Brand controls"
                title="Site appearance"
                description="Change the shared colors and typography used across the public website, authentication pages and dashboard."
            />

            <form className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_430px]" onSubmit={submit}>
                <div className="grid gap-6">
                    <SettingsSection description="Upload a logo for each color mode. PNG, JPEG and WebP files up to 5 MB are supported. If one mode is empty, the other logo is used automatically." title="Website logos">
                        <div className="grid gap-5 min-[700px]:grid-cols-2">
                            <LogoUploadField
                                error={form.errors.light_logo}
                                fallback={!lightUploadPreview && !appearance.has_light_logo && appearance.has_dark_logo}
                                label="Light mode logo"
                                name="light_logo"
                                onChange={(file) => setLogo('light_logo', file)}
                                preview={lightUploadPreview ?? appearance.light_logo_url}
                            />
                            <LogoUploadField
                                error={form.errors.dark_logo}
                                fallback={!darkUploadPreview && !appearance.has_dark_logo && appearance.has_light_logo}
                                label="Dark mode logo"
                                name="dark_logo"
                                onChange={(file) => setLogo('dark_logo', file)}
                                preview={darkUploadPreview ?? appearance.dark_logo_url}
                                previewDark
                            />
                        </div>
                        <div className="mt-7 grid gap-5 border-t border-border-soft pt-6 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-3">
                            <LogoSizeControl
                                error={form.errors.logo_height_mobile}
                                label="Mobile logo height"
                                max={100}
                                min={20}
                                name="logo_height_mobile"
                                onChange={(value) => form.setData('logo_height_mobile', value)}
                                value={form.data.logo_height_mobile}
                            />
                            <LogoSizeControl
                                error={form.errors.logo_height_desktop}
                                label="Desktop logo height"
                                max={160}
                                min={24}
                                name="logo_height_desktop"
                                onChange={(value) => form.setData('logo_height_desktop', value)}
                                value={form.data.logo_height_desktop}
                            />
                            <LogoSizeControl
                                error={form.errors.logo_height_admin}
                                label="Admin sidebar logo height"
                                max={120}
                                min={24}
                                name="logo_height_admin"
                                onChange={(value) => form.setData('logo_height_admin', value)}
                                value={form.data.logo_height_admin}
                            />
                        </div>
                    </SettingsSection>

                    <SettingsSection description="The highlight, contrast and validation colors used across both themes." title="Brand colors">
                        <ColorGrid fields={brandFields} form={form} />
                    </SettingsSection>

                    <SettingsSection description="Background, card, text and border colors when light mode is active." title="Light theme">
                        <ColorGrid fields={lightFields} form={form} />
                    </SettingsSection>

                    <SettingsSection description="Background, card, text and border colors when dark mode is active." title="Dark theme">
                        <ColorGrid fields={darkFields} form={form} />
                    </SettingsSection>

                    <SettingsSection description="Colors shared by the main navigation, dashboard sidebar and footer." title="Navigation and footer">
                        <ColorGrid fields={navigationFields} form={form} />
                    </SettingsSection>

                    <SettingsSection description="Choose from the font families already optimized and loaded by the site." title="Typography">
                        <div className="grid gap-5 min-[700px]:grid-cols-2">
                            <SelectField error={form.errors.body_font} label="Body font">
                                <select className={inputClass} onChange={(event) => form.setData('body_font', event.target.value)} value={form.data.body_font}>
                                    {fontOptions.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}
                                </select>
                            </SelectField>
                            <SelectField error={form.errors.display_font} label="Headings and buttons">
                                <select className={inputClass} onChange={(event) => form.setData('display_font', event.target.value)} value={form.data.display_font}>
                                    {fontOptions.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}
                                </select>
                            </SelectField>
                        </div>
                    </SettingsSection>
                </div>

                <div className="grid gap-4 xl:sticky xl:top-[104px]">
                    <AppearancePreview data={form.data} logoPreviews={logoPreviews} mode={previewMode} setMode={setPreviewMode} />

                    <div className="flex flex-wrap gap-3 rounded-2xl border border-border-soft bg-surface p-4 shadow-sm">
                        {form.hasErrors ? (
                            <div className="w-full rounded-xl border border-leak/40 bg-leak/10 px-4 py-3 text-sm font-semibold text-leak" role="alert">
                                The appearance could not be saved. Review the highlighted field errors and try again.
                            </div>
                        ) : null}
                        <button className="cursor-pointer rounded-xl bg-foreground px-5 py-3 font-[Archivo] text-sm font-bold text-page hover:bg-marker hover:text-marker-ink disabled:cursor-wait disabled:opacity-60" disabled={form.processing} type="submit">
                            {form.processing ? 'Saving…' : 'Save appearance'}
                        </button>
                        <button className="cursor-pointer rounded-xl border border-border-soft px-5 py-3 text-sm font-bold text-foreground hover:bg-surface-muted" onClick={reset} type="button">
                            Restore defaults
                        </button>
                        {form.isDirty ? <p className="w-full text-xs font-medium text-copy-muted">You have unsaved appearance changes.</p> : null}
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}

function SettingsSection({ children, description, title }) {
    return (
        <section className="rounded-2xl border border-border-soft bg-surface p-5 shadow-sm min-[700px]:p-7">
            <h2 className="font-[Archivo] text-xl font-black">{title}</h2>
            <p className="mt-1 text-sm text-copy-muted">{description}</p>
            <div className="mt-6">{children}</div>
        </section>
    );
}

function ColorGrid({ fields, form }) {
    return (
        <div className="grid gap-4 min-[700px]:grid-cols-2">
            {fields.map(([name, label]) => (
                <ColorField error={form.errors[name]} key={name} label={label} name={name} onChange={(value) => form.setData(name, value)} value={form.data[name]} />
            ))}
        </div>
    );
}

function ColorField({ error, label, name, onChange, value }) {
    return (
        <label className="block text-sm font-semibold" htmlFor={name}>
            {label}
            <span className="mt-2 flex overflow-hidden rounded-xl border border-border-soft bg-surface-muted focus-within:border-foreground focus-within:ring-2 focus-within:ring-marker">
                <input aria-label={`${label} color picker`} className="h-11 w-14 shrink-0 cursor-pointer border-0 bg-transparent p-1" onChange={(event) => onChange(event.target.value.toUpperCase())} type="color" value={validPickerColor(value)} />
                <input className="min-w-0 flex-1 border-0 bg-transparent px-3 font-['IBM_Plex_Mono'] text-sm font-semibold uppercase outline-none" id={name} maxLength="7" name={name} onChange={(event) => onChange(event.target.value.toUpperCase())} pattern="#[0-9A-Fa-f]{6}" required value={value} />
            </span>
            {error ? <span className="mt-1.5 block text-xs font-medium text-leak">{error}</span> : null}
        </label>
    );
}

function SelectField({ children, error, label }) {
    return (
        <label className="block text-sm font-semibold">
            {label}
            {children}
            {error ? <span className="mt-1.5 block text-xs font-medium text-leak">{error}</span> : null}
        </label>
    );
}

function LogoUploadField({ error, fallback, label, name, onChange, preview, previewDark = false }) {
    return (
        <div>
            <label className="block text-sm font-semibold" htmlFor={name}>{label}</label>
            <div className={`mt-2 grid min-h-40 place-items-center rounded-xl border border-dashed border-border-soft p-5 ${previewDark ? 'bg-[#111113]' : 'bg-[#f5f4ef]'}`}>
                {preview ? (
                    <img alt={`${label} preview`} className="max-h-24 max-w-full object-contain" src={preview} />
                ) : (
                    <span className={`text-center text-xs font-semibold ${previewDark ? 'text-white/60' : 'text-black/50'}`}>The built-in 10Xscale logo is currently in use.</span>
                )}
            </div>
            <label className="mt-3 flex cursor-pointer items-center justify-center rounded-xl border border-border-soft bg-surface-muted px-4 py-3 text-sm font-bold hover:bg-marker hover:text-marker-ink" htmlFor={name}>
                {preview && !fallback ? 'Replace logo' : 'Upload logo'}
            </label>
            <input accept="image/png,image/jpeg,image/webp" className="sr-only" id={name} name={name} onChange={(event) => onChange(event.target.files?.[0] ?? null)} type="file" />
            {fallback ? <p className="mt-2 text-xs text-copy-muted">Currently using the other mode's logo as a fallback.</p> : null}
            {error ? <p className="mt-2 text-xs font-medium text-leak">{error}</p> : null}
        </div>
    );
}

function LogoSizeControl({ error, label, max, min, name, onChange, value }) {
    const numericValue = Number(value) || min;

    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-semibold" htmlFor={`${name}-range`}>{label}</label>
                <div className="flex items-center gap-1 rounded-lg border border-border-soft bg-surface-muted px-2">
                    <input
                        aria-label={`${label} in pixels`}
                        className="w-12 bg-transparent py-1.5 text-right font-['IBM_Plex_Mono'] text-sm font-semibold outline-none"
                        max={max}
                        min={min}
                        onChange={(event) => onChange(event.target.value)}
                        type="number"
                        value={value}
                    />
                    <span className="text-xs text-copy-muted">px</span>
                </div>
            </div>
            <input
                className="mt-3 w-full cursor-pointer accent-[var(--color-marker)]"
                id={`${name}-range`}
                max={max}
                min={min}
                onChange={(event) => onChange(Number(event.target.value))}
                type="range"
                value={numericValue}
            />
            <div className="mt-1 flex justify-between font-['IBM_Plex_Mono'] text-[10px] text-copy-muted">
                <span>{min}px</span>
                <span>{max}px</span>
            </div>
            {error ? <p className="mt-2 text-xs font-medium text-leak">{error}</p> : null}
        </div>
    );
}

function AppearancePreview({ data, logoPreviews, mode, setMode }) {
    const dark = mode === 'dark';
    const page = dark ? data.dark_page_color : data.light_page_color;
    const surface = dark ? data.dark_surface_color : data.light_surface_color;
    const muted = dark ? data.dark_muted_color : data.light_muted_color;
    const text = dark ? data.dark_text_color : data.light_text_color;
    const border = dark ? data.dark_border_color : data.light_border_color;

    return (
        <section className="overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-sm">
            <div className="flex items-center justify-between border-b border-border-soft px-4 py-3">
                <div>
                    <h2 className="font-[Archivo] text-sm font-black">Live preview</h2>
                    <p className="text-xs text-copy-muted">Changes preview before saving.</p>
                </div>
                <div className="flex rounded-lg bg-surface-muted p-1 text-xs font-bold">
                    {['light', 'dark'].map((value) => <button className={`cursor-pointer rounded-md px-3 py-1.5 capitalize ${mode === value ? 'bg-surface text-foreground shadow-sm' : 'text-copy-muted'}`} key={value} onClick={() => setMode(value)} type="button">{value}</button>)}
                </div>
            </div>

            <div
                className="p-4"
                style={{
                    '--site-font-display': fontStacks[data.display_font],
                    '--site-font-sans': fontStacks[data.body_font],
                    backgroundColor: page,
                    color: text,
                    fontFamily: 'var(--site-font-sans)',
                }}
            >
                <div className="overflow-hidden rounded-xl border-2" style={{ borderColor: border }}>
                    <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: data.nav_background_color, color: data.nav_text_color }}>
                        {logoPreviews[mode] ? (
                            <img
                                alt="Website logo preview"
                                className="w-auto max-w-44 object-contain"
                                src={logoPreviews[mode]}
                                style={{ height: `${data.logo_height_desktop}px` }}
                            />
                        ) : (
                            <span className="font-black" style={{ fontFamily: fontStacks[data.display_font], fontSize: `${Math.max(14, Number(data.logo_height_desktop) * 0.42)}px` }}>10XSCALE</span>
                        )}
                        <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: data.accent_color, color: data.accent_text_color }}>Free audit</span>
                    </div>
                    <div className="p-5" style={{ backgroundColor: muted }}>
                        <p className="text-[10px] font-bold tracking-[0.13em] uppercase" style={{ color: data.accent_color }}>Retention growth</p>
                        <h3 className="mt-2 text-3xl leading-[1.05] font-black" style={{ fontFamily: fontStacks[data.display_font] }}>Own your revenue.</h3>
                        <p className="mt-3 text-sm leading-relaxed opacity-75">A preview of headings, body copy, cards, borders and calls to action.</p>
                        <div className="mt-4 rounded-xl border p-4" style={{ backgroundColor: surface, borderColor: border }}>
                            <p className="font-bold" style={{ fontFamily: fontStacks[data.display_font] }}>Your retention system</p>
                            <p className="mt-1 text-xs opacity-70">Consistent across every page and both themes.</p>
                        </div>
                        <button className="mt-4 rounded-full px-5 py-2.5 text-sm font-black" style={{ backgroundColor: data.accent_color, color: data.accent_text_color, fontFamily: fontStacks[data.display_font] }} type="button">Get started</button>
                    </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border-2" style={{ borderColor: border }}>
                    <div className="px-4 py-2 font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ backgroundColor: surface }}>Admin sidebar</div>
                    <div className="flex items-center px-5 py-3" style={{ backgroundColor: data.nav_background_color, color: data.nav_text_color, minHeight: `${Math.max(64, Number(data.logo_height_admin) + 20)}px` }}>
                        {logoPreviews[mode] ? (
                            <img
                                alt="Admin sidebar logo preview"
                                className="w-auto max-w-[220px] object-contain"
                                src={logoPreviews[mode]}
                                style={{ height: `${data.logo_height_admin}px` }}
                            />
                        ) : (
                            <span className="font-black" style={{ fontFamily: fontStacks[data.display_font], fontSize: `${Math.max(14, Number(data.logo_height_admin) * 0.42)}px` }}>10XSCALE</span>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function useObjectUrl(file) {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (!(file instanceof File)) {
            setUrl(null);
            return undefined;
        }

        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return url;
}

function validPickerColor(value) {
    return /^#[0-9A-F]{6}$/i.test(value ?? '') ? value : '#000000';
}

const inputClass = 'mt-2 w-full rounded-xl border border-border-soft bg-surface-muted px-4 py-3 text-sm text-foreground outline-none focus:border-foreground focus:ring-2 focus:ring-marker';
