<?php

namespace App\Http\Controllers;

use App\Domains\MatchOps\Models\GameMatch as MatchModel;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function index(Request $request, $orgId)
    {
        $matches = MatchModel::where('organization_id', $orgId)
            ->with(['season', 'participants.team', 'games'])
            ->paginate();

        return response()->json($matches);
    }

    public function store(Request $request, $orgId)
    {
        $validated = $request->validate([
            'season_id' => 'required|exists:seasons,id',
            'division_id' => 'nullable|exists:divisions,id',
            'ruleset_preset_id' => 'nullable|exists:ruleset_presets,id',
            'name' => 'nullable|string|max:255',
            'scheduled_at' => 'required|date',
            'best_of' => 'required|integer|min:1|max:7',
            'team_ids' => 'required|array|size:2',
            'team_ids.*' => 'exists:teams,id',
        ]);

        $validated['organization_id'] = $orgId;
        $validated['status'] = 'scheduled';

        $match = MatchModel::create($validated);

        // Create participants
        foreach ($validated['team_ids'] as $index => $teamId) {
            $match->participants()->create([
                'organization_id' => $orgId,
                'match_id' => $match->id,
                'team_id' => $teamId,
                'side' => $index === 0 ? 'home' : 'away',
            ]);
        }

        return response()->json($match->load('participants.team'), 201);
    }

    public function show(Request $request, $orgId, $matchId)
    {
        $match = MatchModel::where('organization_id', $orgId)
            ->with([
                'season',
                'participants.team',
                'games',
                'resultSubmissions.team',
                'resultSubmissions.submitter',
                'disputes'
            ])
            ->findOrFail($matchId);

        return response()->json($match);
    }

    public function submitResult(Request $request, $orgId, $matchId)
    {
        $match = MatchModel::where('organization_id', $orgId)
            ->with('participants.team')
            ->findOrFail($matchId);

        $validated = $request->validate([
            'scores' => 'required|array',
            'scores.*' => 'integer|min:0|max:1', // Each game: 0 for loss, 1 for win
            'notes' => 'nullable|string',
        ]);

        // Get the team ID from the match participants where user is coach
        $participant = $match->participants()
            ->whereHas('team', function ($q) use ($request) {
                $q->where('coach_id', $request->user()->id);
            })
            ->first();

        if (!$participant) {
            // Fallback: try to find team by user's organization membership
            $participant = $match->participants()->first();
            if (!$participant) {
                return response()->json(['message' => 'Unable to determine team for result submission'], 403);
            }
        }

        $teamId = $participant->team_id;

        // Check if already submitted
        $existing = $match->resultSubmissions()->where('team_id', $teamId)->first();
        if ($existing) {
            return response()->json(['message' => 'Result already submitted for this team'], 422);
        }

        $submission = $match->resultSubmissions()->create([
            'organization_id' => $orgId,
            'submitted_by' => $request->user()->id,
            'team_id' => $teamId,
            'scores' => $validated['scores'],
            'notes' => $validated['notes'] ?? null,
        ]);

        // Update match status if both teams have submitted
        $submissionCount = $match->resultSubmissions()->count();
        if ($submissionCount >= 2) {
            $match->update(['status' => 'results_submitted']);
        } else {
            $match->update(['status' => 'awaiting_results']);
        }

        return response()->json($submission->load('team', 'submitter'), 201);
    }

    public function confirmResult(Request $request, $orgId, $matchId)
    {
        $match = MatchModel::where('organization_id', $orgId)->findOrFail($matchId);

        $validated = $request->validate([
            'is_confirmed' => 'required|boolean',
            'notes' => 'nullable|string',
        ]);

        // Get team from match participants where user is coach
        $teamId = $match->participants()
            ->whereHas('team', function ($q) use ($request) {
                $q->where('coach_id', $request->user()->id);
            })
            ->firstOrFail()
            ->team_id;
        $submission = $match->resultSubmissions()->where('team_id', '!=', $teamId)->firstOrFail();

        $confirmation = $submission->confirmations()->create([
            'organization_id' => $orgId,
            'match_id' => $matchId,
            'confirmed_by' => $request->user()->id,
            'team_id' => $teamId,
            'is_confirmed' => $validated['is_confirmed'],
            'notes' => $validated['notes'] ?? null,
        ]);

        if ($validated['is_confirmed']) {
            $match->update(['status' => 'results_confirmed']);
            
            // Auto-compute standings for the season
            try {
                $standingsService = app(\App\Services\StandingsService::class);
                $standingsService->computeStandings(
                    $orgId,
                    $match->season_id,
                    $match->division_id
                );
            } catch (\Exception $e) {
                // Log error but don't fail the confirmation
                \Log::error('Failed to compute standings after match confirmation: ' . $e->getMessage());
            }
        }

        return response()->json($confirmation);
    }
}
