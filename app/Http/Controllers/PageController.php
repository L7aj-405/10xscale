<?php

namespace App\Http\Controllers;

use App\Models\BrandLogo;
use App\Models\TeamMember;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function landing(): Response
    {
        return Inertia::render('Landing', [
            'brandLogos' => $this->brandLogos(),
            'teamMembers' => $this->teamMembers(),
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

    /**
     * @return array<int, array<string, mixed>>
     */
    private function teamMembers(): array
    {
        if (! Schema::hasTable('team_members')) {
            return [];
        }

        return TeamMember::query()
            ->where('is_active', true)
            ->ordered()
            ->get()
            ->map(fn (TeamMember $teamMember) => [
                'id' => $teamMember->id,
                'name' => $teamMember->name,
                'role' => $teamMember->role,
                'bio' => $teamMember->bio,
                'photo_label' => $teamMember->photo_label,
                'initials' => $teamMember->initials,
                'photo_url' => $teamMember->photo_path
                    ? route('team-members.photo', $teamMember, absolute: false)
                    : null,
                'linkedin_url' => $teamMember->linkedin_url,
                'x_url' => $teamMember->x_url,
                'website_url' => $teamMember->website_url,
            ])
            ->all();
    }
}
