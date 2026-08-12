<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeamMemberRequest;
use App\Http\Requests\UpdateTeamMemberRequest;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class TeamMemberController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard/TeamMembers/Index', [
            'teamMembers' => TeamMember::query()->ordered()->get()->map(
                fn (TeamMember $teamMember) => $this->serialize($teamMember),
            ),
            'storeUrl' => route('dashboard.team-members.store', absolute: false),
        ]);
    }

    public function store(StoreTeamMemberRequest $request): RedirectResponse
    {
        $attributes = $request->safe()->except('photo');
        $path = $request->file('photo')?->store('team-members', 'public');

        if ($request->hasFile('photo') && ! $path) {
            throw new RuntimeException('The team member photo could not be stored.');
        }

        try {
            TeamMember::query()->create([
                ...$attributes,
                'photo_path' => $path,
            ]);
        } catch (Throwable $exception) {
            if ($path) {
                Storage::disk('public')->delete($path);
            }

            throw $exception;
        }

        return to_route('dashboard.team-members.index')
            ->with('success', 'Team member added successfully.');
    }

    public function update(UpdateTeamMemberRequest $request, TeamMember $teamMember): RedirectResponse
    {
        $attributes = $request->safe()->except('photo');
        $newPath = $request->file('photo')?->store('team-members', 'public');
        $oldPath = $teamMember->photo_path;

        if ($request->hasFile('photo') && ! $newPath) {
            throw new RuntimeException('The replacement team member photo could not be stored.');
        }

        try {
            $teamMember->update([
                ...$attributes,
                ...($newPath ? ['photo_path' => $newPath] : []),
            ]);
        } catch (Throwable $exception) {
            if ($newPath) {
                Storage::disk('public')->delete($newPath);
            }

            throw $exception;
        }

        if ($newPath && $oldPath) {
            Storage::disk('public')->delete($oldPath);
        }

        return to_route('dashboard.team-members.index')
            ->with('success', 'Team member updated successfully.');
    }

    public function destroy(TeamMember $teamMember): RedirectResponse
    {
        $path = $teamMember->photo_path;

        $teamMember->delete();

        if ($path) {
            Storage::disk('public')->delete($path);
        }

        return to_route('dashboard.team-members.index')
            ->with('success', 'Team member deleted successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(TeamMember $teamMember): array
    {
        return [
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
            'position' => $teamMember->position,
            'is_active' => $teamMember->is_active,
            'update_url' => route('dashboard.team-members.update', $teamMember, absolute: false),
            'delete_url' => route('dashboard.team-members.destroy', $teamMember, absolute: false),
        ];
    }
}
