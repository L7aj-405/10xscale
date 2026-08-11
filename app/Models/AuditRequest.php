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
    ];
}
