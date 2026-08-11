import DashboardLayout from '../../../Components/Dashboard/DashboardLayout';
import PageHeader from '../../../Components/Dashboard/PageHeader';
import Pagination from '../../../Components/Dashboard/Pagination';
import SearchForm from '../../../Components/Dashboard/SearchForm';

export default function Index({ auditRequests, filters }) {
    return (
        <DashboardLayout title="Audit requests">
            <PageHeader eyebrow="Landing-page leads" title="Audit requests" description="Review every qualification form submitted through the public landing page." />
            <div className="mb-5 flex items-center justify-between gap-4">
                <SearchForm initialValue={filters.search} url="/dashboard/audit-requests" />
                <p className="hidden text-sm text-copy-muted min-[760px]:block">{auditRequests.total.toLocaleString()} total</p>
            </div>
            <section className="overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
                        <thead className="bg-surface-muted font-['IBM_Plex_Mono'] text-[10px] tracking-[0.08em] text-copy-muted uppercase">
                            <tr><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">Website</th><th className="px-5 py-3">Store revenue</th><th className="px-5 py-3">List size</th><th className="px-5 py-3">Email share</th><th className="px-5 py-3">Received</th></tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {auditRequests.data.map((item) => (
                                <tr className="align-top hover:bg-surface-muted/60" key={item.id}>
                                    <td className="px-5 py-4"><p className="font-semibold">{item.name}</p><a className="mt-1 block text-xs text-copy-muted hover:text-foreground" href={`mailto:${item.email}`}>{item.email}</a></td>
                                    <td className="px-5 py-4 whitespace-nowrap"><a className="text-foreground no-underline hover:underline" href={`tel:${item.country_code}${item.phone}`}>{item.country_code} {item.phone}</a></td>
                                    <td className="max-w-[190px] px-5 py-4"><a className="block truncate text-foreground underline decoration-marker decoration-2 underline-offset-4" href={item.website} rel="noreferrer" target="_blank">{host(item.website)}</a></td>
                                    <td className="px-5 py-4 font-semibold whitespace-nowrap">{item.monthly_revenue}</td>
                                    <td className="px-5 py-4 whitespace-nowrap">{item.list_size}</td>
                                    <td className="px-5 py-4 whitespace-nowrap">{item.email_revenue_pct}</td>
                                    <td className="px-5 py-4 whitespace-nowrap text-copy-muted">{formatDate(item.created_at)}</td>
                                </tr>
                            ))}
                            {!auditRequests.data.length ? <tr><td className="px-5 py-12 text-center text-copy-muted" colSpan="7">No matching audit requests found.</td></tr> : null}
                        </tbody>
                    </table>
                </div>
                <Pagination links={auditRequests.links} />
            </section>
        </DashboardLayout>
    );
}

function formatDate(value) { return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
function host(value) { try { return new URL(value).hostname; } catch { return value; } }
