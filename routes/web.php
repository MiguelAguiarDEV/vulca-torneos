<?php

use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\RegistrationController;

use App\Http\Controllers\GameController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminGamesController;
use App\Http\Controllers\Admin\AdminTournamentController;
use App\Http\Controllers\Admin\AdminRegistrationController;

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

/**
 * =====================================================
 * RUTAS PROTEGIDAS POR AUTENTICACIÓN
 * =====================================================
 * Estas rutas requieren que el usuario esté autenticado
 */

// Rutas para registro y cancelación en torneos (requieren autenticación)
Route::middleware(['auth'])->group(function () {
    Route::post('/tournaments/{tournament}/register', [TournamentController::class, 'register'])->name('tournaments.register');
    Route::delete('/tournaments/{tournament}/unregister', [TournamentController::class, 'unregister'])->name('tournaments.unregister');
});






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
    Route::resource('games', AdminGamesController::class)->names('admin.games');
    Route::resource('tournaments', AdminTournamentController::class)->names('admin.tournaments');
    Route::resource('registrations', AdminRegistrationController::class)->names('admin.registrations');
});



// Rutas de configuración de perfil de usuario
require __DIR__.'/settings.php';

// Rutas de autenticación (login, register, password reset, etc.)
require __DIR__.'/auth.php';
