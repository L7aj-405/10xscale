<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\AuditRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
        $this->get('/dashboard/audit-requests')->assertRedirect('/login');
    }

    public function test_admin_and_team_users_can_review_paginated_audit_requests(): void
    {
        $teamUser = User::factory()->create(['role' => UserRole::Team]);
        $this->createAuditRequests(16);

        $this->actingAs($teamUser)
            ->get('/dashboard/audit-requests')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/AuditRequests/Index')
                ->has('auditRequests.data', 15)
                ->where('auditRequests.total', 16)
                ->where('auditRequests.per_page', 15)
            );
    }

    public function test_team_users_cannot_access_user_management(): void
    {
        $teamUser = User::factory()->create(['role' => UserRole::Team]);

        $this->actingAs($teamUser)->get('/dashboard/users')->assertForbidden();
        $this->actingAs($teamUser)->post('/dashboard/users', [])->assertForbidden();
    }

    public function test_dashboard_search_only_returns_matching_audit_requests(): void
    {
        $admin = User::factory()->admin()->create();
        $this->createAuditRequests(2);
        AuditRequest::query()->create($this->auditAttributes('Unique Lead', 'unique@example.com'));

        $this->actingAs($admin)
            ->get('/dashboard/audit-requests?search=unique%40example.com')
            ->assertInertia(fn (Assert $page) => $page
                ->has('auditRequests.data', 1)
                ->where('auditRequests.data.0.email', 'unique@example.com')
            );
    }

    public function test_dashboard_audit_requests_are_ordered_latest_first(): void
    {
        $admin = User::factory()->admin()->create();

        $older = AuditRequest::query()->create($this->auditAttributes('Older Lead', 'older@example.com'));
        $newer = AuditRequest::query()->create($this->auditAttributes('Newer Lead', 'newer@example.com'));

        $older->forceFill(['created_at' => now()->subDay(), 'updated_at' => now()->subDay()])->save();
        $newer->forceFill(['created_at' => now(), 'updated_at' => now()])->save();

        $this->actingAs($admin)
            ->get('/dashboard/audit-requests')
            ->assertInertia(fn (Assert $page) => $page
                ->where('auditRequests.data.0.email', 'newer@example.com')
                ->where('auditRequests.data.1.email', 'older@example.com')
            );
    }

    private function createAuditRequests(int $count): void
    {
        foreach (range(1, $count) as $index) {
            AuditRequest::query()->create(
                $this->auditAttributes("Lead {$index}", "lead{$index}@example.com"),
            );
        }
    }

    private function auditAttributes(string $name, string $email): array
    {
        return [
            'name' => $name,
            'email' => $email,
            'country_code' => '+44',
            'phone' => '7911 123456',
            'website' => 'https://example.com',
            'monthly_revenue' => '$100k – $250k',
            'list_size' => '20,000 – 50,000',
            'email_revenue_pct' => '10% – 20%',
        ];
    }
}
