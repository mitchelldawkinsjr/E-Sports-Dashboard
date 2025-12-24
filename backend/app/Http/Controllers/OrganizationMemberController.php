<?php

namespace App\Http\Controllers;

use App\Domains\IdentityAccess\Models\OrganizationMember;
use Illuminate\Http\Request;

class OrganizationMemberController extends Controller
{
    public function updateRoles(Request $request, $orgId, $memberId)
    {
        $member = OrganizationMember::where('organization_id', $orgId)
            ->findOrFail($memberId);

        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $member->update(['role_id' => $validated['role_id']]);

        return response()->json($member->load('role'));
    }
}
