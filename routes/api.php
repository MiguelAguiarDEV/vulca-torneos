<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\GameController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Game details API routes
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('games/{game}/tournaments', [GameController::class, 'getTournaments']);
    Route::get('games/{game}/registrations', [GameController::class, 'getRegistrations']);
});
