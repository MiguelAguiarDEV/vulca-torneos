<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TournamentController extends Controller
{
    /**
     * =====================================================
     * MÉTODOS PÚBLICOS (No requieren autenticación)
     * =====================================================
     */

    /**
     * Muestra una lista pública de torneos con filtros.
     */
    public function publicIndex(Request $request)
    {
        $query = Tournament::with(['game', 'registrations.user'])
            ->withCount('registrations');

        if ($request->has('game_id')) {
            $query->where('game_id', $request->game_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $tournaments = $query->active()
            ->orderBy('start_date', 'asc')
            ->get();

        // Esta vista es Blade, no Inertia. Asegúrate que exista.
        return view('tournaments.index', [
            'tournaments' => $tournaments,
            'filters' => $request->only(['game_id', 'status'])
        ]);
    }

    /**
     * Muestra la página de detalles de un torneo público.
     */
    public function publicShow(string $id)
    {
        $tournament = Tournament::findOrFail($id);
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
     * =====================================================
     * MÉTODOS DE RECURSO PARA ADMIN (Protegidos por middleware)
     * =====================================================
     */

    /**
     * Muestra la lista de torneos en el panel de administración.
     */
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

    /**
     * Almacena un nuevo torneo creado desde el panel de administración.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'game_id' => 'required|exists:games,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'registration_start' => 'nullable|date',
            'entry_fee' => 'nullable|numeric|min:0',
            'status' => 'required|in:draft,published,registration_open,registration_closed,ongoing,finished,cancelled',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/tournaments'), $imageName);
            $validatedData['image'] = '/uploads/tournaments/' . $imageName;
        }

        Tournament::create($validatedData);

        return redirect()->route('admin.tournaments.index')->with('success', 'Torneo creado exitosamente.');
    }

    /**
     * Muestra los detalles de un torneo en el panel de administración.
     */
    public function show(string $id)
    {
        $tournament = Tournament::findOrFail($id);
        $tournament->load([
            'game',
            'registrations.user' => function ($query) {
                $query->select('id', 'name', 'email');
            }
        ]);

        return Inertia::render('Admin/Tournaments/Show', [
            'tournament' => $tournament,
            'registrations' => $tournament->registrations,
        ]);
    }

    /**
     * Actualiza un torneo existente desde el panel de administración.
     */
    public function update(Request $request, string $id)
    {
        $tournament = Tournament::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'game_id' => 'required|exists:games,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'registration_start' => 'nullable|date',
            'entry_fee' => 'nullable|numeric|min:0',
            'status' => 'required|in:draft,published,registration_open,registration_closed,ongoing,finished,cancelled',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/tournaments'), $imageName);
            $validatedData['image'] = '/uploads/tournaments/' . $imageName;
        } else {
            unset($validatedData['image']);
        }

        $tournament->update($validatedData);

        return redirect()->route('admin.tournaments.index')->with('success', 'Torneo actualizado exitosamente.');
    }

    /**
     * Elimina un torneo desde el panel de administración.
     */
    public function destroy(string $id)
    {
        $tournament = Tournament::findOrFail($id);
        $tournament->delete();
        return redirect()->route('admin.tournaments.index')->with('success', 'Torneo eliminado exitosamente.');
    }

    /**
     * =====================================================
     * MÉTODOS PRIVADOS
     * =====================================================
     */

    /**
     * Determina si un usuario puede registrarse en un torneo.
     */
    private function canUserRegister(Tournament $tournament): bool
    {
        if (!auth()->check()) {
            return false;
        }

        if ($tournament->status !== 'registration_open') {
            return false;
        }

        if ($tournament->start_date && now()->isAfter($tournament->start_date)) {
            return false;
        }

        $existingRegistration = $tournament->registrations()
            ->where('user_id', auth()->id())
            ->first();

        return !$existingRegistration;
    }
}
