<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditRequest extends Model
{
    protected $fillable = [
        'name',
        'email',
        'country_code',
        'phone',
        'website',
        'monthly_revenue',
        'list_size',
        'email_revenue_pct',
        'clickup_task_id',
        'clickup_task_url',
        'clickup_sync_status',
        'clickup_synced_at',
        'clickup_sync_error',
    ];

    protected function casts(): array
    {
        return [
            'clickup_synced_at' => 'datetime',
        ];
    }
}
