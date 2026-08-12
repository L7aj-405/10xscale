<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Jobs\SendAuditToClickUp;
use App\Models\AuditRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Inertia\Inertia;
use Inertia\Response;

class AuditRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $search = mb_substr(trim((string) $request->query('search')), 0, 100);
        $canRetryClickUp = $request->user()->isAdmin();

        $auditRequests = AuditRequest::query()
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $query) use ($search) {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('website', 'like', "%{$search}%");
                });
            })
            ->latest('created_at')
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (AuditRequest $auditRequest) => [
                'id' => $auditRequest->id,
                'name' => $auditRequest->name,
                'email' => $auditRequest->email,
                'country_code' => $auditRequest->country_code,
                'phone' => $auditRequest->phone,
                'website' => $auditRequest->website,
                'monthly_revenue' => $auditRequest->monthly_revenue,
                'list_size' => $auditRequest->list_size,
                'email_revenue_pct' => $auditRequest->email_revenue_pct,
                'clickup_task_id' => $auditRequest->clickup_task_id,
                'clickup_task_url' => $auditRequest->clickup_task_url,
                'clickup_sync_status' => $auditRequest->clickup_sync_status,
                'clickup_synced_at' => $auditRequest->clickup_synced_at?->toIso8601String(),
                'clickup_sync_error' => $canRetryClickUp ? $auditRequest->clickup_sync_error : null,
                'clickup_retry_url' => $canRetryClickUp && blank($auditRequest->clickup_task_id)
                    ? route('dashboard.audit-requests.clickup.retry', $auditRequest, absolute: false)
                    : null,
                'created_at' => $auditRequest->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Dashboard/AuditRequests/Index', [
            'auditRequests' => $auditRequests,
            'filters' => ['search' => $search],
        ]);
    }

    public function retryClickUp(AuditRequest $auditRequest): RedirectResponse
    {
        if (filled($auditRequest->clickup_task_id)) {
            return back()->with('success', 'This audit request is already synced to ClickUp.');
        }

        $auditRequest->forceFill([
            'clickup_sync_status' => 'pending',
            'clickup_sync_error' => null,
        ])->save();

        Bus::dispatch((new SendAuditToClickUp($auditRequest->id))->afterCommit());

        return back()->with('success', 'ClickUp synchronization has been queued.');
    }
}
