<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Membre;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            //'statut' => fake()->randomElement(['enseignant', 'doctorant', 'chercheur']),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn(array $attributes) => [
            'statut' => 'admin',
            'email' => fake()->unique()->safeEmail(),
        ]);
    }

    public function configure(): static
    {
        return $this->afterCreating(function (User $user) {
            // Ne pas créer de membre pour les utilisateurs admin
            if ($user->statut !== 'admin') {
                Membre::factory()->create([
                    'user_id' => $user->id,
                    'nom' => explode(' ', $user->name)[1] ?? $user->name,
                    'prenom' => explode(' ', $user->name)[0],
                    'statut' => $user->statut,
                    'email' => $user->email,
                    'slug' => Str::slug($user->name) . '-' . uniqid(),
                ]);
            }
        });
    }
}
