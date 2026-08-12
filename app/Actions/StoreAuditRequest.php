<?php

namespace App\Actions;

use App\Jobs\SendAuditToClickUp;
use App\Models\AuditRequest;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class StoreAuditRequest
{
    /**
     * @param  array<string, string>  $attributes
     */
    public function handle(array $attributes): AuditRequest
    {
        $auditRequest = AuditRequest::create($attributes);

        try {
            Bus::dispatch((new SendAuditToClickUp($auditRequest->id))->afterCommit());
        } catch (Throwable $exception) {
            $message = Str::limit($exception->getMessage(), 2000, '');

            $auditRequest->forceFill([
                'clickup_sync_status' => 'failed',
                'clickup_sync_error' => 'The ClickUp synchronization could not be queued. '.$message,
            ])->save();

            Log::error('Could not queue ClickUp audit synchronization.', [
                'audit_request_id' => $auditRequest->id,
                'exception' => $exception::class,
                'message' => $message,
            ]);
        }

        return $auditRequest;
    }
}
