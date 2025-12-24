<?php

namespace Database\Seeders;

use App\Domains\Competition\Models\GameTitle;
use App\Domains\Competition\Models\Division;
use App\Domains\Competition\Models\Season;
use App\Domains\Competition\Models\Team;
use App\Domains\IdentityAccess\Models\Organization;
use App\Domains\IdentityAccess\Models\Role;
use App\Domains\MatchOps\Models\GameMatch;
use App\Domains\MatchOps\Models\MatchParticipant;
use App\Domains\MatchOps\Models\ResultSubmission;
use App\Models\User;
use App\Services\StandingsService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create demo user
        $user = User::firstOrCreate(
            ['email' => 'admin@esports.local'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
            ]
        );

        // Create demo organization
        $org = Organization::firstOrCreate(
            ['slug' => 'demo-org'],
            [
                'name' => 'Demo Esports Organization',
                'description' => 'A demo organization for testing',
                'is_active' => true,
            ]
        );

        // Create roles
        $roles = [
            ['name' => 'Platform Admin', 'slug' => 'platform-admin', 'description' => 'Full platform access'],
            ['name' => 'Org Admin', 'slug' => 'org-admin', 'description' => 'Organization administrator'],
            ['name' => 'Coach', 'slug' => 'coach', 'description' => 'Team coach'],
            ['name' => 'Player', 'slug' => 'player', 'description' => 'Team player'],
            ['name' => 'League Official', 'slug' => 'league-official', 'description' => 'League official'],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(
                ['slug' => $roleData['slug']],
                $roleData
            );
        }

        // Get org admin role
        $orgAdminRole = Role::where('slug', 'org-admin')->first();

        // Create organization member
        $org->members()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'role_id' => $orgAdminRole?->id,
                'is_active' => true,
                'joined_at' => now(),
            ]
        );

        // Create some game titles
        $games = [
            ['name' => 'League of Legends', 'slug' => 'league-of-legends', 'publisher' => 'Riot Games'],
            ['name' => 'Valorant', 'slug' => 'valorant', 'publisher' => 'Riot Games'],
            ['name' => 'Counter-Strike 2', 'slug' => 'counter-strike-2', 'publisher' => 'Valve'],
            ['name' => 'Rocket League', 'slug' => 'rocket-league', 'publisher' => 'Psyonix'],
        ];

        foreach ($games as $game) {
            GameTitle::firstOrCreate(
                ['slug' => $game['slug']],
                array_merge($game, ['is_active' => true])
            );
        }

        // Build multiple demo orgs/seasons/teams/matches
        $leagueConfigs = [
            [
                'org' => [
                    'slug' => 'demo-org',
                    'name' => 'Demo Esports Organization',
                    'description' => 'A demo organization for testing',
                ],
                'game_slug' => 'league-of-legends',
                'season' => [
                    'slug' => 'spring-showcase',
                    'name' => 'Spring Showcase',
                    'description' => 'Showcase season with demo teams and completed matches.',
                    'start_date' => now()->subWeeks(3),
                    'end_date' => now()->addWeeks(9),
                    'status' => 'active',
                ],
                'division' => [
                    'slug' => 'premier-division',
                    'name' => 'Premier Division',
                    'description' => 'Top flight demo division',
                    'sort_order' => 1,
                ],
                'teams' => [
                    ['name' => 'Alpha Wolves', 'slug' => 'alpha-wolves', 'logo_url' => null],
                    ['name' => 'Crimson Phoenix', 'slug' => 'crimson-phoenix', 'logo_url' => null],
                    ['name' => 'Neon Knights', 'slug' => 'neon-knights', 'logo_url' => null],
                    ['name' => 'Silver Serpents', 'slug' => 'silver-serpents', 'logo_url' => null],
                ],
                'matches' => [
                    [
                        'name' => 'Week 1: Alpha Wolves vs Crimson Phoenix',
                        'home' => 'alpha-wolves',
                        'away' => 'crimson-phoenix',
                        'homeScores' => [1, 1],
                        'awayScores' => [0, 0],
                        'scheduled_at' => now()->subWeeks(2)->setTime(19, 0),
                    ],
                    [
                        'name' => 'Week 2: Neon Knights vs Silver Serpents',
                        'home' => 'neon-knights',
                        'away' => 'silver-serpents',
                        'homeScores' => [1, 0, 1],
                        'awayScores' => [0, 1, 0],
                        'scheduled_at' => now()->subWeek()->setTime(19, 0),
                    ],
                    [
                        'name' => 'Week 3: Alpha Wolves vs Neon Knights',
                        'home' => 'alpha-wolves',
                        'away' => 'neon-knights',
                        'homeScores' => [1, 0, 1],
                        'awayScores' => [0, 1, 0],
                        'scheduled_at' => now()->subDays(2)->setTime(19, 0),
                    ],
                    [
                        'name' => 'Week 4: Crimson Phoenix vs Silver Serpents',
                        'home' => 'crimson-phoenix',
                        'away' => 'silver-serpents',
                        'homeScores' => [0, 1, 0],
                        'awayScores' => [1, 0, 1],
                        'scheduled_at' => now()->addDays(3)->setTime(19, 0),
                    ],
                    [
                        'name' => 'Week 5: Silver Serpents vs Alpha Wolves',
                        'home' => 'silver-serpents',
                        'away' => 'alpha-wolves',
                        'homeScores' => [0, 1, 0],
                        'awayScores' => [1, 0, 1],
                        'scheduled_at' => now()->addDays(5)->setTime(19, 30),
                    ],
                    [
                        'name' => 'Week 6: Crimson Phoenix vs Neon Knights',
                        'home' => 'crimson-phoenix',
                        'away' => 'neon-knights',
                        'homeScores' => [1, 0, 0],
                        'awayScores' => [0, 1, 1],
                        'scheduled_at' => now()->addWeek()->setTime(20, 0),
                    ],
                ],
            ],
            [
                'org' => [
                    'slug' => 'coastal-esports',
                    'name' => 'Coastal Esports',
                    'description' => 'Regional Valorant circuit',
                ],
                'game_slug' => 'valorant',
                'season' => [
                    'slug' => 'valorant-circuit',
                    'name' => 'Valorant Circuit',
                    'description' => 'Coastal split with tightly contested bo3s.',
                    'start_date' => now()->subWeeks(4),
                    'end_date' => now()->addWeeks(8),
                    'status' => 'active',
                ],
                'division' => [
                    'slug' => 'coastal-division',
                    'name' => 'Coastal Division',
                    'description' => 'Regional qualifier division',
                    'sort_order' => 1,
                ],
                'teams' => [
                    ['name' => 'Quantum Strikers', 'slug' => 'quantum-strikers', 'logo_url' => null],
                    ['name' => 'Blue Barracudas', 'slug' => 'blue-barracudas', 'logo_url' => null],
                    ['name' => 'Ironclad', 'slug' => 'ironclad', 'logo_url' => null],
                    ['name' => 'Solar Flares', 'slug' => 'solar-flares', 'logo_url' => null],
                    ['name' => 'Night Owls', 'slug' => 'night-owls', 'logo_url' => null],
                ],
                'matches' => [
                    [
                        'name' => 'Round 1: Quantum Strikers vs Blue Barracudas',
                        'home' => 'quantum-strikers',
                        'away' => 'blue-barracudas',
                        'homeScores' => [1, 0, 1],
                        'awayScores' => [0, 1, 0],
                        'scheduled_at' => now()->subWeeks(3)->setTime(20, 0),
                    ],
                    [
                        'name' => 'Round 1: Ironclad vs Solar Flares',
                        'home' => 'ironclad',
                        'away' => 'solar-flares',
                        'homeScores' => [0, 1, 0],
                        'awayScores' => [1, 0, 1],
                        'scheduled_at' => now()->subWeeks(3)->setTime(21, 0),
                    ],
                    [
                        'name' => 'Round 2: Blue Barracudas vs Night Owls',
                        'home' => 'blue-barracudas',
                        'away' => 'night-owls',
                        'homeScores' => [1, 1],
                        'awayScores' => [0, 0],
                        'scheduled_at' => now()->subWeeks(2)->setTime(20, 0),
                    ],
                    [
                        'name' => 'Round 2: Solar Flares vs Quantum Strikers',
                        'home' => 'solar-flares',
                        'away' => 'quantum-strikers',
                        'homeScores' => [0, 1, 0],
                        'awayScores' => [1, 0, 1],
                        'scheduled_at' => now()->subWeek()->setTime(20, 0),
                    ],
                    [
                        'name' => 'Round 3: Night Owls vs Ironclad',
                        'home' => 'night-owls',
                        'away' => 'ironclad',
                        'homeScores' => [1, 1, 0],
                        'awayScores' => [0, 0, 1],
                        'scheduled_at' => now()->addDays(1)->setTime(21, 0),
                    ],
                    [
                        'name' => 'Round 4: Ironclad vs Blue Barracudas',
                        'home' => 'ironclad',
                        'away' => 'blue-barracudas',
                        'homeScores' => [1, 0, 1],
                        'awayScores' => [0, 1, 0],
                        'scheduled_at' => now()->addDays(3)->setTime(20, 30),
                    ],
                    [
                        'name' => 'Round 4: Solar Flares vs Night Owls',
                        'home' => 'solar-flares',
                        'away' => 'night-owls',
                        'homeScores' => [0, 1, 0],
                        'awayScores' => [1, 0, 1],
                        'scheduled_at' => now()->addDays(4)->setTime(21, 0),
                    ],
                ],
            ],
            [
                'org' => [
                    'slug' => 'northern-collegiate',
                    'name' => 'Northern Collegiate League',
                    'description' => 'Collegiate Rocket League showcase',
                ],
                'game_slug' => 'rocket-league',
                'season' => [
                    'slug' => 'winter-cup',
                    'name' => 'Winter Cup',
                    'description' => 'Short-form Rocket League cup with quick series.',
                    'start_date' => now()->subWeeks(2),
                    'end_date' => now()->addWeeks(4),
                    'status' => 'active',
                ],
                'division' => [
                    'slug' => 'central-division',
                    'name' => 'Central Division',
                    'description' => 'Central campus rivals',
                    'sort_order' => 1,
                ],
                'teams' => [
                    ['name' => 'Frost Falcons', 'slug' => 'frost-falcons', 'logo_url' => null],
                    ['name' => 'Aurora Bears', 'slug' => 'aurora-bears', 'logo_url' => null],
                    ['name' => 'Glacier Foxes', 'slug' => 'glacier-foxes', 'logo_url' => null],
                ],
                'matches' => [
                    [
                        'name' => 'Opener: Frost Falcons vs Aurora Bears',
                        'home' => 'frost-falcons',
                        'away' => 'aurora-bears',
                        'homeScores' => [1, 1],
                        'awayScores' => [0, 0],
                        'scheduled_at' => now()->subWeeks(1)->setTime(18, 0),
                    ],
                    [
                        'name' => 'Derby: Aurora Bears vs Glacier Foxes',
                        'home' => 'aurora-bears',
                        'away' => 'glacier-foxes',
                        'homeScores' => [0, 1, 0],
                        'awayScores' => [1, 0, 1],
                        'scheduled_at' => now()->subDays(3)->setTime(18, 30),
                    ],
                    [
                        'name' => 'Showcase: Glacier Foxes vs Frost Falcons',
                        'home' => 'glacier-foxes',
                        'away' => 'frost-falcons',
                        'homeScores' => [0, 1, 0],
                        'awayScores' => [1, 0, 1],
                        'scheduled_at' => now()->addDays(2)->setTime(19, 0),
                    ],
                    [
                        'name' => 'Clash: Aurora Bears vs Frost Falcons',
                        'home' => 'aurora-bears',
                        'away' => 'frost-falcons',
                        'homeScores' => [1, 0, 1],
                        'awayScores' => [0, 1, 0],
                        'scheduled_at' => now()->addDays(6)->setTime(18, 15),
                    ],
                    [
                        'name' => 'Rematch: Glacier Foxes vs Aurora Bears',
                        'home' => 'glacier-foxes',
                        'away' => 'aurora-bears',
                        'homeScores' => [0, 1],
                        'awayScores' => [1, 0],
                        'scheduled_at' => now()->addWeek()->setTime(19, 45),
                    ],
                ],
            ],
        ];

        foreach ($leagueConfigs as $config) {
            $this->seedLeague($user, $orgAdminRole, $config);
        }

        $this->command->info('Demo data seeded successfully!');
        $this->command->info('Login with: admin@esports.local / password');
    }

    private function seedLeague(User $user, $orgAdminRole, array $config): void
    {
        $org = Organization::firstOrCreate(
            ['slug' => $config['org']['slug']],
            array_merge($config['org'], ['is_active' => true])
        );

        $org->members()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'role_id' => $orgAdminRole?->id,
                'is_active' => true,
                'joined_at' => now(),
            ]
        );

        $game = GameTitle::where('slug', $config['game_slug'])->first();

        $season = Season::firstOrCreate(
            [
                'organization_id' => $org->id,
                'slug' => $config['season']['slug'],
            ],
            [
                'game_title_id' => $game?->id,
                'name' => $config['season']['name'],
                'description' => $config['season']['description'] ?? null,
                'start_date' => $config['season']['start_date'] ?? Carbon::now(),
                'end_date' => $config['season']['end_date'] ?? Carbon::now()->addWeeks(8),
                'status' => $config['season']['status'] ?? 'active',
            ]
        );

        $division = Division::firstOrCreate(
            [
                'organization_id' => $org->id,
                'season_id' => $season->id,
                'slug' => $config['division']['slug'],
            ],
            [
                'name' => $config['division']['name'],
                'description' => $config['division']['description'] ?? null,
                'sort_order' => $config['division']['sort_order'] ?? 1,
            ]
        );

        $teams = [];
        foreach ($config['teams'] as $team) {
            $teams[] = Team::firstOrCreate(
                [
                    'organization_id' => $org->id,
                    'season_id' => $season->id,
                    'division_id' => $division->id,
                    'slug' => $team['slug'],
                ],
                array_merge($team, [
                    'description' => $team['description'] ?? 'Demo roster for showcase play',
                    'is_active' => true,
                ])
            );
        }

        $teamBySlug = collect($teams)->keyBy('slug');

        foreach ($config['matches'] as $data) {
            $home = $teamBySlug[$data['home']] ?? null;
            $away = $teamBySlug[$data['away']] ?? null;
            if (!$home || !$away) {
                continue;
            }

            $match = GameMatch::firstOrCreate(
                [
                    'organization_id' => $org->id,
                    'season_id' => $season->id,
                    'division_id' => $division->id,
                    'name' => $data['name'],
                ],
                [
                    'status' => 'results_confirmed',
                    'scheduled_at' => $data['scheduled_at'] ?? Carbon::now(),
                    'best_of' => max(count($data['homeScores']), count($data['awayScores'])),
                    'map_pool' => [],
                    'notes' => $data['notes'] ?? 'Pre-seeded demo match with confirmed results.',
                ]
            );

            MatchParticipant::updateOrCreate(
                [
                    'match_id' => $match->id,
                    'team_id' => $home->id,
                ],
                [
                    'organization_id' => $org->id,
                    'side' => 'home',
                    'score' => array_sum($data['homeScores']),
                    'is_winner' => array_sum($data['homeScores']) > array_sum($data['awayScores']),
                ]
            );

            MatchParticipant::updateOrCreate(
                [
                    'match_id' => $match->id,
                    'team_id' => $away->id,
                ],
                [
                    'organization_id' => $org->id,
                    'side' => 'away',
                    'score' => array_sum($data['awayScores']),
                    'is_winner' => array_sum($data['awayScores']) > array_sum($data['homeScores']),
                ]
            );

            ResultSubmission::updateOrCreate(
                [
                    'match_id' => $match->id,
                    'team_id' => $home->id,
                ],
                [
                    'organization_id' => $org->id,
                    'submitted_by' => $user->id,
                    'scores' => $data['homeScores'],
                    'notes' => 'Submitted by admin for demo.',
                ]
            );

            ResultSubmission::updateOrCreate(
                [
                    'match_id' => $match->id,
                    'team_id' => $away->id,
                ],
                [
                    'organization_id' => $org->id,
                    'submitted_by' => $user->id,
                    'scores' => $data['awayScores'],
                    'notes' => 'Submitted by admin for demo.',
                ]
            );
        }

        app(StandingsService::class)->computeStandings($org->id, $season->id, $division->id);
    }
}
