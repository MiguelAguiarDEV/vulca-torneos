<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\Registration;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Carbon\Carbon;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a registration can be created.
     */
    public function test_registration_can_be_created(): void
    {
        $user = User::factory()->create();
        $tournament = Tournament::factory()->create();
        
        $registration = Registration::create([
            'user_id' => $user->id,
            'tournament_id' => $tournament->id,
            'status' => 'pending',
            'registered_at' => Carbon::now()
        ]);

        $this->assertDatabaseHas('registrations', [
            'user_id' => $user->id,
            'tournament_id' => $tournament->id,
            'status' => 'pending'
        ]);
    }

    /**
     * Test registration relationships.
     */
    public function test_registration_relationships(): void
    {
        $user = User::factory()->create(['name' => 'Test User']);
        $tournament = Tournament::factory()->create(['name' => 'Test Tournament']);
        $registration = Registration::factory()->create([
            'user_id' => $user->id,
            'tournament_id' => $tournament->id
        ]);

        $this->assertInstanceOf(User::class, $registration->user);
        $this->assertInstanceOf(Tournament::class, $registration->tournament);
        $this->assertEquals('Test User', $registration->user->name);
        $this->assertEquals('Test Tournament', $registration->tournament->name);
    }

    /**
     * Test user has many registrations relationship.
     */
    public function test_user_has_many_registrations(): void
    {
        $user = User::factory()->create();
        $tournament1 = Tournament::factory()->create();
        $tournament2 = Tournament::factory()->create();
        
        $registration1 = Registration::factory()->create([
            'user_id' => $user->id,
            'tournament_id' => $tournament1->id
        ]);
        $registration2 = Registration::factory()->create([
            'user_id' => $user->id,
            'tournament_id' => $tournament2->id
        ]);

        $this->assertCount(2, $user->registrations);
        $this->assertTrue($user->registrations->contains($registration1));
        $this->assertTrue($user->registrations->contains($registration2));
    }

    /**
     * Test tournament has many registrations relationship.
     */
    public function test_tournament_has_many_registrations(): void
    {
        $tournament = Tournament::factory()->create();
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        $registration1 = Registration::factory()->create([
            'user_id' => $user1->id,
            'tournament_id' => $tournament->id
        ]);
        $registration2 = Registration::factory()->create([
            'user_id' => $user2->id,
            'tournament_id' => $tournament->id
        ]);

        $this->assertCount(2, $tournament->registrations);
        $this->assertTrue($tournament->registrations->contains($registration1));
        $this->assertTrue($tournament->registrations->contains($registration2));
    }

    /**
     * Test registration status methods.
     */
    public function test_registration_status_methods(): void
    {
        $pendingRegistration = Registration::factory()->create(['status' => 'pending']);
        $confirmedRegistration = Registration::factory()->create(['status' => 'confirmed']);
        $cancelledRegistration = Registration::factory()->create(['status' => 'cancelled']);

        $this->assertTrue($pendingRegistration->isPending());
        $this->assertFalse($pendingRegistration->isConfirmed());
        $this->assertFalse($pendingRegistration->isCancelled());

        $this->assertTrue($confirmedRegistration->isConfirmed());
        $this->assertFalse($confirmedRegistration->isPending());
        $this->assertFalse($confirmedRegistration->isCancelled());

        $this->assertTrue($cancelledRegistration->isCancelled());
        $this->assertFalse($cancelledRegistration->isPending());
        $this->assertFalse($cancelledRegistration->isConfirmed());
    }

    /**
     * Test registration scopes.
     */
    public function test_registration_scopes(): void
    {
        $user = User::factory()->create();
        $tournament = Tournament::factory()->create();
        
        Registration::factory()->create(['status' => 'pending', 'user_id' => $user->id, 'tournament_id' => $tournament->id]);
        Registration::factory()->create(['status' => 'confirmed', 'user_id' => $user->id]);
        Registration::factory()->create(['status' => 'cancelled']);

        $pendingRegistrations = Registration::pending()->get();
        $confirmedRegistrations = Registration::confirmed()->get();
        $cancelledRegistrations = Registration::cancelled()->get();
        $userRegistrations = Registration::forUser($user->id)->get();
        $tournamentRegistrations = Registration::forTournament($tournament->id)->get();

        $this->assertCount(1, $pendingRegistrations);
        $this->assertCount(1, $confirmedRegistrations);
        $this->assertCount(1, $cancelledRegistrations);
        $this->assertCount(2, $userRegistrations);
        $this->assertCount(1, $tournamentRegistrations);
    }

    /**
     * Test registration confirm and cancel methods.
     */
    public function test_registration_confirm_and_cancel_methods(): void
    {
        $registration = Registration::factory()->create(['status' => 'pending']);

        $registration->confirm();
        $this->assertEquals('confirmed', $registration->fresh()->status);

        $registration->cancel();
        $this->assertEquals('cancelled', $registration->fresh()->status);
    }

    /**
     * Test unique constraint prevents duplicate registrations.
     */
    public function test_unique_constraint_prevents_duplicate_registrations(): void
    {
        $user = User::factory()->create();
        $tournament = Tournament::factory()->create();

        // First registration should work
        Registration::create([
            'user_id' => $user->id,
            'tournament_id' => $tournament->id,
            'status' => 'pending'
        ]);

        // Second registration for same user and tournament should fail
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        Registration::create([
            'user_id' => $user->id,
            'tournament_id' => $tournament->id,
            'status' => 'confirmed'
        ]);
    }
}
