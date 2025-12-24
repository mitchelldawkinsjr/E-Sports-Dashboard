<?php

namespace App\Http\Controllers;

use App\Domains\Communications\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request, $orgId)
    {
        $announcements = Announcement::where('organization_id', $orgId)
            ->with(['creator', 'season'])
            ->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->paginate();

        return response()->json($announcements);
    }

    public function store(Request $request, $orgId)
    {
        $validated = $request->validate([
            'season_id' => 'nullable|exists:seasons,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'scope' => 'required|in:organization,season',
            'is_pinned' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['organization_id'] = $orgId;
        $validated['created_by'] = $request->user()->id;
        $validated['published_at'] = $validated['published_at'] ?? now();

        $announcement = Announcement::create($validated);

        return response()->json($announcement, 201);
    }
}
