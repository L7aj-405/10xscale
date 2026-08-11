<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSiteAppearanceRequest;
use App\Models\SiteAppearance;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiteAppearanceController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Dashboard/Appearance/Edit', [
            'appearance' => SiteAppearance::current(),
            'fontOptions' => [
                ['value' => 'instrument-sans', 'label' => 'Instrument Sans'],
                ['value' => 'archivo', 'label' => 'Archivo'],
            ],
            'appearanceRoutes' => [
                'update' => route('dashboard.appearance.update', absolute: false),
                'reset' => route('dashboard.appearance.reset', absolute: false),
            ],
        ]);
    }

    public function update(UpdateSiteAppearanceRequest $request): RedirectResponse
    {
        SiteAppearance::query()->updateOrCreate(
            ['id' => 1],
            $request->validated(),
        );

        return to_route('dashboard.appearance.edit')
            ->with('success', 'Site appearance updated successfully.');
    }

    public function reset(): RedirectResponse
    {
        SiteAppearance::query()->updateOrCreate(
            ['id' => 1],
            SiteAppearance::DEFAULTS,
        );

        return to_route('dashboard.appearance.edit')
            ->with('success', 'Site appearance restored to its defaults.');
    }
}
