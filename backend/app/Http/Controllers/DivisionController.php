<?php

namespace App\Http\Controllers;

use App\Domains\Competition\Models\Division;
use Illuminate\Http\Request;

class DivisionController extends Controller
{
    public function store(Request $request, $orgId)
    {
        $validated = $request->validate([
            'season_id' => 'required|exists:seasons,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]);

        $validated['organization_id'] = $orgId;

        $division = Division::create($validated);

        return response()->json($division, 201);
    }
}
