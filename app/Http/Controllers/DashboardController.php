<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Tournament;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the user dashboard.
     */
    public function index()
    {
        $user = Auth::user();

        // Get user's recent registrations
        $recentRegistrations = Registration::with(['tournament.game'])
            ->where('user_id', $user->id)
            ->orderBy('registered_at', 'desc')
            ->limit(5)
            ->get();

        // Get upcoming tournaments the user can join
        $upcomingTournaments = Tournament::with(['game'])
            ->active()
            ->where('start_date', '>', now())
            ->whereDoesntHave('registrations', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->orderBy('start_date', 'asc')
            ->limit(6)
            ->get();

        // Get featured games (games with most active tournaments)
        $featuredGames = Game::whereHas('tournaments', function ($query) {
            $query->active();
        })
        ->withCount(['tournaments' => function ($query) {
            $query->active();
        }])
        ->orderBy('tournaments_count', 'desc')
        ->limit(4)
        ->get();

        // Stats for the user
        $stats = [
            'total_registrations' => Registration::where('user_id', $user->id)->count(),
            'active_registrations' => Registration::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->count(),
            'completed_tournaments' => Registration::where('user_id', $user->id)
                ->whereHas('tournament', function ($query) {
                    $query->where('status', 'completed');
                })
                ->count(),
        ];

        return Inertia::render('dashboard', [
            'recentRegistrations' => $recentRegistrations,
            'upcomingTournaments' => $upcomingTournaments,
            'featuredGames' => $featuredGames,
            'stats' => $stats
        ]);
    }
}
