<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\BrandLogo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BrandLogoManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admins_can_manage_brand_logos(): void
    {
        $teamUser = User::factory()->create(['role' => UserRole::Team]);

        $this->get('/dashboard/brand-logos')->assertRedirect('/login');
        $this->actingAs($teamUser)->get('/dashboard/brand-logos')->assertForbidden();
        $this->actingAs($teamUser)->post('/dashboard/brand-logos', [])->assertForbidden();
    }

    public function test_admin_can_upload_a_brand_logo(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post('/dashboard/brand-logos', [
                'name' => 'Acme',
                'image' => $this->logoUpload('acme.png'),
                'website_url' => 'https://acme.example',
                'position' => 3,
                'is_active' => true,
            ])
            ->assertRedirect('/dashboard/brand-logos')
            ->assertSessionHas('success');

        $brandLogo = BrandLogo::query()->sole();

        $this->assertSame('Acme', $brandLogo->name);
        $this->assertSame(3, $brandLogo->position);
        $this->assertTrue($brandLogo->is_active);
        Storage::disk('public')->assertExists($brandLogo->image_path);
    }

    public function test_admin_can_replace_and_update_a_brand_logo(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();
        Storage::disk('public')->put('brand-logos/old.png', $this->pngContents());
        $brandLogo = BrandLogo::query()->create([
            'name' => 'Old Brand',
            'image_path' => 'brand-logos/old.png',
            'position' => 1,
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->put("/dashboard/brand-logos/{$brandLogo->id}", [
                'name' => 'Updated Brand',
                'image' => $this->logoUpload('updated.png'),
                'website_url' => 'https://updated.example',
                'position' => 9,
                'is_active' => false,
            ])
            ->assertRedirect('/dashboard/brand-logos');

        $brandLogo->refresh();

        $this->assertSame('Updated Brand', $brandLogo->name);
        $this->assertSame(9, $brandLogo->position);
        $this->assertFalse($brandLogo->is_active);
        Storage::disk('public')->assertMissing('brand-logos/old.png');
        Storage::disk('public')->assertExists($brandLogo->image_path);
    }

    public function test_admin_can_delete_a_brand_logo_and_its_file(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();
        Storage::disk('public')->put('brand-logos/delete.png', $this->pngContents());
        $brandLogo = BrandLogo::query()->create([
            'name' => 'Delete Brand',
            'image_path' => 'brand-logos/delete.png',
            'position' => 0,
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->delete("/dashboard/brand-logos/{$brandLogo->id}")
            ->assertRedirect('/dashboard/brand-logos');

        $this->assertModelMissing($brandLogo);
        Storage::disk('public')->assertMissing('brand-logos/delete.png');
    }

    public function test_landing_page_receives_only_active_logos_in_display_order(): void
    {
        $later = BrandLogo::query()->create($this->attributes('Later', 'later.png', 20, true));
        $hidden = BrandLogo::query()->create($this->attributes('Hidden', 'hidden.png', 0, false));
        $first = BrandLogo::query()->create($this->attributes('First', 'first.png', 5, true));

        $this->get('/')
            ->assertInertia(fn (Assert $page) => $page
                ->has('brandLogos', 2)
                ->where('brandLogos.0.id', $first->id)
                ->where('brandLogos.0.name', 'First')
                ->where('brandLogos.1.id', $later->id)
                ->missing('brandLogos.2')
            );

        $this->assertFalse($hidden->is_active);
    }

    public function test_logo_image_route_serves_the_stored_file(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('brand-logos/public.png', $this->pngContents());
        $brandLogo = BrandLogo::query()->create($this->attributes('Public', 'brand-logos/public.png', 0, true));

        $this->get("/brand-logos/{$brandLogo->id}/image")
            ->assertOk()
            ->assertHeader('cache-control', 'max-age=86400, public');
    }

    public function test_upload_rejects_non_image_files(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->from('/dashboard/brand-logos')
            ->post('/dashboard/brand-logos', [
                'name' => 'Unsafe',
                'image' => UploadedFile::fake()->createWithContent('unsafe.svg', '<svg><script>alert(1)</script></svg>'),
                'position' => 0,
                'is_active' => true,
            ])
            ->assertRedirect('/dashboard/brand-logos')
            ->assertSessionHasErrors('image');

        $this->assertDatabaseCount('brand_logos', 0);
    }

    /**
     * @return array<string, mixed>
     */
    private function attributes(string $name, string $path, int $position, bool $active): array
    {
        return [
            'name' => $name,
            'image_path' => $path,
            'website_url' => null,
            'position' => $position,
            'is_active' => $active,
        ];
    }

    private function logoUpload(string $name): UploadedFile
    {
        return UploadedFile::fake()->createWithContent($name, $this->pngContents());
    }

    private function pngContents(): string
    {
        return base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=');
    }
}
