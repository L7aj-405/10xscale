<?php

namespace App\Http\Controllers;

use App\Models\BrandLogo;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function landing(): Response
    {
        return Inertia::render('Landing', [
            'brandLogos' => $this->brandLogos(),
        ]);
    }

    public function blog(): Response
    {
        return Inertia::render('Blog');
    }

    public function thankYou(): Response
    {
        return Inertia::render('ThankYou');
    }

    public function legal(string $document): Response
    {
        return Inertia::render('Legal', [
            'document' => $document,
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function brandLogos(): array
    {
        if (! Schema::hasTable('brand_logos')) {
            return [];
        }

        return BrandLogo::query()
            ->where('is_active', true)
            ->ordered()
            ->get()
            ->map(fn (BrandLogo $brandLogo) => [
                'id' => $brandLogo->id,
                'name' => $brandLogo->name,
                'image_url' => route('brand-logos.image', $brandLogo, absolute: false),
                'website_url' => $brandLogo->website_url,
            ])
            ->all();
    }
}
