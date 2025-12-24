<?php

namespace App\Http\Controllers;

use App\Domains\Competition\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(Request $request, $orgId)
    {
        $teams = Team::where('organization_id', $orgId)
            ->with(['season', 'division', 'conference', 'coach'])
            ->paginate();

        return response()->json($teams);
    }

    public function show(Request $request, $orgId, $teamId)
    {
        $team = Team::where('organization_id', $orgId)
            ->with(['season', 'division', 'conference', 'coach', 'rosterEntries.playerProfile.user'])
            ->findOrFail($teamId);

        return response()->json($team);
    }

    public function store(Request $request, $orgId)
    {
        $validated = $request->validate([
            'season_id' => 'required|exists:seasons,id',
            'division_id' => 'nullable|exists:divisions,id',
            'conference_id' => 'nullable|exists:conferences,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo_url' => 'nullable|url',
            'coach_id' => 'nullable|exists:users,id',
        ]);

        $validated['organization_id'] = $orgId;
        $validated['is_active'] = true;

        $team = Team::create($validated);

        return response()->json($team, 201);
    }
}
