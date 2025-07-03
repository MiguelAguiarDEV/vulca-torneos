<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Tournament;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }
        $stats = [
            'total_users' => User::count(),
            'total_games' => Game::count(),
            'total_tournaments' => Tournament::count(),
            'total_registrations' => Registration::count(),
            'active_tournaments' => Tournament::where('status', 'active')->count(),
            'pending_registrations' => Registration::where('status', 'pending')->count(),
        ];

        $recentRegistrations = Registration::with(['user', 'tournament.game'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $upcomingTournaments = Tournament::with(['game'])
            ->where('start_date', '>', now())
            ->orderBy('start_date', 'asc')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentRegistrations' => $recentRegistrations,
            'upcomingTournaments' => $upcomingTournaments,
        ]);
    }

    /**
     * Display games management.
     */
    public function games()
    {
        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $games = Game::withCount(['tournaments', 'tournaments as active_tournaments_count' => function ($query) {
            $query->where('status', 'active');
        }])->get();

        return Inertia::render('Admin/Games/Index', [
            'games' => $games
        ]);
    }

    /**
     * Display tournaments management.
     */
    public function tournaments()
    {
        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $tournaments = Tournament::with(['game'])
            ->withCount('registrations')
            ->orderBy('start_date', 'desc')
            ->get();

        return Inertia::render('Admin/Tournaments/Index', [
            'tournaments' => $tournaments
        ]);
    }

    /**
     * Display registrations management.
     */
    public function registrations()
    {
        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $registrations = Registration::with(['user', 'tournament.game'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Registrations/Index', [
            'registrations' => $registrations
        ]);
    }

    /**
     * Update registration status.
     */
    public function updateRegistration(Request $request, Registration $registration)
    {
        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        $registration->update([
            'status' => $request->status
        ]);

        return back()->with('success', 'Estado de inscripción actualizado correctamente.');
    }
}
