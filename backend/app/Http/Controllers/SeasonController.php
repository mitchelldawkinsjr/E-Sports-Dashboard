<?php

namespace App\Http\Controllers;

use App\Domains\Competition\Models\Season;
use Illuminate\Http\Request;

class SeasonController extends Controller
{
    public function index(Request $request, $orgId)
    {
        $seasons = Season::where('organization_id', $orgId)
            ->with(['gameTitle', 'rulesetPreset'])
            ->paginate();

        return response()->json($seasons);
    }

    public function store(Request $request, $orgId)
    {
        $validated = $request->validate([
            'game_title_id' => 'required|exists:game_titles,id',
            'ruleset_preset_id' => 'nullable|exists:ruleset_presets,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $validated['organization_id'] = $orgId;
        $validated['status'] = 'draft';

        $season = Season::create($validated);

        return response()->json($season, 201);
    }

    public function show(Request $request, $orgId, $seasonId)
    {
        $season = Season::where('organization_id', $orgId)
            ->with(['gameTitle', 'rulesetPreset', 'divisions', 'teams'])
            ->findOrFail($seasonId);

        return response()->json($season);
    }
}
