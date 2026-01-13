<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected $model = \App\Models\User::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->numerify('0#########'),
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
            'password' => Hash::make('password'), // mật khẩu mặc định
            'remember_token' => Str::random(10),
            'notification' => $this->faker->boolean ? '1' : '0',
        ];
    }
}
