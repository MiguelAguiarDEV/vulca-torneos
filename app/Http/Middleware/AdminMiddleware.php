<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware to ensure the authenticated user has admin privileges.
 *
 * This middleware checks if the user is authenticated and has admin role.
 * It should be used on routes that require admin access.
 */
class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * Optimized to use direct request method instead of auth() helper
     * to reduce function call overhead.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Optimized: Use $request->user() instead of auth() helper
        // This reduces overhead by avoiding facade calls
        $user = $request->user();

        if (!$user || !$user->isAdmin()) {
            abort(403, 'Access denied. Admins only.');
        }

        return $next($request);
    }
}
