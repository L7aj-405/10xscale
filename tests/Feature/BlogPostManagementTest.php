<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\BlogPost;
use App\Models\User;
use Database\Seeders\BlogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BlogPostManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_blog_seeder_imports_the_five_existing_articles(): void
    {
        $this->seed(BlogSeeder::class);

        $this->assertDatabaseCount('blog_posts', 5);
        $this->assertSame('How Much Revenue Should Klaviyo Generate for Your Store?', BlogPost::query()->ordered()->first()->title['en']);
    }

    public function test_public_blog_lists_published_posts_and_renders_slug_detail(): void
    {
        $published = BlogPost::query()->create($this->attributes());
        BlogPost::query()->create([...$this->attributes('draft-post'), 'is_published' => false]);
        BlogPost::query()->create([...$this->attributes('future-post'), 'published_at' => now()->addDay()]);

        $this->get('/blog')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Blog')
            ->has('posts', 1)
            ->where('posts.0.slug', $published->slug)
        );

        $this->get("/blog/{$published->slug}")->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('BlogPost')
            ->where('post.title.en', 'Test article')
            ->where('post.content.en', 'First paragraph.\n\nSecond paragraph.')
        );

        $this->get('/blog/draft-post')->assertNotFound();
        $this->get('/blog/future-post')->assertNotFound();
    }

    public function test_only_admins_can_manage_blog_posts(): void
    {
        $team = User::factory()->create(['role' => UserRole::Team]);

        $this->get('/dashboard/blog-posts')->assertRedirect('/login');
        $this->actingAs($team)->get('/dashboard/blog-posts')->assertForbidden();
        $this->actingAs($team)->post('/dashboard/blog-posts', $this->payload())->assertForbidden();
    }

    public function test_admin_can_create_update_and_soft_delete_a_blog_post(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/dashboard/blog-posts', [
            ...$this->payload(),
            'slug' => '',
            'cover_image' => $this->cover('cover.png'),
        ])->assertRedirect('/dashboard/blog-posts')->assertSessionHas('success');

        $post = BlogPost::query()->sole();
        $this->assertSame('test-article', $post->slug);
        Storage::disk('public')->assertExists($post->cover_image_path);

        $oldPath = $post->cover_image_path;
        $this->actingAs($admin)->post("/dashboard/blog-posts/{$post->id}", [
            ...$this->payload(),
            '_method' => 'put',
            'title' => ['en' => 'Updated article', 'fr' => 'Article actualisé', 'ar' => 'مقال محدّث'],
            'slug' => 'updated-article',
            'cover_image' => $this->cover('replacement.png'),
        ])->assertRedirect('/dashboard/blog-posts');

        $post->refresh();
        $this->assertSame('Updated article', $post->title['en']);
        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($post->cover_image_path);

        $this->actingAs($admin)->delete("/dashboard/blog-posts/{$post->id}")->assertRedirect('/dashboard/blog-posts');
        $this->assertSoftDeleted($post);
        Storage::disk('public')->assertExists($post->cover_image_path);
    }

    public function test_cover_route_serves_a_stored_blog_image(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('blog-covers/test.png', $this->pngContents());
        $post = BlogPost::query()->create([...$this->attributes(), 'cover_image_path' => 'blog-covers/test.png']);

        $this->get("/blog-posts/{$post->id}/cover")->assertOk()->assertHeader('cache-control', 'max-age=86400, public');
    }

    public function test_admin_can_use_a_hosted_video_or_replace_it_with_an_external_embed(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/dashboard/blog-posts', [
            ...$this->payload(),
            'cover_media_type' => 'video',
            'cover_video_source' => 'upload',
            'cover_video' => UploadedFile::fake()->create('launch.mp4', 500, 'video/mp4'),
        ])->assertRedirect('/dashboard/blog-posts');

        $post = BlogPost::query()->sole();
        $this->assertSame('video', $post->cover_media_type);
        $this->assertNull($post->cover_video_url);
        Storage::disk('public')->assertExists($post->cover_video_path);
        $this->get("/blog-posts/{$post->id}/video")
            ->assertOk()
            ->assertHeader('cache-control', 'max-age=86400, public');

        $oldVideoPath = $post->cover_video_path;
        $youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

        $this->actingAs($admin)->post("/dashboard/blog-posts/{$post->id}", [
            ...$this->payload(),
            '_method' => 'put',
            'cover_media_type' => 'video',
            'cover_video_source' => 'url',
            'cover_video_url' => $youtubeUrl,
        ])->assertRedirect('/dashboard/blog-posts');

        $post->refresh();
        $this->assertNull($post->cover_video_path);
        $this->assertSame($youtubeUrl, $post->cover_video_url);
        Storage::disk('public')->assertMissing($oldVideoPath);

        $this->get("/blog/{$post->slug}")->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('post.cover_media_type', 'video')
            ->where('post.cover_video_url', $youtubeUrl)
            ->where('post.cover_video_embed_url', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
        );
    }

    public function test_video_cover_requires_a_valid_upload_or_https_url(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/dashboard/blog-posts', [
            ...$this->payload(),
            'cover_media_type' => 'video',
            'cover_video_source' => 'upload',
        ])->assertSessionHasErrors('cover_video');

        $this->actingAs($admin)->post('/dashboard/blog-posts', [
            ...$this->payload(),
            'cover_media_type' => 'video',
            'cover_video_source' => 'url',
            'cover_video_url' => 'javascript:alert(1)',
        ])->assertSessionHasErrors('cover_video_url');
    }

    private function attributes(string $slug = 'test-article'): array
    {
        return [
            'title' => ['en' => 'Test article', 'fr' => 'Article test', 'ar' => 'مقال تجريبي'],
            'slug' => $slug,
            'excerpt' => ['en' => 'Test excerpt', 'fr' => 'Résumé test', 'ar' => 'ملخص تجريبي'],
            'content' => ['en' => 'First paragraph.\n\nSecond paragraph.', 'fr' => 'Premier paragraphe.', 'ar' => 'الفقرة الأولى.'],
            'cover_label' => ['en' => 'Test cover', 'fr' => 'Couverture test', 'ar' => 'غلاف تجريبي'],
            'visual' => ['en' => 'Testing', 'fr' => 'Test', 'ar' => 'اختبار'],
            'category' => ['en' => 'Strategy', 'fr' => 'Stratégie', 'ar' => 'استراتيجية'],
            'reading_minutes' => 6,
            'author' => '10Xscale Team',
            'cover_media_type' => 'image',
            'published_at' => now()->subMinute(),
            'is_published' => true,
            'position' => 1,
        ];
    }

    private function payload(): array
    {
        return [...$this->attributes(), 'published_at' => now()->format('Y-m-d\TH:i')];
    }

    private function cover(string $name): UploadedFile
    {
        return UploadedFile::fake()->createWithContent($name, $this->pngContents());
    }

    private function pngContents(): string
    {
        return base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=');
    }
}
