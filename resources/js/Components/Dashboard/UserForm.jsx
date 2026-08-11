import { Link, useForm } from '@inertiajs/react';

export default function UserForm({ managedUser = null, roles }) {
    const editing = Boolean(managedUser);
    const form = useForm({
        name: managedUser?.name ?? '',
        email: managedUser?.email ?? '',
        role: managedUser?.role ?? 'team',
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();
        const options = { preserveScroll: true };
        if (editing) form.put(`/dashboard/users/${managedUser.id}`, options);
        else form.post('/dashboard/users', options);
    };

    return (
        <form className="max-w-3xl rounded-2xl border border-border-soft bg-surface p-5 shadow-sm min-[700px]:p-8" onSubmit={submit}>
            <div className="grid gap-5 min-[700px]:grid-cols-2">
                <Field error={form.errors.name} label="Full name">
                    <input autoComplete="name" className={inputClass} onChange={(e) => form.setData('name', e.target.value)} required value={form.data.name} />
                </Field>
                <Field error={form.errors.email} label="Email address">
                    <input autoComplete="email" className={inputClass} onChange={(e) => form.setData('email', e.target.value)} required type="email" value={form.data.email} />
                </Field>
                <Field error={form.errors.role} label="Role">
                    <select className={inputClass} onChange={(e) => form.setData('role', e.target.value)} value={form.data.role}>
                        {roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
                    </select>
                </Field>
                <div className="hidden min-[700px]:block" />
                <Field error={form.errors.password} label={editing ? 'New password (optional)' : 'Password'}>
                    <input autoComplete="new-password" className={inputClass} onChange={(e) => form.setData('password', e.target.value)} required={!editing} type="password" value={form.data.password} />
                </Field>
                <Field error={form.errors.password_confirmation} label="Confirm password">
                    <input autoComplete="new-password" className={inputClass} onChange={(e) => form.setData('password_confirmation', e.target.value)} required={!editing || form.data.password !== ''} type="password" value={form.data.password_confirmation} />
                </Field>
            </div>
            <p className="mt-3 text-xs text-copy-muted">Passwords require at least 12 characters with uppercase, lowercase, a number and a symbol.</p>
            <div className="mt-8 flex flex-wrap gap-3 border-t border-border-soft pt-6">
                <button className="cursor-pointer rounded-xl bg-foreground px-5 py-3 font-[Archivo] text-sm font-bold text-page hover:bg-marker hover:text-marker-ink disabled:cursor-wait disabled:opacity-60" disabled={form.processing} type="submit">
                    {form.processing ? 'Saving…' : editing ? 'Save changes' : 'Create user'}
                </button>
                <Link className="rounded-xl border border-border-soft px-5 py-3 text-sm font-bold text-foreground no-underline hover:bg-surface-muted" href="/dashboard/users">Cancel</Link>
            </div>
        </form>
    );
}

const inputClass = 'mt-2 w-full rounded-xl border border-border-soft bg-surface-muted px-4 py-3 text-sm text-foreground outline-none focus:border-foreground focus:ring-2 focus:ring-marker';

function Field({ children, error, label }) {
    return (
        <label className="block text-sm font-semibold">
            {label}
            {children}
            {error ? <span className="mt-1.5 block text-xs font-medium text-leak">{error}</span> : null}
        </label>
    );
}
