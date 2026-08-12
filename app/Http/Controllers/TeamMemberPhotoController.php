<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TeamMemberPhotoController extends Controller
{
    public function __invoke(TeamMember $teamMember): StreamedResponse
    {
        abort_unless(
            $teamMember->photo_path && Storage::disk('public')->exists($teamMember->photo_path),
            404,
        );

        return Storage::disk('public')->response(
            $teamMember->photo_path,
            null,
            ['Cache-Control' => 'public, max-age=86400'],
        );
    }
}
