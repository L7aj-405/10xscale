import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
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
    const form = useForm(appearance);
    const [previewMode, setPreviewMode] = useState('light');

    const submit = (event) => {
        event.preventDefault();
        form.put(appearanceRoutes.update, { preserveScroll: true });
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
                    <AppearancePreview data={form.data} mode={previewMode} setMode={setPreviewMode} />

                    <div className="flex flex-wrap gap-3 rounded-2xl border border-border-soft bg-surface p-4 shadow-sm">
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

function AppearancePreview({ data, mode, setMode }) {
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

            <div className="p-4" style={{ backgroundColor: page, color: text, fontFamily: fontStacks[data.body_font] }}>
                <div className="overflow-hidden rounded-xl border-2" style={{ borderColor: border }}>
                    <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: data.nav_background_color, color: data.nav_text_color }}>
                        <span className="font-black" style={{ fontFamily: fontStacks[data.display_font] }}>10XSCALE</span>
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
            </div>
        </section>
    );
}

function validPickerColor(value) {
    return /^#[0-9A-F]{6}$/i.test(value ?? '') ? value : '#000000';
}

const inputClass = 'mt-2 w-full rounded-xl border border-border-soft bg-surface-muted px-4 py-3 text-sm text-foreground outline-none focus:border-foreground focus:ring-2 focus:ring-marker';
