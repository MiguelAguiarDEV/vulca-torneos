<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;

class WelcomeController extends Controller
{
    public function index()
    {

        //Obtenemos los juegos disponibles
        $games = Game::all();

        return view('welcome', [
            'games' => $games,
        ]);
    }
}