<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSiteAppearanceRequest;
use App\Models\SiteAppearance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class SiteAppearanceController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Dashboard/Appearance/Edit', [
            'appearance' => SiteAppearance::shared(),
            'fontOptions' => collect(SiteAppearance::FONT_OPTIONS)
                ->map(fn (string $label, string $value) => compact('value', 'label'))
                ->values(),
            'appearanceRoutes' => [
                'update' => route('dashboard.appearance.update', absolute: false),
                'reset' => route('dashboard.appearance.reset', absolute: false),
            ],
        ]);
    }

    public function update(UpdateSiteAppearanceRequest $request): RedirectResponse
    {
        $current = SiteAppearance::query()->find(1);
        $attributes = $request->safe()->except(['light_logo', 'dark_logo']);
        $newPaths = [];

        foreach (['light_logo', 'dark_logo'] as $field) {
            if (! $request->hasFile($field)) {
                continue;
            }

            $path = $request->file($field)?->store('site-appearance', 'public');

            if (! $path) {
                Storage::disk('public')->delete(array_values($newPaths));

                throw new RuntimeException('The website logo could not be stored.');
            }

            $newPaths[str_replace('_logo', '_logo_path', $field)] = $path;
        }

        try {
            $appearance = SiteAppearance::query()->updateOrCreate(
                ['id' => 1],
                [...$attributes, ...$newPaths],
            );
        } catch (Throwable $exception) {
            Storage::disk('public')->delete(array_values($newPaths));

            throw $exception;
        }

        foreach (array_keys($newPaths) as $pathField) {
            $oldPath = $current?->{$pathField};

            if ($oldPath && ! in_array($oldPath, [$appearance->light_logo_path, $appearance->dark_logo_path], true)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        return to_route('dashboard.appearance.edit')
            ->with('success', 'Site appearance updated successfully.');
    }

    public function reset(): RedirectResponse
    {
        $appearance = SiteAppearance::query()->find(1);
        $logoPaths = array_values(array_unique(array_filter([
            $appearance?->light_logo_path,
            $appearance?->dark_logo_path,
        ])));

        SiteAppearance::query()->updateOrCreate(
            ['id' => 1],
            SiteAppearance::DEFAULTS,
        );

        Storage::disk('public')->delete($logoPaths);

        return to_route('dashboard.appearance.edit')
            ->with('success', 'Site appearance restored to its defaults.');
    }
}
