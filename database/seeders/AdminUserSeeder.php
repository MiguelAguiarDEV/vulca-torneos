<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user if it doesn't exist
        if (!User::where('email', 'admin@vulca-torneos.com')->exists()) {
            User::create([
                'name' => 'Administrador',
                'email' => 'admin@vulca-torneos.com',
                'password' => Hash::make('password'),
                'role' => User::ROLE_ADMIN,
                'email_verified_at' => now(),
            ]);

            $this->command->info('Admin user created successfully!');
            $this->command->info('Email: admin@vulca-torneos.com');
            $this->command->info('Password: password');
        } else {
            $this->command->info('Admin user already exists.');
        }
    }
}
