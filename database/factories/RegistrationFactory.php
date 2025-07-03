<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Registration>
 */
class RegistrationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'tournament_id' => \App\Models\Tournament::factory(),
            'status' => $this->faker->randomElement(['pending', 'confirmed']),
            'registered_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
