<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controlador para la gestión pública de juegos.
 * 
 * Este controlador maneja la visualización pública de juegos TCG,
 * incluyendo listados, detalles y la página de bienvenida.
 * No requiere autenticación para la mayoría de acciones.
 * 
 * @package App\Http\Controllers
 * @author Vulca Torneos Team
 */
class GameController extends Controller
{
    /**
     * Muestra la página de bienvenida con juegos destacados.
     * 
     * Renderiza la página principal del sitio web mostrando los juegos
     * más populares y permitiendo la navegación a torneos sin autenticación.
     * 
     * @return \Inertia\Response
     */
    public function welcome()
    {
        // Obtener juegos con conteo de torneos activos para la página de inicio
        $games = Game::withCount(['tournaments' => function ($query) {
            $query->active();
        }])
        ->whereHas('tournaments', function ($query) {
            $query->active();
        })
        ->orderBy('tournaments_count', 'desc')
        ->limit(8)
        ->get();

        return Inertia::render('Welcome', [
            'games' => $games
        ]);
    }

    /**
     * Muestra una lista de todos los juegos disponibles.
     * 
     * Lista todos los juegos TCG con sus torneos activos asociados.
     * Esta vista es pública y no requiere autenticación.
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        $games = Game::with(['tournaments' => function ($query) {
            $query->active()->orderBy('start_date', 'asc');
        }])->get();

        return Inertia::render('Games/Index', [
            'games' => $games
        ]);
    }

    /**
     * Muestra los detalles de un juego específico con sus torneos.
     * 
     * Muestra información detallada del juego seleccionado junto con
     * todos sus torneos activos. Los usuarios pueden ver los torneos
     * pero necesitan autenticarse para inscribirse.
     * 
     * @param \App\Models\Game $game Juego a mostrar
     * @return \Inertia\Response
     */
    public function show(Game $game)
    {
        $game->load([
            'tournaments' => function ($query) {
                $query->active()
                    ->withCount('registrations')
                    ->orderBy('start_date', 'asc');
            }
        ]);

        return Inertia::render('Games/Show', [
            'game' => $game
        ]);
    }
}
