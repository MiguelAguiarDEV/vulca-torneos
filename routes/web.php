<?php

use App\Http\Controllers\WelcomeController;
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
Route::get('/', [WelcomeController::class, 'index'])
    ->name('index.welcome');

Route::get('/game/{game}', [GameController::class, 'gameTournaments'])->name('games.tournaments');

Route::get('/admin', [AdminController::class, 'index'])
    ->name('dashboard.index');



// Rutas de configuración de perfil de usuario
require __DIR__.'/settings.php';

// Rutas de autenticación (login, register, password reset, etc.)
require __DIR__.'/auth.php';
