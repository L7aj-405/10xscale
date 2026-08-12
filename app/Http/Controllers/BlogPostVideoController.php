<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BlogPostVideoController extends Controller
{
    public function __invoke(BlogPost $blogPost): StreamedResponse
    {
        abort_unless($blogPost->cover_video_path && Storage::disk('public')->exists($blogPost->cover_video_path), 404);

        return Storage::disk('public')->response($blogPost->cover_video_path, null, [
            'Cache-Control' => 'public, max-age=86400',
            'Content-Disposition' => 'inline',
        ]);
    }
}
