<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTournamentRequest;
use App\Http\Requests\Admin\UpdateTournamentRequest;
use App\Models\Tournament;
use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTournamentController extends Controller
{
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
    public function store(StoreTournamentRequest $request)
    {
        $validatedData = $request->validated();

        // Set registration_limit to null if has_registration_limit is false
        if (!$validatedData['has_registration_limit']) {
            $validatedData['registration_limit'] = null;
        }

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
    public function update(UpdateTournamentRequest $request, string $id)
    {
        $tournament = Tournament::findOrFail($id);

        $validatedData = $request->validated();

        // Set registration_limit to null if has_registration_limit is false
        if (!$validatedData['has_registration_limit']) {
            $validatedData['registration_limit'] = null;
        }

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
}