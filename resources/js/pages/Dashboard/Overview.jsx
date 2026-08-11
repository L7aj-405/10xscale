import { Link } from '@inertiajs/react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import PageHeader from '../../Components/Dashboard/PageHeader';

export default function Overview({ metrics, recentAuditRequests }) {
    return (
        <DashboardLayout title="Overview">
            <PageHeader eyebrow="Operations snapshot" title="Dashboard overview" description="A quick view of incoming audit demand and your team workspace." />
            <div className="grid gap-4 min-[560px]:grid-cols-2 min-[1200px]:grid-cols-4">
                <Metric label="Audit requests" value={metrics.audit_requests} />
                <Metric label="Received today" value={metrics.audit_requests_today} marker />
                <Metric label="Team users" value={metrics.users} />
                <Metric label="Administrators" value={metrics.admins} />
            </div>

            <section className="mt-8 overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-border-soft px-5 py-4 min-[700px]:px-6">
                    <div>
                        <h2 className="font-[Archivo] text-lg font-bold">Recent audit requests</h2>
                        <p className="mt-0.5 text-xs text-copy-muted">The five newest landing-page submissions.</p>
                    </div>
                    <Link className="rounded-lg border border-border-soft px-3 py-2 text-xs font-bold text-foreground no-underline hover:bg-surface-muted" href="/dashboard/audit-requests">View all</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                        <thead className="bg-surface-muted font-['IBM_Plex_Mono'] text-[10px] tracking-[0.08em] text-copy-muted uppercase">
                            <tr><th className="px-6 py-3">Contact</th><th className="px-6 py-3">Website</th><th className="px-6 py-3">Revenue</th><th className="px-6 py-3">Received</th></tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {recentAuditRequests.map((item) => (
                                <tr className="hover:bg-surface-muted/60" key={item.id}>
                                    <td className="px-6 py-4"><p className="font-semibold">{item.name}</p><p className="text-xs text-copy-muted">{item.email}</p></td>
                                    <td className="px-6 py-4"><a className="text-foreground underline decoration-marker decoration-2 underline-offset-4" href={item.website} rel="noreferrer" target="_blank">{host(item.website)}</a></td>
                                    <td className="px-6 py-4 font-semibold">{item.monthly_revenue}</td>
                                    <td className="px-6 py-4 text-copy-muted">{formatDate(item.created_at)}</td>
                                </tr>
                            ))}
                            {!recentAuditRequests.length ? <tr><td className="px-6 py-10 text-center text-copy-muted" colSpan="4">No audit requests yet.</td></tr> : null}
                        </tbody>
                    </table>
                </div>
            </section>
        </DashboardLayout>
    );
}

function Metric({ label, marker = false, value }) { return <div className={`rounded-2xl border border-border-soft p-5 shadow-sm ${marker ? 'bg-marker text-marker-ink' : 'bg-surface'}`}><p className={`font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.1em] uppercase ${marker ? 'text-marker-ink/70' : 'text-copy-muted'}`}>{label}</p><p className="mt-3 font-[Archivo] text-4xl font-black">{value.toLocaleString()}</p></div>; }
function formatDate(value) { return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
function host(value) { try { return new URL(value).hostname; } catch { return value; } }
