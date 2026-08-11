<?php

namespace App\Http\Controllers;

use App\Models\BrandLogo;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BrandLogoImageController extends Controller
{
    public function __invoke(BrandLogo $brandLogo): StreamedResponse
    {
        abort_unless(Storage::disk('public')->exists($brandLogo->image_path), 404);

        return Storage::disk('public')->response(
            $brandLogo->image_path,
            null,
            ['Cache-Control' => 'public, max-age=86400'],
        );
    }
}
