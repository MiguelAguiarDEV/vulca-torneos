<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\Tournament;
use App\Models\Registration;
use App\Models\User;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        // Obtener torneos destacados (con inscripciones abiertas o próximos)
        $featuredTournaments = Tournament::with(['game', 'registrations.user'])
            ->withCount('registrations')
            ->whereIn('status', ['registration_open', 'registration_closed', 'ongoing'])
            ->orderByRaw("CASE 
                WHEN status = 'registration_open' THEN 1 
                WHEN status = 'registration_closed' THEN 2 
                WHEN status = 'ongoing' THEN 3 
                ELSE 4 
                END")
            ->orderBy('start_date', 'asc')
            ->limit(6)
            ->get()
            ->map(function ($tournament) {
                return [
                    'id' => $tournament->id,
                    'name' => $tournament->name,
                    'description' => $tournament->description,
                    'image' => $tournament->image,
                    'game' => $tournament->game,
                    'start_date' => $tournament->start_date,
                    'end_date' => $tournament->end_date,
                    'registration_start' => $tournament->registration_start,
                    'registration_end' => $tournament->registration_end,
                    'entry_fee' => $tournament->entry_fee,
                    'has_registration_limit' => $tournament->has_registration_limit,
                    'registration_limit' => $tournament->registration_limit,
                    'status' => $tournament->status,
                    'registrations_count' => $tournament->registrations_count,
                ];
            });

        // Obtener juegos populares (los que tienen más torneos)
        $popularGames = Game::withCount('tournaments')
            ->having('tournaments_count', '>', 0)
            ->orderBy('tournaments_count', 'desc')
            ->limit(6)
            ->get();

        // Estadísticas generales
        $stats = [
            'totalTournaments' => Tournament::count(),
            'totalPlayers' => User::count(),
            'activeTournaments' => Tournament::whereIn('status', ['registration_open', 'registration_closed', 'ongoing'])->count(),
        ];

        return Inertia::render('Welcome', [
            'featuredTournaments' => $featuredTournaments,
            'popularGames' => $popularGames,
            'stats' => $stats,
        ]);
    }
}