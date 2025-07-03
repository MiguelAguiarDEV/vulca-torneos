<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GameController;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\AdminController;

/**
 * =====================================================
 * RUTAS PÚBLICAS (No requieren autenticación)
 * =====================================================
 * Estas rutas pueden ser accedidas por cualquier visitante
 * sin necesidad de iniciar sesión
 */

// Página de inicio - Muestra juegos destacados y permite navegación
Route::get('/', [GameController::class, 'welcome'])->name('home');

// Rutas públicas para explorar juegos y torneos
Route::get('/games', [GameController::class, 'index'])->name('games.index');           // Lista todos los juegos disponibles
Route::get('/games/{game}', [GameController::class, 'show'])->name('games.show');     // Muestra detalles de un juego específico y sus torneos
Route::get('/tournaments', [TournamentController::class, 'index'])->name('tournaments.index');        // Lista todos los torneos activos
Route::get('/tournaments/{tournament}', [TournamentController::class, 'show'])->name('tournaments.show'); // Muestra detalles de un torneo específico

/**
 * =====================================================
 * RUTAS AUTENTICADAS (Requieren login)
 * =====================================================
 * Estas rutas requieren que el usuario esté autenticado
 * y con email verificado
 */

Route::middleware(['auth', 'verified'])->group(function () {
    // Gestión de inscripciones del usuario
    Route::get('/my-registrations', [RegistrationController::class, 'index'])->name('registrations.index');      // Ver mis inscripciones
    Route::post('/registrations', [RegistrationController::class, 'store'])->name('registrations.store');        // Inscribirse a un torneo
    Route::patch('/registrations/{registration}', [RegistrationController::class, 'update'])->name('registrations.update'); // Actualizar inscripción (cancelar)
    Route::delete('/registrations/{registration}', [RegistrationController::class, 'destroy'])->name('registrations.destroy'); // Eliminar inscripción
});

/**
 * =====================================================
 * RUTAS ADMINISTRATIVAS (Solo para administradores)
 * =====================================================
 * Estas rutas están protegidas y solo pueden ser accedidas
 * por usuarios con rol de administrador
 */

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard principal del administrador
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');                              // Panel de control con estadísticas
    
    /**
     * GESTIÓN DE JUEGOS
     * Permite crear, editar y eliminar juegos TCG
     */
    Route::get('/games', [AdminController::class, 'games'])->name('games.index');                               // Lista todos los juegos
    Route::get('/games/create', [AdminController::class, 'createGame'])->name('games.create');                  // Formulario para crear juego
    Route::post('/games', [AdminController::class, 'storeGame'])->name('games.store');                          // Guardar nuevo juego
    Route::get('/games/{game}/edit', [AdminController::class, 'editGame'])->name('games.edit');                 // Formulario para editar juego
    Route::patch('/games/{game}', [AdminController::class, 'updateGame'])->name('games.update');                // Actualizar juego existente
    Route::delete('/games/{game}', [AdminController::class, 'destroyGame'])->name('games.destroy');             // Eliminar juego
    
    /**
     * GESTIÓN DE TORNEOS
     * Permite crear, editar, eliminar y gestionar torneos
     */
    Route::get('/tournaments', [AdminController::class, 'tournaments'])->name('tournaments.index');             // Lista todos los torneos
    Route::get('/tournaments/create', [AdminController::class, 'createTournament'])->name('tournaments.create'); // Formulario para crear torneo
    Route::post('/tournaments', [AdminController::class, 'storeTournament'])->name('tournaments.store');         // Guardar nuevo torneo
    Route::get('/tournaments/{tournament}/edit', [AdminController::class, 'editTournament'])->name('tournaments.edit'); // Formulario para editar torneo
    Route::patch('/tournaments/{tournament}', [AdminController::class, 'updateTournament'])->name('tournaments.update'); // Actualizar torneo (cambiar estado, precios, etc.)
    Route::delete('/tournaments/{tournament}', [AdminController::class, 'destroyTournament'])->name('tournaments.destroy'); // Eliminar torneo
    
    /**
     * GESTIÓN DE INSCRIPCIONES
     * Permite ver y gestionar todas las inscripciones de usuarios
     */
    Route::get('/registrations', [AdminController::class, 'registrations'])->name('registrations.index');       // Lista todas las inscripciones
    Route::patch('/registrations/{registration}', [AdminController::class, 'updateRegistration'])->name('registrations.update'); // Cambiar estado de inscripción
    Route::delete('/registrations/{registration}', [AdminController::class, 'destroyRegistration'])->name('registrations.destroy'); // Eliminar inscripción
    
    /**
     * GESTIÓN DE PAGOS
     * Permite confirmar pagos pendientes (efectivo, transferencias, etc.)
     */
    Route::get('/payments', [AdminController::class, 'payments'])->name('payments.index');                      // Lista pagos pendientes con filtros
    Route::patch('/payments/{registration}/confirm', [AdminController::class, 'confirmPayment'])->name('payments.confirm'); // Confirmar pago manualmente
});

/**
 * =====================================================
 * REDIRECCIÓN DEL DASHBOARD
 * =====================================================
 * Redirige a los usuarios según su rol:
 * - Administradores: al panel de administración
 * - Usuarios normales: a sus inscripciones
 */
Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    if (auth()->user()->isAdmin()) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('registrations.index');
})->name('dashboard');

/**
 * =====================================================
 * INCLUSIÓN DE ARCHIVOS DE RUTAS ADICIONALES
 * =====================================================
 */

// Rutas de configuración de perfil de usuario
require __DIR__.'/settings.php';

// Rutas de autenticación (login, register, password reset, etc.)
require __DIR__.'/auth.php';
