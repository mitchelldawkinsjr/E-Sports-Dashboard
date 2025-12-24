<?php

namespace App\Http\Controllers;

use App\Domains\IdentityAccess\Models\Invite;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InviteController extends Controller
{
    public function store(Request $request, $orgId)
    {
        $request->validate([
            'email' => 'required|email',
            'role_id' => 'required|integer',
        ]);

        // Validate role exists and belongs to org (or is system role)
        $role = \App\Domains\IdentityAccess\Models\Role::find($request->role_id);
        if (!$role) {
            return response()->json([
                'message' => 'The selected role id is invalid.',
                'errors' => ['role_id' => ['The selected role id is invalid.']]
            ], 422);
        }

        // Allow system roles (organization_id is null) or roles for this org
        if ($role->organization_id !== null && $role->organization_id != $orgId) {
            return response()->json([
                'message' => 'The selected role does not belong to this organization.',
                'errors' => ['role_id' => ['The selected role does not belong to this organization.']]
            ], 422);
        }

        $validated = $request->only(['email', 'role_id']);

        $validated['organization_id'] = $orgId;
        $validated['invited_by'] = $request->user()->id;
        $validated['token'] = Str::random(64);
        $validated['expires_at'] = now()->addDays(7);

        $invite = Invite::create($validated);

        // TODO: Send email notification

        return response()->json($invite, 201);
    }
}
