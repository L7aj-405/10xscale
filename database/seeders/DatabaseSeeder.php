<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if ($email && $password) {
            User::query()->updateOrCreate(
                ['email' => Str::lower($email)],
                [
                    'name' => env('ADMIN_NAME', '10Xscale Admin'),
                    'role' => UserRole::Admin,
                    'password' => $password,
                    'email_verified_at' => now(),
                ],
            );
        }
    }
}
