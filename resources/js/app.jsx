import '../css/app.css';
import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from './i18n/I18nContext';
import { applySiteAppearance } from './siteAppearance';

createInertiaApp({
    title: (title) => (title ? `${title} · 10Xscale` : '10Xscale'),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });

        return pages[`./pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        applySiteAppearance(props.initialPage.props.siteAppearance);
        router.on('navigate', (event) => {
            applySiteAppearance(event.detail.page.props.siteAppearance);
        });

        createRoot(el).render(
            <I18nProvider>
                <App {...props} />
            </I18nProvider>,
        );
    },
    progress: {
        color: '#FFE81A',
    },
});
