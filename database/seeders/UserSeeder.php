<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Seed Admin Users
        User::create([
            'name' => 'Admin',
            'email' => 'unv@just.sd',
            'password' => Hash::make('123'),
            'role' => 'Admin',
            'status' => 'Activated', // Updated status
        ]);

        // Seed Partner Users
        User::create([
            'name' => 'Admin User',
            'email' => 'unv1@just.sd',
            'password' => Hash::make('123'),
            'role' => 'Admin',
            'status' => 'Not Activated', // Updated status
        ]);
    }
}
