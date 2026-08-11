<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_is_rendered_by_fortify(): void
    {
        $this->get('/login')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Auth/Login'));
    }

    public function test_admin_can_authenticate_and_session_is_regenerated(): void
    {
        $user = User::factory()->admin()->create([
            'email' => 'admin@example.com',
            'password' => 'SecurePassword!42',
        ]);
        $oldSessionId = session()->getId();

        $this->post('/login', [
            'email' => 'ADMIN@example.com',
            'password' => 'SecurePassword!42',
        ])->assertRedirect('/dashboard');

        $this->assertAuthenticatedAs($user);
        $this->assertNotSame($oldSessionId, session()->getId());
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        User::factory()->admin()->create(['email' => 'admin@example.com']);

        $this->from('/login')->post('/login', [
            'email' => 'admin@example.com',
            'password' => 'not-the-password',
        ])->assertRedirect('/login')->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_authenticated_user_can_log_out(): void
    {
        $user = User::factory()->admin()->create();

        $this->actingAs($user)->post('/logout')->assertRedirect('/');
        $this->assertGuest();
    }
}
