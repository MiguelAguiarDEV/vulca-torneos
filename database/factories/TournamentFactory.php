<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tournament>
 */
class TournamentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('+1 week', '+2 months');
        $endDate = $this->faker->dateTimeBetween($startDate, $startDate->format('Y-m-d H:i:s') . ' +1 week');
        $registrationStart = $this->faker->dateTimeBetween('now', $startDate);
        $registrationEnd = $this->faker->dateTimeBetween($registrationStart, $startDate);

        $name = $this->faker->company . ' ' . $this->faker->randomElement([
            'Championship',
            'Tournament',
            'Cup',
            'League',
            'Masters',
            'Open'
        ]);

        $hasLimit = $this->faker->boolean(70); // 70% chance of having a limit

        return [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name),
            'description' => $this->faker->paragraph(3),
            'image' => $this->faker->imageUrl(800, 400, 'tournament', true),
            'game_id' => \App\Models\Game::factory(),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'registration_start' => $registrationStart,
            'registration_end' => $registrationEnd,
            'entry_fee' => $this->faker->randomElement([0, 10, 15, 20, 25, 30]),
            'has_registration_limit' => $hasLimit,
            'registration_limit' => $hasLimit ? $this->faker->numberBetween(8, 64) : null,
            'status' => $this->faker->randomElement([
                'draft',
                'published',
                'registration_open',
                'registration_closed'
            ]),
        ];
    }
}
