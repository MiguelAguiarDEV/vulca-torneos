<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Tournament;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TournamentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Asegurar que tenemos juegos disponibles
        if (Game::count() === 0) {
            $this->command->error('No hay juegos disponibles. Ejecuta GameSeeder primero.');
            return;
        }

        $games = Game::all();

        $tournaments = [
            [
                'name' => 'Magic: The Gathering Championship 2025',
                'slug' => 'magic-the-gathering-championship-2025',
                'description' => 'El torneo más importante del año de Magic: The Gathering. Formato Standard con los mejores jugadores del país.',
                'image' => 'https://via.placeholder.com/800x400?text=MTG+Championship',
                'game_id' => $games->where('slug', 'magic-the-gathering')->first()?->id ?? $games->first()->id,
                'start_date' => Carbon::now()->addMonth(),
                'end_date' => Carbon::now()->addMonth()->addDays(2),
                'registration_start' => Carbon::now()->addWeek(),
                'registration_end' => Carbon::now()->addMonth()->subDays(3),
                'entry_fee' => 25.00,
                'has_registration_limit' => true,
                'registration_limit' => 32,
                'status' => 'published',
            ],
            [
                'name' => 'Pokémon TCG League Cup',
                'slug' => 'pokemon-tcg-league-cup',
                'description' => 'Liga Copa oficial de Pokémon TCG. Formato Standard con premios oficiales.',
                'image' => 'https://via.placeholder.com/800x400?text=Pokemon+League+Cup',
                'game_id' => $games->where('slug', 'pokemon-tcg')->first()?->id ?? $games->first()->id,
                'start_date' => Carbon::now()->addWeeks(3),
                'end_date' => Carbon::now()->addWeeks(3)->addDay(),
                'registration_start' => Carbon::now()->addWeek(),
                'registration_end' => Carbon::now()->addWeeks(3)->subDays(2),
                'entry_fee' => 15.00,
                'has_registration_limit' => true,
                'registration_limit' => 16,
                'status' => 'registration_open',
            ],
            [
                'name' => 'Yu-Gi-Oh! Regional Tournament',
                'slug' => 'yu-gi-oh-regional-tournament',
                'description' => 'Torneo regional oficial de Yu-Gi-Oh! Abierto a todos los duelistas.',
                'image' => 'https://via.placeholder.com/800x400?text=YuGiOh+Regional',
                'game_id' => $games->where('slug', 'yu-gi-oh')->first()?->id ?? $games->first()->id,
                'start_date' => Carbon::now()->addWeeks(2),
                'end_date' => Carbon::now()->addWeeks(2)->addDay(),
                'registration_start' => Carbon::now(),
                'registration_end' => Carbon::now()->addWeeks(2)->subDays(1),
                'entry_fee' => 20.00,
                'has_registration_limit' => false,
                'registration_limit' => null,
                'status' => 'registration_open',
            ]
        ];

        foreach ($tournaments as $tournament) {
            Tournament::firstOrCreate(
                ['slug' => $tournament['slug']],
                $tournament
            );
        }

        $this->command->info('Torneos creados exitosamente!');
    }
}