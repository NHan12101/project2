<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PersonalAccessToken;
use App\Models\User;
use Illuminate\Support\Str;

class PersonalAccessTokenSeeder extends Seeder
{
    public function run(): void
    {
        foreach (User::all() as $user) {
            PersonalAccessToken::create([
                'tokenable_id'   => $user->id,
                'tokenable_type' => 'App\\Models\\User',
                'name'           => 'auth_token',
                'token'          => hash('sha256', Str::random(40)),
                'abilities'      => '["*"]',
            ]);
        }
    }
}
