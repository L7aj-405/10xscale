import { Link, router, usePage } from '@inertiajs/react';
import DashboardLayout from '../../../Components/Dashboard/DashboardLayout';
import PageHeader from '../../../Components/Dashboard/PageHeader';
import Pagination from '../../../Components/Dashboard/Pagination';
import SearchForm from '../../../Components/Dashboard/SearchForm';

export default function Index({ filters, users }) {
    const currentUser = usePage().props.auth.user;

    const removeUser = (user) => {
        if (window.confirm(`Delete ${user.name}? This action cannot be undone.`)) {
            router.delete(`/dashboard/users/${user.id}`, { preserveScroll: true });
        }
    };

    return (
        <DashboardLayout title="Users">
            <PageHeader
                actions={<Link className="inline-block rounded-xl bg-foreground px-5 py-3 font-[Archivo] text-sm font-bold text-page no-underline hover:bg-marker hover:text-marker-ink" href="/dashboard/users/create">Add user</Link>}
                description="Create and manage the Admin and Team accounts that can access this workspace."
                eyebrow="Admin only"
                title="User management"
            />
            <div className="mb-5 flex items-center justify-between gap-4">
                <SearchForm initialValue={filters.search} url="/dashboard/users" />
                <p className="hidden text-sm text-copy-muted min-[760px]:block">{users.total.toLocaleString()} users</p>
            </div>
            <section className="overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                        <thead className="bg-surface-muted font-['IBM_Plex_Mono'] text-[10px] tracking-[0.08em] text-copy-muted uppercase">
                            <tr><th className="px-6 py-3">User</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Added</th><th className="px-6 py-3 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {users.data.map((user) => (
                                <tr className="hover:bg-surface-muted/60" key={user.id}>
                                    <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-foreground font-[Archivo] text-xs font-black text-page">{initials(user.name)}</span><div><p className="font-semibold">{user.name}{user.id === currentUser.id ? <span className="ms-2 rounded bg-marker px-1.5 py-0.5 text-[10px] font-bold text-marker-ink">You</span> : null}</p><p className="text-xs text-copy-muted">{user.email}</p></div></div></td>
                                    <td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${user.role === 'admin' ? 'bg-marker text-marker-ink' : 'bg-surface-muted text-copy'}`}>{user.role}</span></td>
                                    <td className="px-6 py-4 text-copy-muted">{formatDate(user.created_at)}</td>
                                    <td className="px-6 py-4"><div className="flex justify-end gap-2"><Link className="rounded-lg border border-border-soft px-3 py-2 text-xs font-bold text-foreground no-underline hover:bg-surface-muted" href={`/dashboard/users/${user.id}/edit`}>Edit</Link><button className="cursor-pointer rounded-lg border border-leak/30 px-3 py-2 text-xs font-bold text-leak hover:bg-leak/10 disabled:cursor-not-allowed disabled:opacity-40" disabled={user.id === currentUser.id} onClick={() => removeUser(user)} type="button">Delete</button></div></td>
                                </tr>
                            ))}
                            {!users.data.length ? <tr><td className="px-6 py-12 text-center text-copy-muted" colSpan="4">No matching users found.</td></tr> : null}
                        </tbody>
                    </table>
                </div>
                <Pagination links={users.links} />
            </section>
        </DashboardLayout>
    );
}

function initials(name) { return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase(); }
function formatDate(value) { return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value)); }
