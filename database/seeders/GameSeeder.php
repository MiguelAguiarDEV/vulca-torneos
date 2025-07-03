<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $games = [
            [
                'name' => 'Magic: The Gathering',
                'slug' => 'magic-the-gathering',
                'description' => 'Magic: The Gathering es un juego de cartas coleccionables creado por Richard Garfield. Los jugadores asumen el papel de planeswalkers que luchan entre sí usando hechizos, artefactos y criaturas.',
                'image' => 'https://via.placeholder.com/400x300?text=Magic+The+Gathering'
            ],
            [
                'name' => 'Pokémon TCG',
                'slug' => 'pokemon-tcg',
                'description' => 'El juego de cartas coleccionables Pokémon permite a los jugadores asumir el papel de Entrenador Pokémon, utilizando cartas que representan criaturas y otros elementos del universo Pokémon.',
                'image' => 'https://via.placeholder.com/400x300?text=Pokemon+TCG'
            ],
            [
                'name' => 'Yu-Gi-Oh!',
                'slug' => 'yu-gi-oh',
                'description' => 'Yu-Gi-Oh! es un juego de cartas estratégico donde los jugadores invocan monstruos, lanzan hechizos y activan trampas para reducir los puntos de vida de su oponente a cero.',
                'image' => 'https://via.placeholder.com/400x300?text=Yu-Gi-Oh'
            ],
            [
                'name' => 'Dragon Ball Super Card Game',
                'slug' => 'dragon-ball-super-card-game',
                'description' => 'Basado en el popular anime Dragon Ball Super, este juego de cartas permite a los jugadores recrear épicas batallas usando personajes icónicos de la serie.',
                'image' => 'https://via.placeholder.com/400x300?text=Dragon+Ball+Super'
            ],
            [
                'name' => 'One Piece Card Game',
                'slug' => 'one-piece-card-game',
                'description' => 'El juego de cartas oficial de One Piece donde los jugadores pueden formar tripulaciones y vivir aventuras en el mundo de los piratas creado por Eiichiro Oda.',
                'image' => 'https://via.placeholder.com/400x300?text=One+Piece'
            ]
        ];

        foreach ($games as $game) {
            Game::firstOrCreate(
                ['slug' => $game['slug']],
                $game
            );
        }

        $this->command->info('Juegos TCG creados exitosamente!');
    }
}
