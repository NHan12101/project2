<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            LocationSeeder::class,
            PaymentSeeder::class,
            PersonalAccessTokenSeeder::class,
            PostSeeder::class,
        ]);
    }
}
