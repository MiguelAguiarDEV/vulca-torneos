<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGameRequest;
use App\Http\Requests\Admin\UpdateGameRequest;
use App\Models\Game;
use Inertia\Inertia;

class AdminGamesController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Games/Index', [
            'games' => Game::all(),
        ]);
    }

    public function store(StoreGameRequest $request)
    {
        $data = $request->validated();
        $data['description'] = $data['description'] ?: null;

        if ($request->hasFile('image')) {
            $data['image'] = $this->uploadImage($request->file('image'), 'games');
        }

        Game::create($data);

        return redirect()->route('admin.games.index')
            ->with('success', 'Juego creado con éxito.');
    }

    public function show(string $id)
    {
        $game = Game::with([
            'tournaments' => fn($q) => $q->whereIn('status', [
                'published', 'registration_open', 'registration_closed', 'ongoing'
            ])->with(['registrations' => fn($rq) => $rq->where('status', 'confirmed')])
        ])->findOrFail($id);

        $tournaments = $game->tournaments->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'status' => $this->mapTournamentStatus($t->status),
            'original_status' => $t->status,
            'start_date' => $t->start_date?->format('d/m/Y'),
            'participants_count' => $t->registrations->count(),
        ]);

        $pendingRegistrations = $game->tournaments()
            ->with(['registrations' => fn($q) => $q->where('status', 'pending')->with(['user', 'tournament'])])
            ->get()
            ->flatMap(fn($t) => $t->registrations->map(fn($r) => [
                'id' => $r->id,
                'user_name' => $r->user->name,
                'user_email' => $r->user->email,
                'tournament_name' => $r->tournament->name,
                'registration_date' => $r->created_at->format('d/m/Y'),
                'payment_status' => $r->payment_status,
            ]));

        return Inertia::render('Admin/Games/Show', [
            'game' => $game,
            'tournaments' => $tournaments,
            'pendingRegistrations' => $pendingRegistrations,
        ]);
    }

    public function update(UpdateGameRequest $request, string $id)
    {
        $game = Game::findOrFail($id);
        $data = $request->validated();
        $data['description'] = $data['description'] ?: null;

        if ($request->hasFile('image')) {
            $data['image'] = $this->uploadImage($request->file('image'), 'games');
        } else {
            unset($data['image']);
        }

        $game->update($data);

        return redirect()->route('admin.games.index')
            ->with('success', 'Juego actualizado con éxito.');
    }

    public function destroy($id)
    {
        Game::findOrFail($id)->delete();

        return redirect()->route('admin.games.index')
            ->with('success', 'Juego eliminado con éxito.');
    }

    public function getTournaments(string $id)
    {
        $game = Game::findOrFail($id);

        $tournaments = $game->tournaments()
            ->whereIn('status', ['published', 'registration_open', 'registration_closed', 'ongoing'])
            ->with(['registrations' => fn($q) => $q->where('status', 'confirmed')])
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'status' => $this->mapTournamentStatus($t->status),
                'original_status' => $t->status,
                'start_date' => $t->start_date?->format('d/m/Y'),
                'participants_count' => $t->registrations->count(),
            ]);

        return response()->json($tournaments);
    }

    public function getRegistrations(string $id)
    {
        $game = Game::findOrFail($id);

        $registrations = $game->tournaments()
            ->with(['registrations' => fn($q) => $q->where('status', 'pending')->with(['user', 'tournament'])])
            ->get()
            ->flatMap(fn($t) => $t->registrations->map(fn($r) => [
                'id' => $r->id,
                'user_name' => $r->user->name,
                'user_email' => $r->user->email,
                'tournament_name' => $r->tournament->name,
                'registration_date' => $r->created_at->format('d/m/Y'),
                'payment_status' => $r->payment_status,
            ]));

        return response()->json($registrations);
    }

    private function uploadImage($file, string $folder): string
    {
        $name = time() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path("uploads/{$folder}"), $name);
        return "/uploads/{$folder}/{$name}";
    }

    private function mapTournamentStatus(string $status): string
    {
        return match($status) {
            'ongoing' => 'active',
            'registration_open', 'registration_closed' => 'upcoming',
            default => 'upcoming'
        };
    }
}
