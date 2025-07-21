<?php

use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\RegistrationController;

use App\Http\Controllers\GameController;
use App\Http\Controllers\AdminController;

/**
 * =====================================================
 * RUTAS PÚBLICAS (No requieren autenticación)
 * =====================================================
 * Estas rutas pueden ser accedidas por cualquier visitante
 * sin necesidad de iniciar sesión
 */

// Página de inicio - Muestra juegos destacados y permite navegación
Route::get('/', [WelcomeController::class, 'index'])
    ->name('index.welcome');

Route::get('/game/{game}', [GameController::class, 'gameTournaments'])->name('games.tournaments');






// Dashboard route - protected by auth middleware
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        if (auth()->user()->isAdmin()) {
            return redirect()->route('dashboard.index');
        }
        return redirect()->route('index.welcome');
    })->name('dashboard');
});

// Admin routes - protected by admin middleware
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index'])
        ->name('dashboard.index');
    
    Route::resource('games', GameController::class)->names('admin.games');
    
    // Tournament admin routes
    Route::get('/tournaments', [TournamentController::class, 'adminIndex'])->name('admin.tournaments.index');
    Route::get('/tournaments/create', [TournamentController::class, 'adminCreate'])->name('admin.tournaments.create');
    Route::post('/tournaments', [TournamentController::class, 'adminStore'])->name('admin.tournaments.store');
    Route::get('/tournaments/{tournament}', [TournamentController::class, 'adminShow'])->name('admin.tournaments.show');
    Route::get('/tournaments/{tournament}/edit', [TournamentController::class, 'adminEdit'])->name('admin.tournaments.edit');
    Route::put('/tournaments/{tournament}', [TournamentController::class, 'adminUpdate'])->name('admin.tournaments.update');
    Route::delete('/tournaments/{tournament}', [TournamentController::class, 'adminDestroy'])->name('admin.tournaments.destroy');

});



// Rutas de configuración de perfil de usuario
require __DIR__.'/settings.php';

// Rutas de autenticación (login, register, password reset, etc.)
require __DIR__.'/auth.php';
