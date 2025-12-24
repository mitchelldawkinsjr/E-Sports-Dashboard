<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetOrganizationContext
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Set organization context from route parameter or user's current organization
        if ($request->route('orgId')) {
            $request->attributes->set('organization_id', $request->route('orgId'));
        } elseif ($request->user() && $request->user()->currentOrganizationId) {
            $request->attributes->set('organization_id', $request->user()->currentOrganizationId);
        }

        return $next($request);
    }
}

