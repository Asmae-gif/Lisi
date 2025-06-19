<?php

namespace Database\Factories;

use App\Models\Galleries;
use App\Models\Projet;
use App\Models\Publication;
use App\Models\Axe;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Galleries>
 */
class GalleriesFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Galleries::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Choisir aléatoirement un type d'entité
        $entityTypes = [
            ['type' => Projet::class, 'model' => Projet::class],
            ['type' => Publication::class, 'model' => Publication::class],
            ['type' => Axe::class, 'model' => Axe::class],
        ];

        $selectedType = $this->faker->randomElement($entityTypes);
        $entity = $selectedType['model']::inRandomOrder()->first();

        // Si aucune entité n'existe, créer une entité de test
        if (!$entity) {
            switch ($selectedType['type']) {
                case Projet::class:
                    $entity = Projet::create([
                        'titre_projet' => $this->faker->sentence,
                        'description_projet' => $this->faker->paragraph,
                        'date_debut' => $this->faker->date(),
                        'date_fin' => $this->faker->date(),
                        'statut_projet' => $this->faker->randomElement(['en_cours', 'termine', 'en_attente'])
                    ]);
                    break;
                case Publication::class:
                    $entity = Publication::create([
                        'titre_publication' => $this->faker->sentence,
                        'resume' => $this->faker->paragraph,
                        'type_publication' => $this->faker->randomElement(['article', 'conference', 'livre']),
                        'date_publication' => $this->faker->date()
                    ]);
                    break;
                case Axe::class:
                    $entity = Axe::create([
                        'slug' => $this->faker->slug,
                        'title' => $this->faker->sentence,
                        'problematique' => $this->faker->paragraph,
                        'objectif' => $this->faker->paragraph,
                        'approche' => $this->faker->paragraph,
                        'resultats_attendus' => $this->faker->paragraph
                    ]);
                    break;
            }
        }

        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->optional()->paragraph,
            'image_path' => 'galleries/' . $this->faker->uuid . '.jpg',
            'galleriesable_id' => $entity->id,
            'galleriesable_type' => $selectedType['type'],
        ];
    }

    /**
     * Créer une galerie pour un projet spécifique.
     */
    public function forProjet(Projet $projet): static
    {
        return $this->state(fn (array $attributes) => [
            'galleriesable_id' => $projet->id,
            'galleriesable_type' => Projet::class,
        ]);
    }

    /**
     * Créer une galerie pour une publication spécifique.
     */
    public function forPublication(Publication $publication): static
    {
        return $this->state(fn (array $attributes) => [
            'galleriesable_id' => $publication->id,
            'galleriesable_type' => Publication::class,
        ]);
    }

    /**
     * Créer une galerie pour un axe spécifique.
     */
    public function forAxe(Axe $axe): static
    {
        return $this->state(fn (array $attributes) => [
            'galleriesable_id' => $axe->id,
            'galleriesable_type' => Axe::class,
        ]);
    }
} 