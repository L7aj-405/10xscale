<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveBlogPostRequest;
use App\Models\BlogPost;
use App\Support\VideoEmbedUrl;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class BlogPostController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard/BlogPosts/Index', [
            'posts' => BlogPost::query()->ordered()->get()->map(fn (BlogPost $post) => $this->serialize($post)),
            'storeUrl' => route('dashboard.blog-posts.store', absolute: false),
        ]);
    }

    public function store(SaveBlogPostRequest $request): RedirectResponse
    {
        $attributes = $request->safe()->except(['cover_image', 'cover_video', 'cover_video_source']);
        $attributes['slug'] = $attributes['slug'] ?: $this->uniqueSlug($attributes['title']['en']);
        $imagePath = $request->file('cover_image')?->store('blog-covers', 'public');
        $storesVideo = $attributes['cover_media_type'] === 'video' && $request->input('cover_video_source') === 'upload';
        $videoPath = $storesVideo ? $request->file('cover_video')?->store('blog-videos', 'public') : null;
        $attributes['cover_video_url'] = $attributes['cover_media_type'] === 'video' && ! $storesVideo
            ? $attributes['cover_video_url'] ?? null
            : null;

        if ($request->hasFile('cover_image') && ! $imagePath) {
            throw new RuntimeException('The blog cover could not be stored.');
        }

        if ($storesVideo && $request->hasFile('cover_video') && ! $videoPath) {
            Storage::disk('public')->delete(array_filter([$imagePath]));

            throw new RuntimeException('The blog video could not be stored.');
        }

        try {
            BlogPost::query()->create([
                ...$attributes,
                'cover_image_path' => $imagePath,
                'cover_video_path' => $videoPath,
            ]);
        } catch (Throwable $exception) {
            Storage::disk('public')->delete(array_filter([$imagePath, $videoPath]));

            throw $exception;
        }

        return to_route('dashboard.blog-posts.index')->with('success', 'Blog post created successfully.');
    }

    public function update(SaveBlogPostRequest $request, BlogPost $blogPost): RedirectResponse
    {
        $attributes = $request->safe()->except(['cover_image', 'cover_video', 'cover_video_source']);
        $attributes['slug'] = $attributes['slug'] ?: $this->uniqueSlug($attributes['title']['en'], $blogPost->id);
        $newImagePath = $request->file('cover_image')?->store('blog-covers', 'public');
        $storesVideo = $attributes['cover_media_type'] === 'video' && $request->input('cover_video_source') === 'upload';
        $newVideoPath = $storesVideo ? $request->file('cover_video')?->store('blog-videos', 'public') : null;
        $oldImagePath = $blogPost->cover_image_path;
        $oldVideoPath = $blogPost->cover_video_path;
        $usesExternalVideo = $attributes['cover_media_type'] === 'video' && ! $storesVideo;

        if ($request->hasFile('cover_image') && ! $newImagePath) {
            throw new RuntimeException('The replacement blog cover could not be stored.');
        }

        if ($storesVideo && $request->hasFile('cover_video') && ! $newVideoPath) {
            Storage::disk('public')->delete(array_filter([$newImagePath]));

            throw new RuntimeException('The replacement blog video could not be stored.');
        }

        if ($attributes['cover_media_type'] === 'video') {
            $attributes['cover_video_url'] = $usesExternalVideo ? ($attributes['cover_video_url'] ?? null) : null;

            if ($usesExternalVideo) {
                $attributes['cover_video_path'] = null;
            } elseif ($newVideoPath) {
                $attributes['cover_video_path'] = $newVideoPath;
            }
        } else {
            unset($attributes['cover_video_url']);
        }

        try {
            $blogPost->update([
                ...$attributes,
                ...($newImagePath ? ['cover_image_path' => $newImagePath] : []),
            ]);
        } catch (Throwable $exception) {
            Storage::disk('public')->delete(array_filter([$newImagePath, $newVideoPath]));

            throw $exception;
        }

        if ($newImagePath && $oldImagePath) {
            Storage::disk('public')->delete($oldImagePath);
        }

        if (($newVideoPath || $usesExternalVideo) && $oldVideoPath) {
            Storage::disk('public')->delete($oldVideoPath);
        }

        return to_route('dashboard.blog-posts.index')->with('success', 'Blog post updated successfully.');
    }

    public function destroy(BlogPost $blogPost): RedirectResponse
    {
        $blogPost->delete();

        return to_route('dashboard.blog-posts.index')->with('success', 'Blog post moved to the archive.');
    }

    private function uniqueSlug(string $title, ?int $exceptId = null): string
    {
        $base = Str::slug($title) ?: 'blog-post';
        $slug = $base;
        $suffix = 2;

        while (BlogPost::withTrashed()->where('slug', $slug)->when($exceptId, fn ($query) => $query->whereKeyNot($exceptId))->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }

    private function serialize(BlogPost $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'content' => $post->content,
            'cover_label' => $post->cover_label,
            'visual' => $post->visual,
            'category' => $post->category,
            'reading_minutes' => $post->reading_minutes,
            'author' => $post->author,
            'cover_media_type' => $post->cover_media_type,
            'cover_image_url' => $post->cover_image_path ? route('blog-posts.cover', $post, absolute: false) : null,
            'cover_video_source' => $post->cover_video_path ? 'upload' : 'url',
            'cover_video_url' => $post->cover_video_path
                ? route('blog-posts.video', $post, absolute: false)
                : $post->cover_video_url,
            'cover_video_external_url' => $post->cover_video_url,
            'cover_video_embed_url' => VideoEmbedUrl::from($post->cover_video_url),
            'published_at' => $post->published_at?->format('Y-m-d\TH:i'),
            'is_published' => $post->is_published,
            'is_live' => $post->is_published && $post->published_at?->isPast(),
            'position' => $post->position,
            'public_url' => route('blog.show', $post->slug, absolute: false),
            'update_url' => route('dashboard.blog-posts.update', $post, absolute: false),
            'delete_url' => route('dashboard.blog-posts.destroy', $post, absolute: false),
        ];
    }
}
