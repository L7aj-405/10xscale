<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

App\Models\User::query()->updateOrCreate(
    ['email' => 'codex-ui-check@example.test'],
    ['name' => 'Codex UI Check', 'role' => App\Enums\UserRole::Admin, 'password' => 'CodexUiCheck-2026!'],
);
