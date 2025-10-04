<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTournamentRequest;
use App\Http\Requests\Admin\UpdateTournamentRequest;
use App\Models\Tournament;
use App\Models\Game;
use App\Models\User;
use Inertia\Inertia;

class AdminTournamentController extends Controller
{
    public function index()
    {
        $tournaments = Tournament::with(['game', 'registrations'])
            ->withCount('registrations')
            ->orderBy('created_at', 'desc')
            ->get();

        $games = Game::select('id', 'name', 'image')->get();

        return Inertia::render('Admin/Tournaments/Index', [
            'tournaments' => $tournaments,
            'games' => $games,
        ]);
    }

    public function store(StoreTournamentRequest $request)
    {
        $data = $request->validated();

        if (!$data['has_registration_limit']) {
            $data['registration_limit'] = null;
        }

        if ($request->hasFile('image')) {
            $data['image'] = $this->uploadImage($request->file('image'), 'tournaments');
        }

        Tournament::create($data);

        return redirect()->route('admin.tournaments.index')
            ->with('success', 'Torneo creado exitosamente.');
    }

    public function show(string $id)
    {
        $tournament = Tournament::with([
            'game',
            'registrations.user' => fn($q) => $q->select('id', 'name', 'email')
        ])->findOrFail($id);

        // IMPORTANTE: Pasar users y games para los modales
        $users = User::select('id', 'name', 'email')->orderBy('name')->get();
        $games = Game::select('id', 'name', 'image')->orderBy('name')->get();

        return Inertia::render('Admin/Tournaments/Show', [
            'tournament' => $tournament,
            'registrations' => $tournament->registrations,
            'users' => $users,
            'games' => $games,
        ]);
    }

    public function update(UpdateTournamentRequest $request, string $id)
    {
        $tournament = Tournament::findOrFail($id);
        $data = $request->validated();

        if (!$data['has_registration_limit']) {
            $data['registration_limit'] = null;
        }

        if ($request->hasFile('image')) {
            $data['image'] = $this->uploadImage($request->file('image'), 'tournaments');
        } else {
            unset($data['image']);
        }

        $tournament->update($data);

        return redirect()->route('admin.tournaments.index')
            ->with('success', 'Torneo actualizado exitosamente.');
    }

    public function destroy(string $id)
    {
        Tournament::findOrFail($id)->delete();

        return redirect()->route('admin.tournaments.index')
            ->with('success', 'Torneo eliminado exitosamente.');
    }

    private function uploadImage($file, string $folder): string
    {
        $name = time() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path("uploads/{$folder}"), $name);
        return "/uploads/{$folder}/{$name}";
    }
}
