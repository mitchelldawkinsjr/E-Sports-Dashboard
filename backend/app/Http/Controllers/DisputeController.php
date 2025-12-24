<?php

namespace App\Http\Controllers;

use App\Domains\MatchOps\Models\Dispute;
use App\Domains\MatchOps\Models\GameMatch as MatchModel;
use Illuminate\Http\Request;

class DisputeController extends Controller
{
    public function store(Request $request, $orgId, $matchId)
    {
        $match = MatchModel::where('organization_id', $orgId)->findOrFail($matchId);

        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'reason' => 'required|string',
            'evidence' => 'nullable|string',
        ]);

        $validated['organization_id'] = $orgId;
        $validated['match_id'] = $matchId;
        $validated['created_by'] = $request->user()->id;
        $validated['status'] = 'open';

        $dispute = Dispute::create($validated);

        // Update match status
        $match->update(['status' => 'disputed']);

        return response()->json($dispute, 201);
    }
}
