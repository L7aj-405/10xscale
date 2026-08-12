<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\BrandLogo;
use App\Models\TeamMember;
use App\Support\VideoEmbedUrl;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function landing(): Response
    {
        return Inertia::render('Landing', [
            'brandLogos' => $this->brandLogos(),
            'teamMembers' => $this->teamMembers(),
        ]);
    }

    public function blog(): Response
    {
        return Inertia::render('Blog', [
            'posts' => $this->blogPosts(),
        ]);
    }

    public function showBlogPost(BlogPost $blogPost): Response
    {
        abort_unless($blogPost->is_published && $blogPost->published_at?->isPast(), 404);

        return Inertia::render('BlogPost', [
            'post' => $this->serializeBlogPost($blogPost, true),
        ]);
    }

    public function thankYou(): Response
    {
        return Inertia::render('ThankYou');
    }

    public function legal(string $document): Response
    {
        return Inertia::render('Legal', [
            'document' => $document,
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function brandLogos(): array
    {
        if (! Schema::hasTable('brand_logos')) {
            return [];
        }

        return BrandLogo::query()
            ->where('is_active', true)
            ->ordered()
            ->get()
            ->map(fn (BrandLogo $brandLogo) => [
                'id' => $brandLogo->id,
                'name' => $brandLogo->name,
                'image_url' => route('brand-logos.image', $brandLogo, absolute: false),
                'website_url' => $brandLogo->website_url,
            ])
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function teamMembers(): array
    {
        if (! Schema::hasTable('team_members')) {
            return [];
        }

        return TeamMember::query()
            ->where('is_active', true)
            ->ordered()
            ->get()
            ->map(fn (TeamMember $teamMember) => [
                'id' => $teamMember->id,
                'name' => $teamMember->name,
                'role' => $teamMember->role,
                'bio' => $teamMember->bio,
                'photo_label' => $teamMember->photo_label,
                'initials' => $teamMember->initials,
                'photo_url' => $teamMember->photo_path
                    ? route('team-members.photo', $teamMember, absolute: false)
                    : null,
                'linkedin_url' => $teamMember->linkedin_url,
                'x_url' => $teamMember->x_url,
                'website_url' => $teamMember->website_url,
            ])
            ->all();
    }

    private function serializeBlogPost(BlogPost $post, bool $withContent = false): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            ...($withContent ? ['content' => $post->content] : []),
            'cover_label' => $post->cover_label,
            'visual' => $post->visual,
            'category' => $post->category,
            'reading_minutes' => $post->reading_minutes,
            'author' => $post->author,
            'cover_media_type' => $post->cover_media_type,
            'cover_image_url' => $post->cover_image_path ? route('blog-posts.cover', $post, absolute: false) : null,
            'cover_video_url' => $post->cover_video_path
                ? route('blog-posts.video', $post, absolute: false)
                : $post->cover_video_url,
            'cover_video_embed_url' => VideoEmbedUrl::from($post->cover_video_url),
            'published_at' => $post->published_at?->toDateString(),
            'url' => route('blog.show', $post->slug, absolute: false),
        ];
    }

    private function blogPosts(): array
    {
        if (! Schema::hasTable('blog_posts')) {
            return [];
        }

        return BlogPost::query()
            ->published()
            ->ordered()
            ->get()
            ->map(fn (BlogPost $post) => $this->serializeBlogPost($post))
            ->all();
    }
}
