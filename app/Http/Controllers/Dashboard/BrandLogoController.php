<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBrandLogoRequest;
use App\Http\Requests\UpdateBrandLogoRequest;
use App\Models\BrandLogo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class BrandLogoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard/BrandLogos/Index', [
            'brandLogos' => BrandLogo::query()
                ->ordered()
                ->get()
                ->map(fn (BrandLogo $brandLogo) => $this->serialize($brandLogo)),
            'storeUrl' => route('dashboard.brand-logos.store', absolute: false),
        ]);
    }

    public function store(StoreBrandLogoRequest $request): RedirectResponse
    {
        $attributes = $request->safe()->except('image');
        $path = $request->file('image')->store('brand-logos', 'public');

        if (! $path) {
            throw new RuntimeException('The brand logo could not be stored.');
        }

        try {
            BrandLogo::query()->create([
                ...$attributes,
                'image_path' => $path,
            ]);
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($path);

            throw $exception;
        }

        return to_route('dashboard.brand-logos.index')
            ->with('success', 'Brand logo added to the carousel.');
    }

    public function update(UpdateBrandLogoRequest $request, BrandLogo $brandLogo): RedirectResponse
    {
        $attributes = $request->safe()->except('image');
        $newPath = $request->file('image')?->store('brand-logos', 'public');
        $oldPath = $brandLogo->image_path;

        if ($request->hasFile('image') && ! $newPath) {
            throw new RuntimeException('The replacement brand logo could not be stored.');
        }

        try {
            $brandLogo->update([
                ...$attributes,
                ...($newPath ? ['image_path' => $newPath] : []),
            ]);
        } catch (Throwable $exception) {
            if ($newPath) {
                Storage::disk('public')->delete($newPath);
            }

            throw $exception;
        }

        if ($newPath) {
            Storage::disk('public')->delete($oldPath);
        }

        return to_route('dashboard.brand-logos.index')
            ->with('success', 'Brand logo updated successfully.');
    }

    public function destroy(BrandLogo $brandLogo): RedirectResponse
    {
        $path = $brandLogo->image_path;

        $brandLogo->delete();
        Storage::disk('public')->delete($path);

        return to_route('dashboard.brand-logos.index')
            ->with('success', 'Brand logo removed from the carousel.');
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(BrandLogo $brandLogo): array
    {
        return [
            'id' => $brandLogo->id,
            'name' => $brandLogo->name,
            'image_url' => route('brand-logos.image', $brandLogo, absolute: false),
            'website_url' => $brandLogo->website_url,
            'position' => $brandLogo->position,
            'is_active' => $brandLogo->is_active,
            'update_url' => route('dashboard.brand-logos.update', $brandLogo, absolute: false),
            'delete_url' => route('dashboard.brand-logos.destroy', $brandLogo, absolute: false),
        ];
    }
}
