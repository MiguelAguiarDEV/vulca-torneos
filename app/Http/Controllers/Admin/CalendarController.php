<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tournament;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    /**
     * Obtener torneos para el calendario
     */
    public function index(Request $request)
    {
        $start = $request->query('start');
        $end = $request->query('end');

        $query = Tournament::with('game')
            ->select('id', 'name', 'start_date', 'end_date', 'status', 'game_id', 'image');

        // Filtrar por rango de fechas si se proporciona
        if ($start && $end) {
            $query->whereBetween('start_date', [$start, $end])
                ->orWhereBetween('end_date', [$start, $end])
                ->orWhere(function ($q) use ($start, $end) {
                    $q->where('start_date', '<=', $start)
                      ->where('end_date', '>=', $end);
                });
        }

        $tournaments = $query->orderBy('start_date', 'asc')->get();

        // Formatear para react-big-calendar
        $events = $tournaments->map(function ($tournament) {
            return [
                'id' => $tournament->id,
                'title' => $tournament->name,
                'start' => $tournament->start_date,
                'end' => $tournament->end_date ?? $tournament->start_date,
                'status' => $tournament->status,
                'game' => $tournament->game ? [
                    'id' => $tournament->game->id,
                    'name' => $tournament->game->name,
                ] : null,
                'image' => $tournament->image,
                // Colores según el estado
                'color' => $this->getStatusColor($tournament->status),
            ];
        });

        return response()->json($events);
    }

    /**
     * Colores por estado
     */
    private function getStatusColor($status)
    {
        $colors = [
            'draft' => '#6B7280',
            'published' => '#3B82F6',
            'registration_open' => '#10B981',
            'registration_closed' => '#F59E0B',
            'ongoing' => '#F4A52E',
            'finished' => '#6B7280',
            'cancelled' => '#EF4444',
        ];

        return $colors[$status] ?? '#6B7280';
    }
}