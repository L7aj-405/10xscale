<?php

namespace App\Jobs;

use App\Models\AuditRequest;
use App\Services\ClickUpService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class SendAuditToClickUp implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 5;

    public int $timeout = 30;

    /** @var array<int, int> */
    public array $backoff = [60, 300, 900, 1800];

    public function __construct(public readonly int $auditRequestId)
    {
        $this->onQueue('integrations');
    }

    /**
     * @return array<int, WithoutOverlapping>
     */
    public function middleware(): array
    {
        return [
            (new WithoutOverlapping("clickup-audit-{$this->auditRequestId}"))
                ->releaseAfter(60)
                ->expireAfter(120),
        ];
    }

    public function handle(ClickUpService $clickUp): void
    {
        $auditRequest = AuditRequest::query()->find($this->auditRequestId);

        if (! $auditRequest || filled($auditRequest->clickup_task_id)) {
            return;
        }

        $auditRequest->forceFill([
            'clickup_sync_status' => 'pending',
            'clickup_sync_error' => null,
        ])->save();

        try {
            $task = $clickUp->createAuditTask($auditRequest);

            $auditRequest->forceFill([
                'clickup_task_id' => $task['id'],
                'clickup_task_url' => $task['url'],
                'clickup_sync_status' => 'synced',
                'clickup_synced_at' => now(),
                'clickup_sync_error' => null,
            ])->save();
        } catch (Throwable $exception) {
            $this->markFailed($auditRequest, $exception);

            throw $exception;
        }
    }

    public function failed(?Throwable $exception): void
    {
        $auditRequest = AuditRequest::query()->find($this->auditRequestId);

        if ($auditRequest && blank($auditRequest->clickup_task_id)) {
            $this->markFailed($auditRequest, $exception ?? new \RuntimeException('The ClickUp synchronization job failed.'));
        }
    }

    private function markFailed(AuditRequest $auditRequest, Throwable $exception): void
    {
        $message = Str::limit($exception->getMessage(), 2000, '');

        $auditRequest->forceFill([
            'clickup_sync_status' => 'failed',
            'clickup_sync_error' => $message,
        ])->save();

        Log::warning('ClickUp audit synchronization failed.', [
            'audit_request_id' => $auditRequest->id,
            'exception' => $exception::class,
            'message' => $message,
        ]);
    }
}
