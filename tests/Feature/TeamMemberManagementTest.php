<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\TeamMember;
use App\Models\User;
use Database\Seeders\TeamMemberSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TeamMemberManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admins_can_manage_team_members(): void
    {
        $teamUser = User::factory()->create(['role' => UserRole::Team]);

        $this->get('/dashboard/team-members')->assertRedirect('/login');
        $this->actingAs($teamUser)->get('/dashboard/team-members')->assertForbidden();
        $this->actingAs($teamUser)->post('/dashboard/team-members', [])->assertForbidden();
    }

    public function test_admin_can_create_a_localized_team_member_with_a_photo(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post('/dashboard/team-members', [
                ...$this->attributes('Jane Doe', 7, true),
                'photo' => $this->photoUpload('jane.png'),
            ])
            ->assertRedirect('/dashboard/team-members')
            ->assertSessionHas('success');

        $member = TeamMember::query()->sole();

        $this->assertSame('Jane Doe', $member->name['en']);
        $this->assertSame('جين دو', $member->name['ar']);
        $this->assertSame(7, $member->position);
        Storage::disk('public')->assertExists($member->photo_path);
    }

    public function test_admin_can_update_and_replace_a_team_member_photo(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();
        Storage::disk('public')->put('team-members/old.png', $this->pngContents());
        $member = TeamMember::query()->create([
            ...$this->attributes('Old Name', 1, true),
            'photo_path' => 'team-members/old.png',
        ]);

        $this->actingAs($admin)
            ->put("/dashboard/team-members/{$member->id}", [
                ...$this->attributes('Updated Name', 9, false),
                'photo' => $this->photoUpload('updated.png'),
            ])
            ->assertRedirect('/dashboard/team-members');

        $member->refresh();

        $this->assertSame('Updated Name', $member->name['en']);
        $this->assertSame(9, $member->position);
        $this->assertFalse($member->is_active);
        Storage::disk('public')->assertMissing('team-members/old.png');
        Storage::disk('public')->assertExists($member->photo_path);
    }

    public function test_admin_can_delete_a_team_member_and_their_photo(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();
        Storage::disk('public')->put('team-members/delete.png', $this->pngContents());
        $member = TeamMember::query()->create([
            ...$this->attributes('Delete Me', 0, true),
            'photo_path' => 'team-members/delete.png',
        ]);

        $this->actingAs($admin)
            ->delete("/dashboard/team-members/{$member->id}")
            ->assertRedirect('/dashboard/team-members');

        $this->assertModelMissing($member);
        Storage::disk('public')->assertMissing('team-members/delete.png');
    }

    public function test_landing_page_receives_only_active_members_in_display_order(): void
    {
        $later = TeamMember::query()->create($this->attributes('Later', 20, true));
        $hidden = TeamMember::query()->create($this->attributes('Hidden', 0, false));
        $first = TeamMember::query()->create($this->attributes('First', 5, true));

        $this->get('/')
            ->assertInertia(fn (Assert $page) => $page
                ->has('teamMembers', 2)
                ->where('teamMembers.0.id', $first->id)
                ->where('teamMembers.0.name.en', 'First')
                ->where('teamMembers.1.id', $later->id)
            );

        $this->assertFalse($hidden->is_active);
    }

    public function test_team_member_photo_route_serves_the_stored_file(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('team-members/public.png', $this->pngContents());
        $member = TeamMember::query()->create([
            ...$this->attributes('Public Member', 0, true),
            'photo_path' => 'team-members/public.png',
        ]);

        $this->get("/team-members/{$member->id}/photo")
            ->assertOk()
            ->assertHeader('cache-control', 'max-age=86400, public');
    }

    public function test_seeder_populates_the_existing_static_team_data(): void
    {
        $this->seed(TeamMemberSeeder::class);

        $this->assertDatabaseCount('team_members', 4);
        $this->assertSame('Abdelfath Ben Chahyd', TeamMember::query()->ordered()->first()->name['en']);
    }

    /**
     * @return array<string, mixed>
     */
    private function attributes(string $name, int $position, bool $active): array
    {
        return [
            'name' => ['en' => $name, 'fr' => 'Jeanne Doe', 'ar' => 'جين دو'],
            'role' => ['en' => 'Email Strategist', 'fr' => 'Stratège e-mail', 'ar' => 'خبيرة البريد الإلكتروني'],
            'bio' => ['en' => 'Builds retention systems.', 'fr' => 'Crée des systèmes de rétention.', 'ar' => 'تبني أنظمة الاحتفاظ بالعملاء.'],
            'photo_label' => ['en' => 'Add photo', 'fr' => 'Ajouter une photo', 'ar' => 'أضف صورة'],
            'initials' => 'JD',
            'linkedin_url' => 'https://linkedin.com/in/jane',
            'x_url' => null,
            'website_url' => 'https://example.com',
            'position' => $position,
            'is_active' => $active,
        ];
    }

    private function photoUpload(string $name): UploadedFile
    {
        return UploadedFile::fake()->createWithContent($name, $this->pngContents());
    }

    private function pngContents(): string
    {
        return base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=');
    }
}
