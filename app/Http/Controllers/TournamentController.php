<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TournamentController extends Controller
{
    /**
     * Display a listing of tournaments.
     */
    public function index(Request $request)
    {
        $query = Tournament::with(['game', 'registrations.user'])
            ->withCount('registrations');

        // Filter by game if provided
        if ($request->has('game_id')) {
            $query->where('game_id', $request->game_id);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $tournaments = $query->active()
            ->orderBy('start_date', 'asc')
            ->get();

        return Inertia::render('Tournaments/Index', [
            'tournaments' => $tournaments,
            'filters' => $request->only(['game_id', 'status'])
        ]);
    }

    /**
     * Display the specified tournament.
     */
    public function show(Tournament $tournament)
    {
        $tournament->load([
            'game',
            'registrations.user' => function ($query) {
                $query->select('id', 'name', 'email');
            }
        ]);

        $userRegistration = null;
        if (auth()->check()) {
            $userRegistration = $tournament->registrations()
                ->where('user_id', auth()->id())
                ->first();
        }

        return Inertia::render('Tournaments/Show', [
            'tournament' => $tournament,
            'userRegistration' => $userRegistration,
            'canRegister' => $this->canUserRegister($tournament)
        ]);
    }

    /**
     * Check if the current user can register for the tournament.
     */
    private function canUserRegister(Tournament $tournament): bool
    {
        if (!auth()->check()) {
            return false;
        }

        if ($tournament->status !== 'active') {
            return false;
        }

        if ($tournament->registration_ends_at && now()->isAfter($tournament->registration_ends_at)) {
            return false;
        }

        // Check if user is already registered
        $existingRegistration = $tournament->registrations()
            ->where('user_id', auth()->id())
            ->first();

        return !$existingRegistration;
    }
}
