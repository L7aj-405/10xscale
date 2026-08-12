<?php

namespace Tests\Feature;

use App\Exceptions\ClickUpException;
use App\Jobs\SendAuditToClickUp;
use App\Models\AuditRequest;
use App\Models\User;
use App\Services\ClickUpService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class ClickUpAuditIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('services.clickup.token', 'pk_test_token');
        config()->set('services.clickup.audit_list_id', '123456789');
        config()->set('services.clickup.api_url', 'https://api.clickup.com/api/v2');
    }

    public function test_submission_is_saved_and_job_is_dispatched_without_calling_clickup_inline(): void
    {
        Queue::fake();
        Http::preventStrayRequests();

        $this->post('/audit-requests', $this->formPayload())
            ->assertRedirect('/thank-you');

        $auditRequest = AuditRequest::query()->sole();
        $this->assertSame('pending', $auditRequest->clickup_sync_status);
        Queue::assertPushed(SendAuditToClickUp::class, fn (SendAuditToClickUp $job) => $job->auditRequestId === $auditRequest->id);
    }

    public function test_successful_job_stores_clickup_task_details_and_maps_all_audit_fields(): void
    {
        Http::fake([
            'api.clickup.com/api/v2/list/123456789/task' => Http::response([
                'id' => '86abc123',
                'url' => 'https://app.clickup.com/t/86abc123',
            ]),
        ]);

        $auditRequest = AuditRequest::query()->create($this->attributes());
        (new SendAuditToClickUp($auditRequest->id))->handle(app(ClickUpService::class));

        $auditRequest->refresh();
        $this->assertSame('86abc123', $auditRequest->clickup_task_id);
        $this->assertSame('https://app.clickup.com/t/86abc123', $auditRequest->clickup_task_url);
        $this->assertSame('synced', $auditRequest->clickup_sync_status);
        $this->assertNotNull($auditRequest->clickup_synced_at);
        $this->assertNull($auditRequest->clickup_sync_error);

        Http::assertSent(function ($request) use ($auditRequest) {
            $description = $request['markdown_content'];

            return $request->url() === 'https://api.clickup.com/api/v2/list/123456789/task'
                && $request->hasHeader('Authorization', 'pk_test_token')
                && $request['name'] === 'Audit Request — Sarah Mitchell'
                && str_contains($description, '**Email:** sarah@example.com')
                && str_contains($description, '**Phone:** +44 7911 123456')
                && str_contains($description, '**Website:** https://yourbrand.com')
                && str_contains($description, '**Monthly Revenue:** $500k+')
                && str_contains($description, '**Email List Size:** 100,000+')
                && str_contains($description, '**Email Revenue Share:** Over 30%')
                && str_contains($description, "**Audit Request ID:** {$auditRequest->id}");
        });
    }

    public function test_failed_clickup_request_keeps_audit_and_records_failure(): void
    {
        Http::fake(['api.clickup.com/*' => Http::response(['err' => 'Temporary outage'], 503)]);
        $auditRequest = AuditRequest::query()->create($this->attributes());

        try {
            (new SendAuditToClickUp($auditRequest->id))->handle(app(ClickUpService::class));
            $this->fail('The job should rethrow so Laravel can retry it.');
        } catch (ClickUpException $exception) {
            $this->assertStringContainsString('temporarily unavailable', $exception->getMessage());
        }

        $this->assertDatabaseHas('audit_requests', ['id' => $auditRequest->id]);
        $auditRequest->refresh();
        $this->assertSame('failed', $auditRequest->clickup_sync_status);
        $this->assertNull($auditRequest->clickup_task_id);
        $this->assertNotNull($auditRequest->clickup_sync_error);
    }

    public function test_existing_clickup_task_id_prevents_duplicate_creation(): void
    {
        Http::preventStrayRequests();
        $auditRequest = AuditRequest::query()->create([
            ...$this->attributes(),
            'clickup_task_id' => 'existing-task',
            'clickup_sync_status' => 'synced',
        ]);

        (new SendAuditToClickUp($auditRequest->id))->handle(app(ClickUpService::class));

        Http::assertNothingSent();
        $this->assertSame('existing-task', $auditRequest->fresh()->clickup_task_id);
    }

    public function test_admin_can_retry_failed_sync_but_team_user_cannot(): void
    {
        Queue::fake();
        $auditRequest = AuditRequest::query()->create([
            ...$this->attributes(),
            'clickup_sync_status' => 'failed',
            'clickup_sync_error' => 'Previous failure',
        ]);
        $team = User::factory()->create();
        $admin = User::factory()->admin()->create();

        $this->actingAs($team)
            ->post("/dashboard/audit-requests/{$auditRequest->id}/clickup/retry")
            ->assertForbidden();

        $this->actingAs($admin)
            ->post("/dashboard/audit-requests/{$auditRequest->id}/clickup/retry")
            ->assertRedirect();

        $auditRequest->refresh();
        $this->assertSame('pending', $auditRequest->clickup_sync_status);
        $this->assertNull($auditRequest->clickup_sync_error);
        Queue::assertPushed(SendAuditToClickUp::class, fn (SendAuditToClickUp $job) => $job->auditRequestId === $auditRequest->id);
    }

    private function formPayload(): array
    {
        return [
            ...$this->attributes(),
            'website' => 'yourbrand.com',
            'company' => '',
            'locale' => 'en',
        ];
    }

    private function attributes(): array
    {
        return [
            'name' => 'Sarah Mitchell',
            'email' => 'sarah@example.com',
            'country_code' => '+44',
            'phone' => '7911 123456',
            'website' => 'https://yourbrand.com',
            'monthly_revenue' => '$500k+',
            'list_size' => '100,000+',
            'email_revenue_pct' => 'Over 30%',
        ];
    }
}
