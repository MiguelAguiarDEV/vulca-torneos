<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\Tournament;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Carbon\Carbon;

class TournamentTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a tournament can be created with all required fields.
     */
    public function test_tournament_can_be_created(): void
    {
        $game = Game::factory()->create();
        
        $tournament = Tournament::create([
            'name' => 'Test Tournament',
            'description' => 'A test tournament description',
            'game_id' => $game->id,
            'start_date' => Carbon::now()->addWeek(),
            'end_date' => Carbon::now()->addWeek()->addDay(),
            'registration_start' => Carbon::now(),
            'registration_end' => Carbon::now()->addWeek()->subDay(),
            'entry_fee' => 15.00,
            'status' => 'published'
        ]);

        $this->assertDatabaseHas('tournaments', [
            'name' => 'Test Tournament',
            'slug' => 'test-tournament',
            'description' => 'A test tournament description',
            'game_id' => $game->id,
            'status' => 'published'
        ]);
    }

    /**
     * Test that slug is automatically generated from name.
     */
    public function test_slug_is_automatically_generated(): void
    {
        $game = Game::factory()->create();
        
        $tournament = Tournament::create([
            'name' => 'Magic: The Gathering Championship',
            'game_id' => $game->id,
            'start_date' => Carbon::now()->addWeek(),
            'end_date' => Carbon::now()->addWeek()->addDay(),
            'registration_start' => Carbon::now(),
            'registration_end' => Carbon::now()->addWeek()->subDay(),
            'entry_fee' => 25.00,
            'status' => 'published'
        ]);

        $this->assertEquals('magic-the-gathering-championship', $tournament->slug);
    }

    /**
     * Test tournament relationship with game.
     */
    public function test_tournament_belongs_to_game(): void
    {
        $game = Game::factory()->create(['name' => 'Test Game']);
        $tournament = Tournament::factory()->create(['game_id' => $game->id]);

        $this->assertInstanceOf(Game::class, $tournament->game);
        $this->assertEquals('Test Game', $tournament->game->name);
    }

    /**
     * Test game has many tournaments relationship.
     */
    public function test_game_has_many_tournaments(): void
    {
        $game = Game::factory()->create();
        $tournament1 = Tournament::factory()->create(['game_id' => $game->id]);
        $tournament2 = Tournament::factory()->create(['game_id' => $game->id]);

        $this->assertCount(2, $game->tournaments);
        $this->assertTrue($game->tournaments->contains($tournament1));
        $this->assertTrue($game->tournaments->contains($tournament2));
    }

    /**
     * Test tournament status methods.
     */
    public function test_tournament_status_methods(): void
    {
        $tournament = Tournament::factory()->create([
            'status' => 'registration_open',
            'registration_start' => Carbon::now()->subDay(),
            'registration_end' => Carbon::now()->addDay()
        ]);

        $this->assertTrue($tournament->isRegistrationOpen());
        $this->assertFalse($tournament->isFinished());
        $this->assertFalse($tournament->isOngoing());
        $this->assertFalse($tournament->isCancelled());
    }

    /**
     * Test tournament scopes.
     */
    public function test_tournament_scopes(): void
    {
        $game = Game::factory()->create();
        Tournament::factory()->create(['status' => 'published', 'game_id' => $game->id]);
        Tournament::factory()->create(['status' => 'draft', 'game_id' => $game->id]);
        Tournament::factory()->create(['status' => 'registration_open', 'game_id' => $game->id]);

        $publishedTournaments = Tournament::published()->get();
        $activeTournaments = Tournament::active()->get();
        $gameTournaments = Tournament::forGame($game->id)->get();

        $this->assertCount(2, $publishedTournaments); // published and registration_open
        $this->assertCount(2, $activeTournaments); // published and registration_open
        $this->assertCount(3, $gameTournaments); // all tournaments for this game
    }

    /**
     * Test entry fee formatting.
     */
    public function test_entry_fee_formatting(): void
    {
        $freeTournament = Tournament::factory()->create(['entry_fee' => 0]);
        $paidTournament = Tournament::factory()->create(['entry_fee' => 25.50]);

        $this->assertEquals('Gratis', $freeTournament->formatted_entry_fee);
        $this->assertEquals('$25.50', $paidTournament->formatted_entry_fee);
    }
}
