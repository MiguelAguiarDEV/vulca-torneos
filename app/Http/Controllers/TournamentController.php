<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TournamentController extends Controller
{
    public function publicIndex(Request $request)
    {
        $query = Tournament::with(['game', 'registrations.user'])
            ->withCount('registrations')
            ->whereIn('status', ['published', 'registration_open', 'ongoing']);

        // Filtros
        if ($request->filled('game_id')) {
            $query->where('game_id', $request->game_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(fn($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%"));
        }

        return Inertia::render('Tournaments/Index', [
            'tournaments' => $query->orderBy('start_date', 'asc')->paginate(12),
            'games' => Game::select('id', 'name', 'image')->get(),
            'filters' => $request->only(['game_id', 'status', 'search'])
        ]);
    }

    public function publicShow(string $id)
    {
        $tournament = Tournament::with([
            'game',
            'registrations.user' => fn($q) => $q->select('id', 'name', 'email')
        ])->findOrFail($id);

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

    public function register(Request $request, Tournament $tournament)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Debes iniciar sesión.'], 401);
        }

        if (!$this->canUserRegister($tournament)) {
            return response()->json(['message' => 'No puedes registrarte en este momento.'], 422);
        }

        try {
            $registration = $tournament->registrations()->create([
                'user_id' => auth()->id(),
                'registration_date' => now(),
                'payment_status' => $tournament->entry_fee > 0 ? 'pending' : 'completed',
                'amount_paid' => $tournament->entry_fee ?? 0,
            ]);

            return response()->json([
                'message' => 'Registrado exitosamente.',
                'registration' => $registration->load('user'),
                'tournament' => $tournament->fresh(['registrations.user'])->withCount('registrations')
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al registrarte.'], 500);
        }
    }

    public function unregister(Request $request, Tournament $tournament)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Debes iniciar sesión.'], 401);
        }

        $registration = $tournament->registrations()->where('user_id', auth()->id())->first();

        if (!$registration) {
            return response()->json(['message' => 'No estás registrado.'], 422);
        }

        if ($tournament->start_date && now()->isAfter($tournament->start_date)) {
            return response()->json(['message' => 'No puedes cancelar después del inicio.'], 422);
        }

        try {
            $registration->delete();
            return response()->json([
                'message' => 'Inscripción cancelada.',
                'tournament' => $tournament->fresh(['registrations.user'])->withCount('registrations')
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al cancelar.'], 500);
        }
    }

    private function canUserRegister(Tournament $tournament): bool
    {
        return auth()->check()
            && $tournament->isRegistrationOpen()
            && !now()->isAfter($tournament->start_date)
            && !$tournament->isRegistrationFull()
            && !$tournament->registrations()->where('user_id', auth()->id())->exists();
    }
}
