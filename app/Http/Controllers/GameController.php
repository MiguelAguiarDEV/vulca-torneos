<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $games = Game::all();
        return Inertia::render('Admin/Games/Index', [
            'games' => $games,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $game = Game::with(['tournaments' => function($query) {
            $query->whereIn('status', ['published', 'registration_open', 'registration_closed', 'ongoing'])
                  ->with(['registrations' => function($regQuery) {
                      $regQuery->where('status', 'confirmed');
                  }]);
        }])->findOrFail($id);

        // Get tournaments with mapped status
        $tournaments = $game->tournaments->map(function($tournament) {
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

        // Get pending registrations for this game's tournaments
        $pendingRegistrations = $game->tournaments()
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

        return Inertia::render('Admin/Games/Show', [
            'game' => $game,
            'tournaments' => $tournaments,
            'pendingRegistrations' => $pendingRegistrations,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $game = Game::findOrFail($id);

        // Debug logging
        \Log::info('Game update request data:', [
            'id' => $id,
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'description_length' => strlen($request->input('description', '')),
            'has_image' => $request->hasFile('image')
        ]);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:games,name,' . $id,
            'description' => 'nullable|string|max:65535',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Manejo explícito para descripción
        if (array_key_exists('description', $validatedData)) {
            $validatedData['description'] = $validatedData['description'] ?: null;
        }

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/games'), $imageName);
            $validatedData['image'] = '/uploads/games/' . $imageName;
        } else {
            // Remove image from update data if not provided to keep current image
            unset($validatedData['image']);
        }

        \Log::info('Validated data for game update:', $validatedData);

        $game->update($validatedData);

        return redirect()->route('admin.games.index')->with('success', 'Juego actualizado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $game = Game::findOrFail($id);
        $game->delete();
        
        return redirect()->route('admin.games.index')->with('success', 'Juego eliminado con éxito.');
    }

    /**
     * Get tournaments for a specific game (API endpoint)
     */
    public function getTournaments(string $id)
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
