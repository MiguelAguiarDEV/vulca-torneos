<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRegistrationRequest;
use App\Models\Registration;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    /**
     * Display the user's registrations.
     */
    public function index()
    {
        $registrations = Registration::with(['tournament.game'])
            ->where('user_id', Auth::id())
            ->orderBy('registered_at', 'desc')
            ->get();

        return Inertia::render('Registrations/Index', [
            'registrations' => $registrations
        ]);
    }

    /**
     * Store a newly created registration.
     */
    public function store(StoreRegistrationRequest $request)
    {
        $validated = $request->validated();

        try {
            Registration::create([
                'user_id' => Auth::id(),
                'tournament_id' => $validated['tournament_id'],
                'status' => 'pending'
            ]);

            return back()->with('success', 'Te has inscrito correctamente al torneo.');
        } catch (\Exception $e) {
            return back()->withErrors(['tournament' => 'Error al procesar la inscripción.']);
        }
    }

    /**
     * Update the specified registration (change status).
     */
    public function update(Request $request, Registration $registration)
    {
        // Check if user owns this registration
        if ($registration->user_id !== Auth::id()) {
            abort(403, 'No tienes permiso para modificar esta inscripción.');
        }

        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        // Only allow cancellation by regular users
        if (!Auth::user()->isAdmin() && $request->status !== 'cancelled') {
            return back()->withErrors(['status' => 'Solo puedes cancelar tu inscripción.']);
        }

        $registration->update([
            'status' => $request->status
        ]);

        $message = $request->status === 'cancelled' 
            ? 'Inscripción cancelada correctamente.' 
            : 'Estado de inscripción actualizado.';

        return back()->with('success', $message);
    }

    /**
     * Remove the specified registration.
     */
    public function destroy(Registration $registration)
    {
        // Check if user owns this registration or is admin
        if ($registration->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403, 'No tienes permiso para eliminar esta inscripción.');
        }

        $registration->delete();

        return back()->with('success', 'Inscripción eliminada correctamente.');
    }
}
