<?php

namespace App\Http\Controllers;

use App\Domains\Communications\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate();

        return response()->json($notifications);
    }
}
