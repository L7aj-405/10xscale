<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\SiteAppearance;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
                ->where('appearanceRoutes.update', '/dashboard/appearance')
                ->has('fontOptions', 2)
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

    public function test_admin_can_restore_default_appearance(): void
    {
        $admin = User::factory()->admin()->create();
        SiteAppearance::query()->create([
            'id' => 1,
            ...SiteAppearance::DEFAULTS,
            'accent_color' => '#7C3AED',
        ]);

        $this->actingAs($admin)
            ->delete('/dashboard/appearance')
            ->assertRedirect('/dashboard/appearance')
            ->assertSessionHas('success');

        $this->assertDatabaseHas('site_appearances', [
            'id' => 1,
            'accent_color' => SiteAppearance::DEFAULTS['accent_color'],
        ]);
    }
}
