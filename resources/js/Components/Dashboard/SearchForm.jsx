import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function SearchForm({ initialValue = '', url }) {
    const [search, setSearch] = useState(initialValue);

    const submit = (event) => {
        event.preventDefault();
        router.get(url, search ? { search } : {}, { preserveState: true, replace: true });
    };

    return (
        <form className="flex w-full max-w-md gap-2" onSubmit={submit} role="search">
            <label className="sr-only" htmlFor={`search-${url}`}>Search</label>
            <input
                className="min-w-0 flex-1 rounded-xl border border-border-soft bg-surface px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-copy-faint focus:border-foreground focus:ring-2 focus:ring-marker"
                id={`search-${url}`}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email or website…"
                value={search}
            />
            <button className="cursor-pointer rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-page hover:bg-marker hover:text-marker-ink" type="submit">Search</button>
        </form>
    );
}
