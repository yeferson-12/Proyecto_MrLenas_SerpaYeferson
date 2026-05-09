<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@mrlenas.com'],
            ['name' => 'Administrador', 'password' => Hash::make('Admin@MrLenas2026!'), 'role' => 'admin']
        );

        User::updateOrCreate(
            ['email' => 'cajero@mrlenas.com'],
            ['name' => 'Cajero Principal', 'password' => Hash::make('Cajero@MrLenas2026!'), 'role' => 'cajero']
        );

        User::updateOrCreate(
            ['email' => 'cocina@mrlenas.com'],
            ['name' => 'Cocinero Principal', 'password' => Hash::make('Cocina@MrLenas2026!'), 'role' => 'cocinero']
        );

        $productos = [
            ['name' => 'Pollo a la brasa (entero)',  'price' => 45.00, 'category' => 'Pollos'],
            ['name' => 'Pollo a la brasa (1/2)',      'price' => 25.00, 'category' => 'Pollos'],
            ['name' => 'Pollo a la brasa (1/4)',      'price' => 14.00, 'category' => 'Pollos'],
            ['name' => 'Parrilla mixta',              'price' => 38.00, 'category' => 'Parrillas'],
            ['name' => 'Anticuchos',                  'price' => 18.00, 'category' => 'Parrillas'],
            ['name' => 'Papas fritas',                'price' => 8.00,  'category' => 'Acompañamientos'],
            ['name' => 'Ensalada fresca',             'price' => 6.00,  'category' => 'Acompañamientos'],
            ['name' => 'Inca Kola 500ml',             'price' => 4.00,  'category' => 'Bebidas'],
            ['name' => 'Agua mineral',                'price' => 3.00,  'category' => 'Bebidas'],
            ['name' => 'Chicha morada 1L',            'price' => 7.00,  'category' => 'Bebidas'],
        ];

        foreach ($productos as $p) {
            Product::firstOrCreate(['name' => $p['name']], $p);
        }
    }
}