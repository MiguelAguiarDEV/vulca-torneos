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
     * Muestra la lista de torneos públicos.
     */
    public function publicIndex(Request $request)
    {
        $query = Tournament::with(['game', 'registrations.user'])
            ->withCount('registrations');

        // Filtros
        if ($request->filled('game_id')) {
            $query->where('game_id', $request->game_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Solo torneos activos y publicados
        $tournaments = $query->whereIn('status', ['published', 'registration_open', 'ongoing'])
            ->orderBy('start_date', 'asc')
            ->paginate(12);

        $games = Game::select('id', 'name', 'image')->get();

        return Inertia::render('Tournaments/Index', [
            'tournaments' => $tournaments,
            'games' => $games,
            'filters' => $request->only(['game_id', 'status', 'search'])
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
     * MÉTODOS PRIVADOS
     * =====================================================
     */

    /**
     * Registra al usuario autenticado en un torneo.
     */
    public function register(Request $request, Tournament $tournament)
    {
        // Verificar que el usuario esté autenticado
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Debes iniciar sesión para registrarte en un torneo.'
            ], 401);
        }

        $user = auth()->user();

        // Verificar que el usuario puede registrarse
        if (!$this->canUserRegister($tournament)) {
            return response()->json([
                'message' => 'No puedes registrarte en este torneo en este momento.'
            ], 422);
        }

        try {
            // Crear la inscripción
            $registration = $tournament->registrations()->create([
                'user_id' => $user->id,
                'registration_date' => now(),
                'payment_status' => $tournament->entry_fee > 0 ? 'pending' : 'completed',
                'amount_paid' => $tournament->entry_fee ?? 0,
            ]);

            return response()->json([
                'message' => 'Te has registrado exitosamente en el torneo.',
                'registration' => $registration->load('user'),
                'tournament' => $tournament->fresh(['registrations.user'])->withCount('registrations')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al registrarte en el torneo. Inténtalo de nuevo.'
            ], 500);
        }
    }

    /**
     * Cancela la inscripción del usuario en un torneo.
     */
    public function unregister(Request $request, Tournament $tournament)
    {
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Debes iniciar sesión para cancelar tu inscripción.'
            ], 401);
        }

        $user = auth()->user();

        $registration = $tournament->registrations()
            ->where('user_id', $user->id)
            ->first();

        if (!$registration) {
            return response()->json([
                'message' => 'No estás registrado en este torneo.'
            ], 422);
        }

        // Verificar que el torneo aún permite cancelaciones
        if ($tournament->start_date && now()->isAfter($tournament->start_date)) {
            return response()->json([
                'message' => 'No puedes cancelar tu inscripción una vez que el torneo ha comenzado.'
            ], 422);
        }

        try {
            $registration->delete();

            return response()->json([
                'message' => 'Has cancelado tu inscripción exitosamente.',
                'tournament' => $tournament->fresh(['registrations.user'])->withCount('registrations')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al cancelar tu inscripción. Inténtalo de nuevo.'
            ], 500);
        }
    }

    /**
     * Determina si un usuario puede registrarse en un torneo.
     */
    private function canUserRegister(Tournament $tournament): bool
    {
        if (!auth()->check()) {
            return false;
        }

        if (!$tournament->isRegistrationOpen()) {
            return false;
        }

        if ($tournament->start_date && now()->isAfter($tournament->start_date)) {
            return false;
        }

        if ($tournament->isRegistrationFull()) {
            return false;
        }

        $existingRegistration = $tournament->registrations()
            ->where('user_id', auth()->id())
            ->first();

        return !$existingRegistration;
    }
}
