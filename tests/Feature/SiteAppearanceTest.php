<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\SiteAppearance;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SiteAppearanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admins_can_manage_site_appearance(): void
    {
        $teamUser = User::factory()->create(['role' => UserRole::Team]);

        $this->get('/dashboard/appearance')->assertRedirect('/login');
        $this->actingAs($teamUser)->get('/dashboard/appearance')->assertForbidden();
        $this->actingAs($teamUser)->put('/dashboard/appearance', SiteAppearance::DEFAULTS)->assertForbidden();
        $this->actingAs($teamUser)->delete('/dashboard/appearance')->assertForbidden();
    }

    public function test_admin_can_open_the_appearance_editor(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get('/dashboard/appearance')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Appearance/Edit')
                ->where('appearance.accent_color', '#FFE81A')
                ->where('appearance.has_light_logo', false)
                ->where('appearance.has_dark_logo', false)
                ->where('appearance.light_logo_url', null)
                ->where('appearanceRoutes.update', '/dashboard/appearance')
                ->has('fontOptions', 5)
            );
    }

    public function test_admin_can_update_site_appearance_and_public_pages_receive_it(): void
    {
        $admin = User::factory()->admin()->create();
        $appearance = [
            ...SiteAppearance::DEFAULTS,
            'accent_color' => '#7C3AED',
            'accent_text_color' => '#FFFFFF',
            'body_font' => 'archivo',
            'display_font' => 'instrument-sans',
        ];

        $this->actingAs($admin)
            ->put('/dashboard/appearance', $appearance)
            ->assertRedirect('/dashboard/appearance')
            ->assertSessionHas('success');

        $this->assertDatabaseHas('site_appearances', [
            'id' => 1,
            'accent_color' => '#7C3AED',
            'body_font' => 'archivo',
        ]);

        $this->get('/')
            ->assertInertia(fn (Assert $page) => $page
                ->where('siteAppearance.accent_color', '#7C3AED')
                ->where('siteAppearance.accent_text_color', '#FFFFFF')
                ->where('siteAppearance.display_font', 'instrument-sans')
            );
    }

    public function test_invalid_colors_and_fonts_are_rejected(): void
    {
        $admin = User::factory()->admin()->create();
        $appearance = [
            ...SiteAppearance::DEFAULTS,
            'accent_color' => 'yellow',
            'body_font' => 'remote-font',
        ];

        $this->actingAs($admin)
            ->from('/dashboard/appearance')
            ->put('/dashboard/appearance', $appearance)
            ->assertRedirect('/dashboard/appearance')
            ->assertSessionHasErrors(['accent_color', 'body_font']);

        $this->assertDatabaseCount('site_appearances', 0);
    }

    public function test_admin_can_upload_one_logo_and_it_is_used_for_both_modes(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post('/dashboard/appearance', [
                ...SiteAppearance::DEFAULTS,
                '_method' => 'put',
                'light_logo' => $this->logoUpload('light.png'),
            ])
            ->assertRedirect('/dashboard/appearance')
            ->assertSessionHas('success');

        $appearance = SiteAppearance::query()->findOrFail(1);

        $this->assertNotNull($appearance->light_logo_path);
        $this->assertNull($appearance->dark_logo_path);
        Storage::disk('public')->assertExists($appearance->light_logo_path);

        $this->get('/')
            ->assertInertia(fn (Assert $page) => $page
                ->where('siteAppearance.has_light_logo', true)
                ->where('siteAppearance.has_dark_logo', false)
                ->where('siteAppearance.light_logo_url', fn ($url) => str_starts_with($url, '/site-appearance/logo/light?v='))
                ->where('siteAppearance.dark_logo_url', fn ($url) => str_starts_with($url, '/site-appearance/logo/dark?v='))
            );

        $this->get('/site-appearance/logo/light')->assertOk();
        $this->get('/site-appearance/logo/dark')->assertOk();
    }

    public function test_replacing_a_logo_removes_the_superseded_file(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();
        Storage::disk('public')->put('site-appearance/old.png', $this->pngContents());
        SiteAppearance::query()->create([
            'id' => 1,
            ...SiteAppearance::DEFAULTS,
            'light_logo_path' => 'site-appearance/old.png',
        ]);

        $this->actingAs($admin)
            ->post('/dashboard/appearance', [
                ...SiteAppearance::DEFAULTS,
                '_method' => 'put',
                'light_logo' => $this->logoUpload('replacement.png'),
            ])
            ->assertRedirect('/dashboard/appearance');

        $appearance = SiteAppearance::query()->findOrFail(1);

        Storage::disk('public')->assertMissing('site-appearance/old.png');
        Storage::disk('public')->assertExists($appearance->light_logo_path);
    }

    public function test_logo_upload_rejects_unsafe_files(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->from('/dashboard/appearance')
            ->post('/dashboard/appearance', [
                ...SiteAppearance::DEFAULTS,
                '_method' => 'put',
                'dark_logo' => UploadedFile::fake()->createWithContent('unsafe.svg', '<svg><script>alert(1)</script></svg>'),
            ])
            ->assertRedirect('/dashboard/appearance')
            ->assertSessionHasErrors('dark_logo');

        $this->assertDatabaseCount('site_appearances', 0);
    }

    public function test_admin_can_restore_default_appearance(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();
        Storage::disk('public')->put('site-appearance/light.png', $this->pngContents());
        Storage::disk('public')->put('site-appearance/dark.png', $this->pngContents());
        SiteAppearance::query()->create([
            'id' => 1,
            ...SiteAppearance::DEFAULTS,
            'accent_color' => '#7C3AED',
            'light_logo_path' => 'site-appearance/light.png',
            'dark_logo_path' => 'site-appearance/dark.png',
        ]);

        $this->actingAs($admin)
            ->delete('/dashboard/appearance')
            ->assertRedirect('/dashboard/appearance')
            ->assertSessionHas('success');

        $this->assertDatabaseHas('site_appearances', [
            'id' => 1,
            'accent_color' => SiteAppearance::DEFAULTS['accent_color'],
            'light_logo_path' => null,
            'dark_logo_path' => null,
        ]);
        Storage::disk('public')->assertMissing('site-appearance/light.png');
        Storage::disk('public')->assertMissing('site-appearance/dark.png');
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
