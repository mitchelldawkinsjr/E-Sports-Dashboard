<?php

namespace App\Http\Controllers;

use App\Domains\Reporting\Models\StandingsSnapshot;
use App\Services\StandingsService;
use Illuminate\Http\Request;

class StandingsController extends Controller
{
    protected $standingsService;

    public function __construct(StandingsService $standingsService)
    {
        $this->standingsService = $standingsService;
    }

    public function show(Request $request, $orgId, $seasonId)
    {
        $divisionId = $request->query('division_id');

        $standings = StandingsSnapshot::where('organization_id', $orgId)
            ->where('season_id', $seasonId)
            ->when($divisionId, function ($query) use ($divisionId) {
                return $query->where('division_id', $divisionId);
            })
            ->with(['division'])
            ->orderBy('computed_at', 'desc')
            ->first();

        if (!$standings) {
            // Auto-compute if not exists
            try {
                $standings = $this->standingsService->computeStandings($orgId, $seasonId, $divisionId);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Standings not yet computed for this season',
                    'standings_data' => [],
                ]);
            }
        }

        return response()->json($standings);
    }

    public function recompute(Request $request, $orgId, $seasonId)
    {
        $divisionId = $request->input('division_id');

        $snapshot = $this->standingsService->computeStandings($orgId, $seasonId, $divisionId);

        return response()->json([
            'message' => 'Standings recomputed successfully',
            'standings' => $snapshot,
        ]);
    }
}
