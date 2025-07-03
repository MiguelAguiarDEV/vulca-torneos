<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    /**
     * Display a listing of the games.
     */
    public function index()
    {
        $games = Game::with(['tournaments' => function ($query) {
            $query->active()->orderBy('start_date', 'asc');
        }])->get();

        return Inertia::render('Games/Index', [
            'games' => $games
        ]);
    }

    /**
     * Display the specified game with its tournaments.
     */
    public function show(Game $game)
    {
        $game->load([
            'tournaments' => function ($query) {
                $query->active()
                    ->withCount('registrations')
                    ->orderBy('start_date', 'asc');
            }
        ]);

        return Inertia::render('Games/Show', [
            'game' => $game
        ]);
    }
}
