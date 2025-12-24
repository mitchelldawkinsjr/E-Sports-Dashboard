<?php

namespace App\Services;

use App\Domains\Competition\Models\Team;
use App\Domains\MatchOps\Models\GameMatch as MatchModel;
use App\Domains\Reporting\Models\StandingsSnapshot;
use App\Domains\Competition\Models\Season;

class StandingsService
{
    public function computeStandings($orgId, $seasonId, $divisionId = null)
    {
        // Get all teams in the season/division
        $teamsQuery = Team::where('organization_id', $orgId)
            ->where('season_id', $seasonId);
        
        if ($divisionId) {
            $teamsQuery->where('division_id', $divisionId);
        }
        
        $teams = $teamsQuery->get();
        
        // Initialize standings for each team
        $standings = [];
        foreach ($teams as $team) {
            $standings[$team->id] = [
                'team_id' => $team->id,
                'team_name' => $team->name,
                'wins' => 0,
                'losses' => 0,
                'draws' => 0,
                'points' => 0,
                'matches_played' => 0,
                'win_percentage' => 0,
            ];
        }
        
        // Get all confirmed matches for this season/division
        $matchesQuery = MatchModel::where('organization_id', $orgId)
            ->where('season_id', $seasonId)
            ->where('status', 'results_confirmed');
        
        if ($divisionId) {
            $matchesQuery->where('division_id', $divisionId);
        }
        
        $matches = $matchesQuery->with(['participants.team', 'resultSubmissions'])->get();
        
        // Process each match
        foreach ($matches as $match) {
            $participants = $match->participants;
            if ($participants->count() !== 2) {
                continue; // Skip matches without exactly 2 participants
            }
            
            $team1 = $participants->first();
            $team2 = $participants->last();
            
            // Get result submissions
            $submission1 = $match->resultSubmissions()
                ->where('team_id', $team1->team_id)
                ->first();
            $submission2 = $match->resultSubmissions()
                ->where('team_id', $team2->team_id)
                ->first();
            
            if (!$submission1 || !$submission2) {
                continue; // Skip if no submissions
            }
            
            // Get scores - each submission has scores as array [game1, game2, ...] where 1=win, 0=loss
            $scores1 = $submission1->scores ?? [];
            $scores2 = $submission2->scores ?? [];
            
            // Ensure scores are arrays
            if (!is_array($scores1)) {
                $scores1 = [$scores1 ?? 0];
            }
            if (!is_array($scores2)) {
                $scores2 = [$scores2 ?? 0];
            }
            
            // Calculate wins - count games won (score = 1 means win)
            $wins1 = array_sum($scores1); // Sum of 1s = number of wins
            $wins2 = array_sum($scores2);
            
            // If both teams have same number of wins, it's a draw
            // Otherwise, the team with more wins wins the match
            
            // Update standings
            if (isset($standings[$team1->team_id])) {
                $standings[$team1->team_id]['matches_played']++;
                if ($wins1 > $wins2) {
                    $standings[$team1->team_id]['wins']++;
                    $standings[$team1->team_id]['points'] += 3; // 3 points for win
                } elseif ($wins2 > $wins1) {
                    $standings[$team1->team_id]['losses']++;
                } else {
                    $standings[$team1->team_id]['draws']++;
                    $standings[$team1->team_id]['points'] += 1; // 1 point for draw
                }
            }
            
            if (isset($standings[$team2->team_id])) {
                $standings[$team2->team_id]['matches_played']++;
                if ($wins2 > $wins1) {
                    $standings[$team2->team_id]['wins']++;
                    $standings[$team2->team_id]['points'] += 3;
                } elseif ($wins1 > $wins2) {
                    $standings[$team2->team_id]['losses']++;
                } else {
                    $standings[$team2->team_id]['draws']++;
                    $standings[$team2->team_id]['points'] += 1;
                }
            }
        }
        
        // Calculate win percentage
        foreach ($standings as &$standing) {
            if ($standing['matches_played'] > 0) {
                $standing['win_percentage'] = round(
                    ($standing['wins'] / $standing['matches_played']) * 100,
                    2
                );
            }
        }
        
        // Sort by points (desc), then wins (desc), then win percentage (desc)
        usort($standings, function ($a, $b) {
            if ($b['points'] !== $a['points']) {
                return $b['points'] <=> $a['points'];
            }
            if ($b['wins'] !== $a['wins']) {
                return $b['wins'] <=> $a['wins'];
            }
            return $b['win_percentage'] <=> $a['win_percentage'];
        });
        
        // Save snapshot
        $snapshot = StandingsSnapshot::updateOrCreate(
            [
                'organization_id' => $orgId,
                'season_id' => $seasonId,
                'division_id' => $divisionId,
            ],
            [
                'standings_data' => array_values($standings),
                'computed_at' => now(),
            ]
        );
        
        return $snapshot;
    }
}

