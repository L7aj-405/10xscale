import { usePage } from '@inertiajs/react';

export default function BrandLogo({ className = '' }) {
    const appearance = usePage().props.siteAppearance ?? {};
    const lightLogo = appearance.light_logo_url ?? appearance.dark_logo_url;
    const darkLogo = appearance.dark_logo_url ?? appearance.light_logo_url;

    if (lightLogo || darkLogo) {
        return (
            <>
                <img alt="" aria-hidden="true" className={`object-contain dark:hidden ${className}`} src={lightLogo ?? darkLogo} />
                <img alt="" aria-hidden="true" className={`hidden object-contain dark:block ${className}`} src={darkLogo ?? lightLogo} />
            </>
        );
    }

    return (
        <svg
            aria-hidden="true"
            className={className}
            viewBox="0 0 509 275"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g fill="currentColor">
                <text
                    x="-5"
                    y="143"
                    fontFamily="Archivo, sans-serif"
                    fontSize="176"
                    fontWeight="900"
                    letterSpacing="-16"
                >
                    10
                </text>
                <path d="M225 25 324 124 428 20l25 25-129 129L200 50z" />
                <path d="m398 15 59-15-15 59z" />
                <text
                    x="0"
                    y="272"
                    fontFamily="Archivo, sans-serif"
                    fontSize="150"
                    fontWeight="900"
                    letterSpacing="-10"
                >
                    SCALE
                </text>
            </g>
        </svg>
    );
}
