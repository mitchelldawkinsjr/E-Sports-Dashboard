<?php

namespace App\Http\Controllers;

use App\Domains\Competition\Models\PlayerProfile;
use Illuminate\Http\Request;

class PlayerProfileController extends Controller
{
    public function index(Request $request, $orgId)
    {
        $profiles = PlayerProfile::where('organization_id', $orgId)
            ->with('user')
            ->paginate();

        return response()->json($profiles);
    }

    public function store(Request $request, $orgId)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'display_name' => 'required|string|max:255',
            'in_game_name' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'grade' => 'nullable|string|max:255',
            'school' => 'nullable|string|max:255',
        ]);

        $validated['organization_id'] = $orgId;

        $profile = PlayerProfile::create($validated);

        return response()->json($profile->load('user'), 201);
    }
}

