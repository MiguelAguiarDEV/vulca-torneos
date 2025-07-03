<?php

namespace Tests\Feature;

use App\Models\Game;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class GameTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a game can be created with all required fields.
     */
    public function test_game_can_be_created(): void
    {
        $game = Game::create([
            'name' => 'Test Game',
            'description' => 'A test game description'
        ]);

        $this->assertDatabaseHas('games', [
            'name' => 'Test Game',
            'slug' => 'test-game',
            'description' => 'A test game description'
        ]);
    }

    /**
     * Test that slug is automatically generated from name.
     */
    public function test_slug_is_automatically_generated(): void
    {
        $game = Game::create([
            'name' => 'Magic: The Gathering'
        ]);

        $this->assertEquals('magic-the-gathering', $game->slug);
    }

    /**
     * Test that slug is updated when name changes.
     */
    public function test_slug_updates_when_name_changes(): void
    {
        $game = Game::create([
            'name' => 'Original Name'
        ]);

        $game->update(['name' => 'New Game Name']);

        $this->assertEquals('new-game-name', $game->fresh()->slug);
    }

    /**
     * Test that game uses slug for route key.
     */
    public function test_game_uses_slug_for_route_key(): void
    {
        $game = new Game();
        
        $this->assertEquals('slug', $game->getRouteKeyName());
    }

    /**
     * Test game factory creates valid games.
     */
    public function test_game_factory_creates_valid_games(): void
    {
        $games = Game::factory()->count(3)->create();

        $this->assertCount(3, $games);
        
        foreach ($games as $game) {
            $this->assertNotEmpty($game->name);
            $this->assertNotEmpty($game->slug);
            $this->assertNotEmpty($game->description);
        }
    }
}
