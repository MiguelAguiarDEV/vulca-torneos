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

// Rutas públicas para torneos
Route::get('/tournaments', [TournamentController::class, 'publicIndex'])->name('tournaments.index');
Route::get('/tournaments/{tournament}', [TournamentController::class, 'publicShow'])->name('tournaments.show');

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
    Route::resource('tournaments', TournamentController::class)->names('admin.tournaments');

});



// Rutas de configuración de perfil de usuario
require __DIR__.'/settings.php';

// Rutas de autenticación (login, register, password reset, etc.)
require __DIR__.'/auth.php';
