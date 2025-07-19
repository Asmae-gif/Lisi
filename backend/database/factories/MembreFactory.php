<?php

namespace Database\Factories;

use App\Models\Membre;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Membre>
 */
class MembreFactory extends Factory
{
    protected $model = Membre::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'nom' => $this->faker->lastName(),
            'prenom' => $this->faker->firstName(),
            'statut' => $this->faker->randomElement(['enseignant', 'doctorant', 'chercheur', 'post-doc']),
            /*'grade' => $this->faker->randomElement([
                'Professeur', 
                'Maître de conférences', 
                'Doctorant', 
                'Post-doctorant'
            ]),*/
            'biographie' => $this->faker->paragraph(),
            //'photo' => null, // ou tu peux simuler une image: 'photo' => 'photos/default.jpg'
            //'slug' => Str::slug($this->faker->unique()->name()),
            'linkedin' => $this->faker->url(),
            'researchgate' => $this->faker->url(),
            'google_scholar' => $this->faker->url(),
        ];
    }
}
