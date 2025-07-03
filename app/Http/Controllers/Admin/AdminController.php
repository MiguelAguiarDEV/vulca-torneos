<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Tournament;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controlador para la gestión administrativa de la plataforma.
 * 
 * Este controlador maneja todas las operaciones administrativas incluyendo:
 * - Dashboard con estadísticas
 * - Gestión CRUD de juegos
 * - Gestión CRUD de torneos
 * - Gestión de inscripciones
 * - Gestión de pagos pendientes
 * 
 * @package App\Http\Controllers\Admin
 * @author Vulca Torneos Team
 */
class AdminController extends Controller
{
    /**
     * Muestra el dashboard principal del administrador.
     * 
     * Incluye estadísticas generales de la plataforma, inscripciones recientes
     * y próximos torneos. Solo accesible para usuarios con rol de administrador.
     * 
     * @return \Inertia\Response
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException Si el usuario no es admin
     */
    public function index()
    {
        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }
        $stats = [
            'total_users' => User::count(),
            'total_games' => Game::count(),
            'total_tournaments' => Tournament::count(),
            'total_registrations' => Registration::count(),
            'active_tournaments' => Tournament::where('status', 'active')->count(),
            'pending_registrations' => Registration::where('status', 'pending')->count(),
        ];

        $recentRegistrations = Registration::with(['user', 'tournament.game'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $upcomingTournaments = Tournament::with(['game'])
            ->where('start_date', '>', now())
            ->orderBy('start_date', 'asc')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentRegistrations' => $recentRegistrations,
            'upcomingTournaments' => $upcomingTournaments,
        ]);
    }

    /**
     * Muestra la página de gestión de juegos.
     * 
     * Lista todos los juegos disponibles con contadores de torneos totales
     * y activos. Permite acceder a las funciones de crear, editar y eliminar juegos.
     * 
     * @return \Inertia\Response
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException Si el usuario no es admin
     */
    public function games()
    {
        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $games = Game::withCount(['tournaments', 'tournaments as active_tournaments_count' => function ($query) {
            $query->where('status', 'active');
        }])->get();

        return Inertia::render('Admin/Games/Index', [
            'games' => $games
        ]);
    }

    /**
     * Muestra la página de gestión de torneos.
     * 
     * Lista todos los torneos con información del juego asociado y contadores
     * de inscripciones. Permite acceder a las funciones de crear, editar y eliminar torneos.
     * 
     * @return \Inertia\Response
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException Si el usuario no es admin
     */
    public function tournaments()
    {
        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $tournaments = Tournament::with(['game'])
            ->withCount('registrations')
            ->orderBy('start_date', 'desc')
            ->get();

        return Inertia::render('Admin/Tournaments/Index', [
            'tournaments' => $tournaments
        ]);
    }

    /**
     * Muestra la página de gestión de inscripciones.
     * 
     * Lista todas las inscripciones de usuarios con información del usuario,
     * torneo y juego asociado. Permite gestionar estados de inscripción.
     * 
     * @return \Inertia\Response
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException Si el usuario no es admin
     */
    public function registrations()
    {
        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $registrations = Registration::with(['user', 'tournament.game'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Registrations/Index', [
            'registrations' => $registrations
        ]);
    }

    /**
     * Actualiza el estado de una inscripción.
     * 
     * Permite cambiar el estado de una inscripción específica (pendiente, confirmada, cancelada).
     * Solo los administradores pueden realizar esta acción.
     * 
     * @param \Illuminate\Http\Request $request Datos de la petición con el nuevo estado
     * @param \App\Models\Registration $registration Inscripción a actualizar
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException Si el usuario no es admin
     * @throws \Illuminate\Validation\ValidationException Si los datos no son válidos
     */
    public function updateRegistration(Request $request, Registration $registration)
    {
        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        $registration->update([
            'status' => $request->status
        ]);

        return back()->with('success', 'Estado de inscripción actualizado correctamente.');
    }

    /**
     * Muestra el formulario para crear un nuevo juego.
     * 
     * Renderiza la vista con el formulario para crear un nuevo juego TCG.
     * Solo accesible para administradores.
     * 
     * @return \Inertia\Response
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException Si el usuario no es admin
     */
    public function createGame()
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        return Inertia::render('Admin/Games/Create');
    }

    /**
     * Guarda un nuevo juego en la base de datos.
     * 
     * Valida los datos enviados desde el formulario y crea un nuevo juego TCG.
     * Genera automáticamente el slug basado en el nombre del juego.
     * 
     * @param \Illuminate\Http\Request $request Datos del formulario
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException Si el usuario no es admin
     * @throws \Illuminate\Validation\ValidationException Si los datos no son válidos
     */
    public function storeGame(Request $request)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|url',
        ]);

        $game = Game::create([
            'name' => $request->name,
            'slug' => \Str::slug($request->name),
            'description' => $request->description,
            'image' => $request->image,
        ]);

        return redirect()->route('admin.games.index')->with('success', 'Juego creado correctamente.');
    }

    /**
     * Muestra el formulario para editar un juego existente.
     * 
     * Renderiza la vista con el formulario prellenado con los datos del juego.
     * Solo accesible para administradores.
     * 
     * @param \App\Models\Game $game Juego a editar
     * @return \Inertia\Response
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException Si el usuario no es admin
     */
    public function editGame(Game $game)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        return Inertia::render('Admin/Games/Edit', [
            'game' => $game
        ]);
    }

    /**
     * Update game.
     */
    public function updateGame(Request $request, Game $game)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|url',
        ]);

        $game->update([
            'name' => $request->name,
            'slug' => \Str::slug($request->name),
            'description' => $request->description,
            'image' => $request->image,
        ]);

        return redirect()->route('admin.games.index')->with('success', 'Juego actualizado correctamente.');
    }

    /**
     * Delete game.
     */
    public function destroyGame(Game $game)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        // Check if game has tournaments
        if ($game->tournaments()->count() > 0) {
            return back()->with('error', 'No se puede eliminar el juego porque tiene torneos asociados.');
        }

        $game->delete();

        return redirect()->route('admin.games.index')->with('success', 'Juego eliminado correctamente.');
    }

    /**
     * Show create tournament form.
     */
    public function createTournament()
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $games = Game::all();

        return Inertia::render('Admin/Tournaments/Create', [
            'games' => $games
        ]);
    }

    /**
     * Store a new tournament.
     */
    public function storeTournament(Request $request)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'game_id' => 'required|exists:games,id',
            'start_date' => 'required|date|after:now',
            'end_date' => 'required|date|after:start_date',
            'max_participants' => 'required|integer|min:1',
            'entry_fee' => 'required|numeric|min:0',
            'status' => 'required|in:draft,active,completed,cancelled',
        ]);

        $tournament = Tournament::create([
            'name' => $request->name,
            'slug' => \Str::slug($request->name),
            'description' => $request->description,
            'game_id' => $request->game_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'max_participants' => $request->max_participants,
            'entry_fee' => $request->entry_fee,
            'status' => $request->status,
        ]);

        return redirect()->route('admin.tournaments.index')->with('success', 'Torneo creado correctamente.');
    }

    /**
     * Show edit tournament form.
     */
    public function editTournament(Tournament $tournament)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $games = Game::all();

        return Inertia::render('Admin/Tournaments/Edit', [
            'tournament' => $tournament->load('game'),
            'games' => $games
        ]);
    }

    /**
     * Update tournament.
     */
    public function updateTournament(Request $request, Tournament $tournament)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'game_id' => 'required|exists:games,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'max_participants' => 'required|integer|min:1',
            'entry_fee' => 'required|numeric|min:0',
            'status' => 'required|in:draft,active,completed,cancelled',
        ]);

        $tournament->update([
            'name' => $request->name,
            'slug' => \Str::slug($request->name),
            'description' => $request->description,
            'game_id' => $request->game_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'max_participants' => $request->max_participants,
            'entry_fee' => $request->entry_fee,
            'status' => $request->status,
        ]);

        return redirect()->route('admin.tournaments.index')->with('success', 'Torneo actualizado correctamente.');
    }

    /**
     * Delete tournament.
     */
    public function destroyTournament(Tournament $tournament)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        // Check if tournament has registrations
        if ($tournament->registrations()->count() > 0) {
            return back()->with('error', 'No se puede eliminar el torneo porque tiene inscripciones.');
        }

        $tournament->delete();

        return redirect()->route('admin.tournaments.index')->with('success', 'Torneo eliminado correctamente.');
    }

    /**
     * Delete registration.
     */
    public function destroyRegistration(Registration $registration)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $registration->delete();

        return back()->with('success', 'Inscripción eliminada correctamente.');
    }

    /**
     * Muestra la página de gestión de pagos pendientes.
     * 
     * Lista todos los pagos pendientes de confirmación con filtros opcionales
     * por juego, torneo y método de pago. Permite a los administradores
     * confirmar pagos en efectivo y transferencias bancarias.
     * 
     * @param \Illuminate\Http\Request $request Petición con filtros opcionales
     * @return \Inertia\Response
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException Si el usuario no es admin
     */
    public function payments(Request $request)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $query = Registration::with(['user', 'tournament.game', 'paymentConfirmedBy'])
            ->where('payment_status', 'pending');

        // Filter by game
        if ($request->game_id) {
            $query->whereHas('tournament', function ($q) use ($request) {
                $q->where('game_id', $request->game_id);
            });
        }

        // Filter by tournament
        if ($request->tournament_id) {
            $query->where('tournament_id', $request->tournament_id);
        }

        // Filter by payment method
        if ($request->payment_method) {
            $query->where('payment_method', $request->payment_method);
        }

        $payments = $query->orderBy('created_at', 'desc')->paginate(20);

        $games = Game::all();
        $tournaments = Tournament::all();

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'games' => $games,
            'tournaments' => $tournaments,
            'filters' => $request->all(),
        ]);
    }

    /**
     * Confirma un pago pendiente.
     * 
     * Marca un pago como confirmado, actualiza el estado de la inscripción
     * a confirmada y registra qué administrador confirmó el pago.
     * Utilizado principalmente para pagos en efectivo y transferencias.
     * 
     * @param \Illuminate\Http\Request $request Datos con notas opcionales del pago
     * @param \App\Models\Registration $registration Inscripción con pago a confirmar
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException Si el usuario no es admin
     * @throws \Illuminate\Validation\ValidationException Si los datos no son válidos
     */
    public function confirmPayment(Request $request, Registration $registration)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        $request->validate([
            'payment_notes' => 'nullable|string',
        ]);

        $registration->update([
            'payment_notes' => $request->payment_notes,
        ]);

        $registration->confirmPayment(auth()->id());

        return back()->with('success', 'Pago confirmado correctamente.');
    }
}
