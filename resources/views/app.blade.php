<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', '10Xscale') }}</title>

        <script>
            (() => {
                try {
                    const savedTheme = localStorage.getItem('10xscale-theme');
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

                    document.documentElement.classList.toggle('dark', isDark);
                    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
                } catch (_) {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                }
            })();
        </script>

        <script>
            (() => {
                try {
                    const supportedLocales = ['en', 'fr', 'ar'];
                    const savedLocale = localStorage.getItem('10xscale-locale');
                    const locale = supportedLocales.includes(savedLocale) ? savedLocale : 'en';

                    document.documentElement.lang = locale;
                    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
                } catch (_) {
                    document.documentElement.lang = 'en';
                    document.documentElement.dir = 'ltr';
                }
            })();
        </script>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,500..900&family=IBM+Plex+Mono:wght@400;500;600&family=Instrument+Sans:wght@400;500;600&family=Inter:wght@400;500;600;700;800;900&family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Arabic:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
        @viteReactRefresh
        @vite('resources/js/app.jsx')
        @inertiaHead
    </head>
    <body>
        @inertia
    </body>
</html>
