import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <nav aria-label="Pagination" className="flex flex-wrap gap-2 border-t border-border-soft px-5 py-4">
            {links.map((link, index) => link.url ? (
                <Link
                    aria-current={link.active ? 'page' : undefined}
                    className={`grid min-h-9 min-w-9 place-items-center rounded-lg border px-3 text-sm font-semibold no-underline ${link.active ? 'border-foreground bg-foreground text-page' : 'border-border-soft bg-surface text-foreground hover:bg-surface-muted'}`}
                    href={link.url}
                    key={index}
                    preserveScroll
                >
                    {formatLabel(link.label)}
                </Link>
            ) : (
                <span className="grid min-h-9 min-w-9 place-items-center rounded-lg border border-border-soft px-3 text-sm text-copy-faint opacity-60" key={index}>
                    {formatLabel(link.label)}
                </span>
            ))}
        </nav>
    );
}

function formatLabel(label) {
    return label.replace('&laquo;', '‹').replace('&raquo;', '›');
}
