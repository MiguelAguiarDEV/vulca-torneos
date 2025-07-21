<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controlador para la gestión pública de torneos.
 * 
 * Este controlador maneja la visualización pública de torneos TCG,
 * incluyendo listados con filtros y detalles de torneos específicos.
 * No requiere autenticación para visualizar la información.
 * 
 * @package App\Http\Controllers
 * @author Vulca Torneos Team
 */
class TournamentController extends Controller
{
    /**
     * Muestra una lista de torneos con filtros opcionales.
     * 
     * Lista todos los torneos activos con posibilidad de filtrar por
     * juego y estado. Incluye información del juego asociado y conteo
     * de inscripciones. Esta vista es pública.
     * 
     * @param \Illuminate\Http\Request $request Petición con filtros opcionales
     * @return \Illuminate\Contracts\View\View
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

        return view('tournaments.index', [
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
     * Admin methods for tournament management
     */
    public function adminIndex()
    {
        $tournaments = Tournament::with(['game', 'registrations'])
            ->withCount('registrations')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return Inertia::render('Admin/Tournaments/Index', [
            'tournaments' => $tournaments,
        ]);
    }

    public function adminShow(Tournament $tournament)
    {
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

    public function adminCreate()
    {
        $games = Game::all();
        return Inertia::render('Admin/Tournaments/Create', [
            'games' => $games,
        ]);
    }

    public function adminStore(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'game_id' => 'required|exists:games,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'registration_start' => 'nullable|date',
            'registration_end' => 'nullable|date|after:registration_start',
            'entry_fee' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/tournaments'), $imageName);
            $validatedData['image'] = '/uploads/tournaments/' . $imageName;
        }

        $validatedData['status'] = Tournament::STATUS_DRAFT;

        Tournament::create($validatedData);

        return redirect()->route('admin.tournaments.index')->with('success', 'Torneo creado exitosamente.');
    }

    public function adminEdit(Tournament $tournament)
    {
        $games = Game::all();
        return Inertia::render('Admin/Tournaments/Edit', [
            'tournament' => $tournament,
            'games' => $games,
        ]);
    }

    public function adminUpdate(Request $request, Tournament $tournament)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'game_id' => 'required|exists:games,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'registration_start' => 'nullable|date',
            'registration_end' => 'nullable|date|after:registration_start',
            'entry_fee' => 'nullable|numeric|min:0',
            'status' => 'required|in:draft,published,registration_open,registration_closed,ongoing,finished,cancelled',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/tournaments'), $imageName);
            $validatedData['image'] = '/uploads/tournaments/' . $imageName;
        } else {
            // Remove image from update data if not provided to keep current image
            unset($validatedData['image']);
        }

        $tournament->update($validatedData);

        return redirect()->route('admin.tournaments.index')->with('success', 'Torneo actualizado exitosamente.');
    }

    public function adminDestroy(Tournament $tournament)
    {
        $tournament->delete();
        return redirect()->route('admin.tournaments.index')->with('success', 'Torneo eliminado exitosamente.');
    }

    /**
     * Determina si un usuario puede registrarse en un torneo.
     * 
     * Verifica múltiples condiciones para determinar si el usuario
     * actual puede inscribirse en el torneo especificado, incluyendo
     * autenticación, estado del torneo, capacidad y inscripción previa.
     * 
     * @param \App\Models\Tournament $tournament Torneo a verificar
     * @return bool True si el usuario puede registrarse, false en caso contrario
     */
    private function canUserRegister(Tournament $tournament): bool
    {
        if (!auth()->check()) {
            return false;
        }

        if ($tournament->status !== 'registration_open') {
            return false;
        }

        if ($tournament->registration_end && now()->isAfter($tournament->registration_end)) {
            return false;
        }

        // Check if user is already registered
        $existingRegistration = $tournament->registrations()
            ->where('user_id', auth()->id())
            ->first();

        return !$existingRegistration;
    }
}
