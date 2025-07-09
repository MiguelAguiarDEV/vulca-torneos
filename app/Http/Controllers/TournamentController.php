<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
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

        if ($tournament->status !== 'active') {
            return false;
        }

        if ($tournament->registration_ends_at && now()->isAfter($tournament->registration_ends_at)) {
            return false;
        }

        // Check if user is already registered
        $existingRegistration = $tournament->registrations()
            ->where('user_id', auth()->id())
            ->first();

        return !$existingRegistration;
    }
}
