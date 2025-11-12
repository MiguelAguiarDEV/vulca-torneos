<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Game;

class AdminController extends Controller
{
    /**
     * Show admin dashboard
     *
     * Optimized: Removed redundant authentication and authorization checks.
     * These are now handled by middleware (auth and admin) in routes.
     * This follows Single Responsibility Principle and reduces execution time.
     *
     * @return Response
     */
    public function index(): Response
    {

        return Inertia::render('Admin/index', [
            'games' => Game::all(),
        ]);
    }
}
