<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BlogPostCoverController extends Controller
{
    public function __invoke(BlogPost $blogPost): StreamedResponse
    {
        abort_unless($blogPost->cover_image_path && Storage::disk('public')->exists($blogPost->cover_image_path), 404);

        return Storage::disk('public')->response($blogPost->cover_image_path, null, [
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }
}
