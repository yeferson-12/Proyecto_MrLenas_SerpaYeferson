<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    private function getToken()
    {
        $user = User::factory()->create();
        return $user->createToken('auth_token')->plainTextToken;
    }

    // ── Test 1: Listar productos activos ──
    public function test_listar_productos_activos()
    {
        Product::factory()->count(3)->create(['is_active' => true]);
        Product::factory()->create(['is_active' => false]);

        $token    = $this->getToken();
        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->getJson('/api/products');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json());
    }

    // ── Test 2: Crear producto válido ──
    public function test_crear_producto_valido()
    {
        $token    = $this->getToken();
        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/products', [
                             'name'     => 'Pollo a la brasa',
                             'price'    => 35.00,
                             'category' => 'Platos',
                         ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['name' => 'Pollo a la brasa']);
    }

    // ── Test 3: Crear producto sin nombre ──
    public function test_crear_producto_sin_nombre()
    {
        $token    = $this->getToken();
        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/products', [
                             'price'    => 35.00,
                             'category' => 'Platos',
                         ]);

        $response->assertStatus(422);
    }

    // ── Test 4: Crear producto con precio negativo ──
    public function test_crear_producto_precio_negativo()
    {
        $token    = $this->getToken();
        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/products', [
                             'name'     => 'Pollo',
                             'price'    => -10,
                             'category' => 'Platos',
                         ]);

        $response->assertStatus(422);
    }

    // ── Test 5: Actualizar producto ──
    public function test_actualizar_producto()
    {
        $product  = Product::factory()->create(['price' => 20.00]);
        $token    = $this->getToken();
        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->putJson("/api/products/{$product->id}", [
                             'price' => 25.00,
                         ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['price' => '25.00']);
    }

    // ── Test 6: Desactivar producto ──
    public function test_desactivar_producto()
    {
        $product  = Product::factory()->create(['is_active' => true]);
        $token    = $this->getToken();
        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Producto desactivado.']);

        $this->assertDatabaseHas('products', [
            'id'        => $product->id,
            'is_active' => false,
        ]);
    }

    // ── Test 7: Sin token no puede crear producto ──
    public function test_sin_token_no_puede_crear()
    {
        $response = $this->postJson('/api/products', [
            'name'     => 'Pollo',
            'price'    => 35.00,
            'category' => 'Platos',
        ]);

        $response->assertStatus(401);
    }
}