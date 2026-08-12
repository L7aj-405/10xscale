<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlogPost extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_label',
        'visual',
        'category',
        'reading_minutes',
        'author',
        'cover_media_type',
        'cover_image_path',
        'cover_video_path',
        'cover_video_url',
        'published_at',
        'is_published',
        'position',
    ];

    protected function casts(): array
    {
        return [
            'title' => 'array',
            'excerpt' => 'array',
            'content' => 'array',
            'cover_label' => 'array',
            'visual' => 'array',
            'category' => 'array',
            'published_at' => 'datetime',
            'is_published' => 'boolean',
            'reading_minutes' => 'integer',
            'position' => 'integer',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('position')->orderByDesc('published_at');
    }
}
