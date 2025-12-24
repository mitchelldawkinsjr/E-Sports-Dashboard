<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->user();
        $user->load(['organizationMembers.organization', 'playerProfile']);

        return response()->json($user);
    }
}

