<?php

namespace Database\Seeders;

use App\Models\Registration;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class RegistrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar que tenemos usuarios y torneos
        if (User::count() === 0) {
            $this->command->error('No hay usuarios disponibles. Ejecuta AdminUserSeeder primero.');
            return;
        }

        if (Tournament::count() === 0) {
            $this->command->error('No hay torneos disponibles. Ejecuta TournamentSeeder primero.');
            return;
        }

        // Crear usuarios adicionales si no hay suficientes
        if (User::count() < 5) {
            User::factory()->count(5 - User::count())->create();
        }

        $users = User::take(5)->get();
        $tournaments = Tournament::all();

        $registrationCount = 0;

        foreach ($tournaments as $tournament) {
            // Registrar 2-4 usuarios por torneo
            $usersToRegister = $users->random(rand(2, 4));
            
            foreach ($usersToRegister as $user) {
                try {
                    Registration::create([
                        'user_id' => $user->id,
                        'tournament_id' => $tournament->id,
                        'status' => collect(['pending', 'confirmed'])->random(),
                        'registered_at' => Carbon::now()->subDays(rand(1, 30))
                    ]);
                    $registrationCount++;
                } catch (\Exception $e) {
                    // Skip if registration already exists (due to unique constraint)
                    continue;
                }
            }
        }

        $this->command->info("$registrationCount inscripciones creadas exitosamente!");
    }
}
