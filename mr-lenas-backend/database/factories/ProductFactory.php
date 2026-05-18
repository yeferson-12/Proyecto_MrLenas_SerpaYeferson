<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'      => $this->faker->words(3, true),
            'price'     => $this->faker->randomFloat(2, 5, 100),
            'category'  => $this->faker->randomElement(['Platos', 'Bebidas', 'Entradas']),
            'is_active' => true,
            'image_url' => null,
        ];
    }
}