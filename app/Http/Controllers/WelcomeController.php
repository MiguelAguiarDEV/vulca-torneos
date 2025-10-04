<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Welcome/index', [
            'featuredTournaments' => [],
            'popularGames' => [],
            'stats' => [
                'totalTournaments' => 0,
                'totalPlayers' => 0,
                'activeTournaments' => 0,
            ],
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }
}
