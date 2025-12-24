<?php

namespace App\Http\Controllers;

use App\Domains\IdentityAccess\Models\Organization;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    public function index(Request $request)
    {
        $organizations = $request->user()
            ->organizationMembers()
            ->with('organization')
            ->where('is_active', true)
            ->get()
            ->pluck('organization')
            ->filter();

        return response()->json(['data' => $organizations->values()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:organizations,slug',
            'description' => 'nullable|string',
        ]);

        $organization = Organization::create($validated);

        // Create membership for creator
        $organization->members()->create([
            'user_id' => $request->user()->id,
            'is_active' => true,
            'joined_at' => now(),
        ]);

        return response()->json($organization, 201);
    }

    public function show(Request $request, $orgId)
    {
        $organization = Organization::findOrFail($orgId);

        return response()->json($organization);
    }

    public function update(Request $request, $orgId)
    {
        $organization = Organization::findOrFail($orgId);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'logo_url' => 'nullable|url',
            'settings' => 'nullable|array',
        ]);

        $organization->update($validated);

        return response()->json($organization);
    }
}
