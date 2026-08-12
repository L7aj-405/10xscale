<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeamMember extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'role',
        'bio',
        'photo_label',
        'initials',
        'photo_path',
        'linkedin_url',
        'x_url',
        'website_url',
        'position',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'name' => 'array',
            'role' => 'array',
            'bio' => 'array',
            'photo_label' => 'array',
            'position' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('position')->orderBy('id');
    }
}
