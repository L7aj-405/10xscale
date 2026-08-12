<?php

namespace App\Services;

use App\Exceptions\ClickUpException;
use App\Models\AuditRequest;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Throwable;

class ClickUpService
{
    /**
     * @return array{id: string, url: string|null}
     */
    public function createAuditTask(AuditRequest $auditRequest): array
    {
        $token = trim((string) config('services.clickup.token'));
        $listId = trim((string) config('services.clickup.audit_list_id'));

        if ($token === '' || $listId === '') {
            throw new ClickUpException('ClickUp is not configured. Set the API token and Audit List ID.');
        }

        try {
            $response = Http::baseUrl(rtrim((string) config('services.clickup.api_url'), '/'))
                ->withHeaders(['Authorization' => $token])
                ->acceptJson()
                ->asJson()
                ->connectTimeout(5)
                ->timeout(15)
                ->post("/list/{$listId}/task", [
                    'name' => "Audit Request — {$auditRequest->name}",
                    'markdown_content' => $this->description($auditRequest),
                    'notify_all' => false,
                ]);
        } catch (ConnectionException $exception) {
            throw new ClickUpException('Could not connect to ClickUp.', previous: $exception);
        } catch (Throwable $exception) {
            throw new ClickUpException('The ClickUp request could not be completed.', previous: $exception);
        }

        if (! $response->successful()) {
            throw new ClickUpException($this->errorMessage($response->status()));
        }

        $taskId = $response->json('id');
        $taskUrl = $response->json('url');

        if (! is_string($taskId) || trim($taskId) === '') {
            throw new ClickUpException('ClickUp returned an invalid task response.');
        }

        return [
            'id' => $taskId,
            'url' => is_string($taskUrl) && filter_var($taskUrl, FILTER_VALIDATE_URL) ? $taskUrl : null,
        ];
    }

    private function description(AuditRequest $auditRequest): string
    {
        $submittedAt = $auditRequest->created_at?->toIso8601String() ?? now()->toIso8601String();

        return <<<MARKDOWN
        # NEW AUDIT REQUEST

        ## Client
        **Name:** {$auditRequest->name}
        **Email:** {$auditRequest->email}
        **Phone:** {$auditRequest->country_code} {$auditRequest->phone}

        ## Business
        **Website:** {$auditRequest->website}

        ## Business Information
        **Monthly Revenue:** {$auditRequest->monthly_revenue}
        **Email List Size:** {$auditRequest->list_size}
        **Email Revenue Share:** {$auditRequest->email_revenue_pct}

        ## Internal Information
        **Audit Request ID:** {$auditRequest->id}
        **Submission Date:** {$submittedAt}
        MARKDOWN;
    }

    private function errorMessage(int $status): string
    {
        return match ($status) {
            401, 403 => "ClickUp rejected the configured credentials (HTTP {$status}).",
            404 => 'ClickUp could not find the configured Audit List (HTTP 404).',
            429 => 'ClickUp rate limit exceeded (HTTP 429).',
            default => $status >= 500
                ? "ClickUp is temporarily unavailable (HTTP {$status})."
                : "ClickUp rejected the task request (HTTP {$status}).",
        };
    }
}
