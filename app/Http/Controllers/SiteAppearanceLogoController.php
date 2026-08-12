<?php

namespace App\Http\Controllers;

use App\Models\SiteAppearance;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SiteAppearanceLogoController extends Controller
{
    public function __invoke(string $mode): StreamedResponse
    {
        $appearance = SiteAppearance::query()->find(1);
        $path = $mode === 'dark'
            ? ($appearance?->dark_logo_path ?: $appearance?->light_logo_path)
            : ($appearance?->light_logo_path ?: $appearance?->dark_logo_path);

        abort_unless($path && Storage::disk('public')->exists($path), 404);

        return Storage::disk('public')->response(
            $path,
            null,
            ['Cache-Control' => 'public, max-age=31536000, immutable'],
        );
    }
}
