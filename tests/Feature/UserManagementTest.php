<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_a_team_user(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/dashboard/users', [
            'name' => 'Team Member',
            'email' => 'TEAM@example.com',
            'role' => 'team',
            'password' => 'SecurePassword!42',
            'password_confirmation' => 'SecurePassword!42',
        ])->assertRedirect('/dashboard/users');

        $user = User::query()->where('email', 'team@example.com')->firstOrFail();
        $this->assertSame(UserRole::Team, $user->role);
        $this->assertTrue(Hash::check('SecurePassword!42', $user->password));
    }

    public function test_admin_can_update_another_user(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();

        $this->actingAs($admin)->put("/dashboard/users/{$user->id}", [
            'name' => 'Updated User',
            'email' => 'updated@example.com',
            'role' => 'admin',
            'password' => '',
            'password_confirmation' => '',
        ])->assertRedirect('/dashboard/users');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated User',
            'email' => 'updated@example.com',
            'role' => 'admin',
        ]);
    }

    public function test_admin_can_delete_another_team_user(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();

        $this->actingAs($admin)
            ->delete("/dashboard/users/{$user->id}")
            ->assertRedirect('/dashboard/users');

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_admin_cannot_delete_or_demote_their_own_account(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->delete("/dashboard/users/{$admin->id}")
            ->assertSessionHas('error');

        $this->actingAs($admin)->from("/dashboard/users/{$admin->id}/edit")
            ->put("/dashboard/users/{$admin->id}", [
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => 'team',
                'password' => '',
                'password_confirmation' => '',
            ])
            ->assertRedirect("/dashboard/users/{$admin->id}/edit")
            ->assertSessionHasErrors('role');

        $this->assertDatabaseHas('users', ['id' => $admin->id, 'role' => 'admin']);
    }

    public function test_user_password_policy_is_enforced(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->from('/dashboard/users/create')->post('/dashboard/users', [
            'name' => 'Weak Password',
            'email' => 'weak@example.com',
            'role' => 'team',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertRedirect('/dashboard/users/create')->assertSessionHasErrors('password');
    }
}
