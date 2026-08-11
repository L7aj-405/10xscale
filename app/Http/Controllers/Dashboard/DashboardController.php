<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\AuditRequest;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Dashboard/Overview', [
            'metrics' => [
                'audit_requests' => AuditRequest::query()->count(),
                'audit_requests_today' => AuditRequest::query()->whereDate('created_at', today())->count(),
                'users' => User::query()->count(),
                'admins' => User::query()->where('role', UserRole::Admin->value)->count(),
            ],
            'recentAuditRequests' => AuditRequest::query()
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (AuditRequest $auditRequest) => $this->serializeAuditRequest($auditRequest)),
        ]);
    }

    private function serializeAuditRequest(AuditRequest $auditRequest): array
    {
        return [
            'id' => $auditRequest->id,
            'name' => $auditRequest->name,
            'email' => $auditRequest->email,
            'website' => $auditRequest->website,
            'monthly_revenue' => $auditRequest->monthly_revenue,
            'created_at' => $auditRequest->created_at?->toIso8601String(),
        ];
    }
}
