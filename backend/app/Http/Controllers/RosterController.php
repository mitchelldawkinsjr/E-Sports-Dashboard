<?php

namespace App\Http\Controllers;

use App\Domains\Competition\Models\RosterEntry;
use App\Domains\Competition\Models\Team;
use Illuminate\Http\Request;

class RosterController extends Controller
{
    public function index(Request $request, $orgId, $teamId)
    {
        $team = Team::where('organization_id', $orgId)->findOrFail($teamId);

        $roster = RosterEntry::where('organization_id', $orgId)
            ->where('team_id', $teamId)
            ->with('playerProfile.user')
            ->get();

        return response()->json(['data' => $roster]);
    }

    public function store(Request $request, $orgId, $teamId)
    {
        $team = Team::where('organization_id', $orgId)->findOrFail($teamId);

        $validated = $request->validate([
            'player_profile_id' => 'required|exists:player_profiles,id',
            'position' => 'nullable|string|max:255',
            'jersey_number' => 'nullable|integer',
        ]);

        // Check if player is already on the roster
        $existing = RosterEntry::where('organization_id', $orgId)
            ->where('team_id', $teamId)
            ->where('player_profile_id', $validated['player_profile_id'])
            ->where('is_active', true)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Player is already on this team'], 422);
        }

        $validated['organization_id'] = $orgId;
        $validated['team_id'] = $teamId;
        $validated['is_active'] = true;
        $validated['joined_at'] = now();

        $rosterEntry = RosterEntry::create($validated);

        return response()->json($rosterEntry->load('playerProfile.user'), 201);
    }

    public function destroy(Request $request, $orgId, $teamId, $rosterId)
    {
        $rosterEntry = RosterEntry::where('organization_id', $orgId)
            ->where('team_id', $teamId)
            ->findOrFail($rosterId);

        $rosterEntry->update(['is_active' => false, 'left_at' => now()]);

        return response()->json(['message' => 'Player removed from roster']);
    }
}
