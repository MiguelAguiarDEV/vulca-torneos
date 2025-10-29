<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminGamesController;
use App\Http\Controllers\Admin\AdminTournamentController;
use App\Http\Controllers\Admin\AdminRegistrationController;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| PÚBLICO
|--------------------------------------------------------------------------
*/

// Landing pública (Inertia -> resources/js/pages/Welcome/index.tsx)
Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

// Torneos públicos
Route::get('/tournaments', [TournamentController::class, 'publicIndex'])->name('tournaments.index');
Route::get('/tournaments/{tournament}', [TournamentController::class, 'publicShow'])->name('tournaments.show');

// Tournaments por juego
Route::get('/game/{game}', [GameController::class, 'gameTournaments'])->name('games.tournaments');

// Webhook de Stripe (sin autenticación)
Route::post('/webhook/stripe', [PaymentController::class, 'webhook'])->name('stripe.webhook');


/*
|--------------------------------------------------------------------------
| AUTENTICACIÓN (INVITADOS)
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    // Login
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);

    // Registro
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});


/*
|--------------------------------------------------------------------------
| AUTENTICADO
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    // Logout
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Inscribirse / darse de baja en un torneo
    Route::post('/tournaments/{tournament}/register', [TournamentController::class, 'register'])->name('tournaments.register');
    Route::delete('/tournaments/{tournament}/unregister', [TournamentController::class, 'unregister'])->name('tournaments.unregister');

    // Pagos con Stripe
    Route::prefix('registrations/{registration}')->as('registration.')->group(function () {
        Route::get('/checkout', [PaymentController::class, 'checkout'])->name('payment.checkout');
        Route::post('/create-checkout-session', [PaymentController::class, 'createCheckoutSession'])->name('payment.create-session');
        Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');
        Route::get('/payment/cancel', [PaymentController::class, 'cancel'])->name('payment.cancel');
    });
});


/*
|--------------------------------------------------------------------------
| ADMIN (auth + admin)
|--------------------------------------------------------------------------
| Dashboard admin -> resources/js/pages/Admin/index.tsx
*/
Route::prefix('admin')->as('admin.')->middleware(['auth', 'admin'])->group(function () {
    // /admin -> redirige a /admin/dashboard
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    })->name('root');

    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');

    Route::resource('games', AdminGamesController::class);
    Route::resource('tournaments', AdminTournamentController::class);
    Route::resource('registrations', AdminRegistrationController::class);
});

/*
|--------------------------------------------------------------------------
| IMPORTANTE
|--------------------------------------------------------------------------
| No incluyas aquí require 'auth.php' si define /login o /register con blades,
| porque chocará con las rutas Inertia de arriba (y te dará 500).
| Si necesitas reset de contraseña/verificación, limpia ese archivo.
*/
// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
