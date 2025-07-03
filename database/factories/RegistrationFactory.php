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
        $paymentStatus = $this->faker->randomElement(['pending', 'confirmed', 'failed']);
        
        return [
            'user_id' => \App\Models\User::factory(),
            'tournament_id' => \App\Models\Tournament::factory(),
            'status' => $paymentStatus === 'confirmed' ? 'confirmed' : 'pending',
            'registered_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'payment_method' => $this->faker->randomElement(['cash', 'transfer', 'card']),
            'payment_status' => $paymentStatus,
            'amount' => $this->faker->randomFloat(2, 10, 100),
            'payment_notes' => $this->faker->optional()->sentence(),
            'payment_confirmed_at' => $paymentStatus === 'confirmed' ? $this->faker->dateTimeBetween('-1 month', 'now') : null,
            'payment_confirmed_by' => $paymentStatus === 'confirmed' ? \App\Models\User::factory() : null,
        ];
    }
}
