<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\AuditRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $search = mb_substr(trim((string) $request->query('search')), 0, 100);

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
                'created_at' => $auditRequest->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Dashboard/AuditRequests/Index', [
            'auditRequests' => $auditRequests,
            'filters' => ['search' => $search],
        ]);
    }
}
