<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Auth routes
    Route::post('/auth/login', [\App\Http\Controllers\AuthController::class, 'login']);
    Route::post('/auth/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->middleware('auth:sanctum');

    // Organization routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/orgs', [\App\Http\Controllers\OrganizationController::class, 'index']);
        Route::post('/orgs', [\App\Http\Controllers\OrganizationController::class, 'store']);
        Route::get('/orgs/{orgId}', [\App\Http\Controllers\OrganizationController::class, 'show']);
        Route::put('/orgs/{orgId}', [\App\Http\Controllers\OrganizationController::class, 'update']);

        // Organization members and invites
        Route::post('/orgs/{orgId}/invites', [\App\Http\Controllers\InviteController::class, 'store']);
        Route::post('/orgs/{orgId}/members/{memberId}/roles', [\App\Http\Controllers\OrganizationMemberController::class, 'updateRoles']);

        // Competition routes
        Route::get('/orgs/{orgId}/seasons', [\App\Http\Controllers\SeasonController::class, 'index']);
        Route::post('/orgs/{orgId}/seasons', [\App\Http\Controllers\SeasonController::class, 'store']);
        Route::get('/orgs/{orgId}/seasons/{seasonId}', [\App\Http\Controllers\SeasonController::class, 'show']);

        Route::post('/orgs/{orgId}/divisions', [\App\Http\Controllers\DivisionController::class, 'store']);
        Route::post('/orgs/{orgId}/teams', [\App\Http\Controllers\TeamController::class, 'store']);
        Route::get('/orgs/{orgId}/teams', [\App\Http\Controllers\TeamController::class, 'index']);
        Route::get('/orgs/{orgId}/teams/{teamId}', [\App\Http\Controllers\TeamController::class, 'show']);

        // Player profiles
        Route::get('/orgs/{orgId}/player-profiles', [\App\Http\Controllers\PlayerProfileController::class, 'index']);
        Route::post('/orgs/{orgId}/player-profiles', [\App\Http\Controllers\PlayerProfileController::class, 'store']);

        // Roster management
        Route::get('/orgs/{orgId}/teams/{teamId}/roster', [\App\Http\Controllers\RosterController::class, 'index']);
        Route::post('/orgs/{orgId}/teams/{teamId}/roster', [\App\Http\Controllers\RosterController::class, 'store']);
        Route::delete('/orgs/{orgId}/teams/{teamId}/roster/{rosterId}', [\App\Http\Controllers\RosterController::class, 'destroy']);

        // Match routes
        Route::get('/orgs/{orgId}/matches', [\App\Http\Controllers\MatchController::class, 'index']);
        Route::post('/orgs/{orgId}/matches', [\App\Http\Controllers\MatchController::class, 'store']);
        Route::get('/orgs/{orgId}/matches/{matchId}', [\App\Http\Controllers\MatchController::class, 'show']);
        Route::post('/orgs/{orgId}/matches/{matchId}/submit-result', [\App\Http\Controllers\MatchController::class, 'submitResult']);
        Route::post('/orgs/{orgId}/matches/{matchId}/confirm-result', [\App\Http\Controllers\MatchController::class, 'confirmResult']);
        Route::post('/orgs/{orgId}/matches/{matchId}/disputes', [\App\Http\Controllers\DisputeController::class, 'store']);

        // Standings routes
        Route::get('/orgs/{orgId}/seasons/{seasonId}/standings', [\App\Http\Controllers\StandingsController::class, 'show']);
        Route::post('/orgs/{orgId}/seasons/{seasonId}/recompute-standings', [\App\Http\Controllers\StandingsController::class, 'recompute']);

        // Announcements and notifications
        Route::post('/orgs/{orgId}/announcements', [\App\Http\Controllers\AnnouncementController::class, 'store']);
        Route::get('/orgs/{orgId}/announcements', [\App\Http\Controllers\AnnouncementController::class, 'index']);
        Route::get('/me/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
        Route::post('/me/notifications/{notification}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);
        Route::post('/me/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
        Route::get('/me', [\App\Http\Controllers\UserController::class, 'me']);
    });
});

