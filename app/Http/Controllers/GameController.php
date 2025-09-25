<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    /**
     * Get tournaments for a specific game (API endpoint)
     */
    public function gameTournaments(string $id)
    {
        $game = Game::findOrFail($id);
        
        // Get tournaments that are either published, registration open, or ongoing for this game
        $tournaments = $game->tournaments()
            ->whereIn('status', ['published', 'registration_open', 'registration_closed', 'ongoing'])
            ->with(['registrations' => function($query) {
                $query->where('status', 'confirmed');
            }])
            ->get()
            ->map(function($tournament) {
                // Determine display status
                $displayStatus = 'upcoming';
                if ($tournament->status === 'ongoing') {
                    $displayStatus = 'active';
                } elseif (in_array($tournament->status, ['registration_open', 'registration_closed'])) {
                    $displayStatus = 'upcoming';
                }
                
                return [
                    'id' => $tournament->id,
                    'name' => $tournament->name,
                    'status' => $displayStatus,
                    'original_status' => $tournament->status,
                    'start_date' => $tournament->start_date?->format('d/m/Y'),
                    'participants_count' => $tournament->registrations->count(),
                ];
            });

        return response()->json($tournaments);
    }

    /**
     * Get pending registrations for a specific game (API endpoint)
     */
    public function getRegistrations(string $id)
    {
        $game = Game::findOrFail($id);
        
        // Get pending registrations for tournaments of this game
        $registrations = $game->tournaments()
            ->with(['registrations' => function($query) {
                $query->where('status', 'pending')
                    ->with(['user', 'tournament']);
            }])
            ->get()
            ->flatMap(function($tournament) {
                return $tournament->registrations->map(function($registration) {
                    return [
                        'id' => $registration->id,
                        'user_name' => $registration->user->name,
                        'user_email' => $registration->user->email,
                        'tournament_name' => $registration->tournament->name,
                        'registration_date' => $registration->created_at->format('d/m/Y'),
                        'payment_status' => $registration->payment_status,
                    ];
                });
            });

        return response()->json($registrations);
    }
}
