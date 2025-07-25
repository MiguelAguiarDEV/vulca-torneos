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
            'has_registration_limit' => 'boolean',
            'registration_limit' => 'nullable|integer|min:1|required_if:has_registration_limit,true',
            'status' => 'required|in:draft,published,registration_open,registration_closed,ongoing,finished,cancelled',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

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
            'has_registration_limit' => 'boolean',
            'registration_limit' => 'nullable|integer|min:1|required_if:has_registration_limit,true',
            'status' => 'required|in:draft,published,registration_open,registration_closed,ongoing,finished,cancelled',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

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
