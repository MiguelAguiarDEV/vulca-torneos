<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{   
    public function index()
    {
        $games = Game::all();
        return view('admin.games', compact('games'));
    }

    public function create()
    {
        return view('admin.games.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        Game::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.games.index')->with('success', 'Juego creado exitosamente.');
    }

    public function edit(Game $game)
    {
        return view('admin.games.edit', compact('game'));
    }

    public function update(Request $request, Game $game)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $game->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.games.index')->with('success', 'Juego actualizado exitosamente.');
    }

    public function destroy(Game $game)
    {
        $game->delete();
        return redirect()->route('admin.games.index')->with('success', 'Juego eliminado exitosamente.');
    }

    public function gameTournaments(Game $game)
    {
        $tournaments = $game->tournaments()->get();
        return view('games.tournaments', compact('game', 'tournaments'));
    }
}
