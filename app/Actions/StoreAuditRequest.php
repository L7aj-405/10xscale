<?php

namespace App\Actions;

use App\Models\AuditRequest;

class StoreAuditRequest
{
    /**
     * @param  array<string, string>  $attributes
     */
    public function handle(array $attributes): AuditRequest
    {
        return AuditRequest::create($attributes);
    }
}
