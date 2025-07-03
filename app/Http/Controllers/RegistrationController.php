<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRegistrationRequest;
use App\Models\Registration;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controlador para la gestión de inscripciones de usuarios.
 * 
 * Este controlador maneja todas las operaciones relacionadas con las
 * inscripciones de usuarios a torneos, incluyendo creación, visualización,
 * actualización y eliminación. Requiere autenticación para todas las acciones.
 * 
 * @package App\Http\Controllers
 * @author Vulca Torneos Team
 */
class RegistrationController extends Controller
{
    /**
     * Muestra las inscripciones del usuario autenticado.
     * 
     * Lista todas las inscripciones del usuario actual ordenadas por fecha
     * de inscripción más reciente primero. Incluye información del torneo
     * y juego asociado. Solo muestra las propias inscripciones del usuario.
     * 
     * @return \Inertia\Response
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
     * Crea una nueva inscripción a un torneo.
     * 
     * Registra al usuario autenticado en el torneo especificado, incluyendo
     * información de pago (método, monto, estado). La inscripción queda
     * pendiente hasta que el administrador confirme el pago.
     * 
     * @param \App\Http\Requests\StoreRegistrationRequest $request Datos validados de la inscripción
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Exception Si ocurre un error durante el proceso de inscripción
     */
    public function store(StoreRegistrationRequest $request)
    {
        $validated = $request->validated();

        try {
            $tournament = Tournament::findOrFail($validated['tournament_id']);
            
            Registration::create([
                'user_id' => Auth::id(),
                'tournament_id' => $validated['tournament_id'],
                'status' => 'pending',
                'payment_method' => $validated['payment_method'] ?? 'cash',
                'payment_status' => 'pending',
                'amount' => $tournament->entry_fee,
                'registered_at' => now(),
            ]);

            return back()->with('success', 'Te has inscrito correctamente al torneo. Tu pago está pendiente de confirmación.');
        } catch (\Exception $e) {
            return back()->withErrors(['tournament' => 'Error al procesar la inscripción.']);
        }
    }

    /**
     * Actualiza el estado de una inscripción específica.
     * 
     * Permite al usuario cambiar el estado de su propia inscripción.
     * Los usuarios regulares solo pueden cancelar sus inscripciones,
     * mientras que los administradores pueden cambiar cualquier estado.
     * 
     * @param \Illuminate\Http\Request $request Datos con el nuevo estado
     * @param \App\Models\Registration $registration Inscripción a actualizar
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException Si el usuario no tiene permisos
     * @throws \Illuminate\Validation\ValidationException Si los datos no son válidos
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
     * Elimina una inscripción específica.
     * 
     * Permite al usuario eliminar su propia inscripción o a los
     * administradores eliminar cualquier inscripción. Esta acción
     * es irreversible y elimina completamente el registro.
     * 
     * @param \App\Models\Registration $registration Inscripción a eliminar
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException Si el usuario no tiene permisos
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
