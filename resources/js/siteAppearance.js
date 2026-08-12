const variableMap = {
    accent_color: '--site-accent-color',
    accent_text_color: '--site-accent-text-color',
    danger_color: '--site-danger-color',
    light_page_color: '--site-light-page-color',
    light_surface_color: '--site-light-surface-color',
    light_muted_color: '--site-light-muted-color',
    light_text_color: '--site-light-text-color',
    light_border_color: '--site-light-border-color',
    dark_page_color: '--site-dark-page-color',
    dark_surface_color: '--site-dark-surface-color',
    dark_muted_color: '--site-dark-muted-color',
    dark_text_color: '--site-dark-text-color',
    dark_border_color: '--site-dark-border-color',
    nav_background_color: '--site-nav-background-color',
    nav_panel_color: '--site-nav-panel-color',
    nav_text_color: '--site-nav-text-color',
};

export const fontStacks = {
    'instrument-sans': "'Instrument Sans', 'Noto Sans Arabic', ui-sans-serif, system-ui, sans-serif",
    archivo: "'Archivo', 'Noto Sans Arabic', ui-sans-serif, system-ui, sans-serif",
    inter: "'Inter', 'Noto Sans Arabic', ui-sans-serif, system-ui, sans-serif",
    manrope: "'Manrope', 'Noto Sans Arabic', ui-sans-serif, system-ui, sans-serif",
    'space-grotesk': "'Space Grotesk', 'Noto Sans Arabic', ui-sans-serif, system-ui, sans-serif",
};

export function applySiteAppearance(appearance = {}) {
    const root = document.documentElement;

    Object.entries(variableMap).forEach(([setting, variable]) => {
        const value = appearance[setting];

        if (/^#[0-9A-F]{6}$/i.test(value ?? '')) {
            root.style.setProperty(variable, value);
        }
    });

    if (fontStacks[appearance.body_font]) {
        root.style.setProperty('--site-font-sans', fontStacks[appearance.body_font]);
    }

    if (fontStacks[appearance.display_font]) {
        root.style.setProperty('--site-font-display', fontStacks[appearance.display_font]);
    }
}
