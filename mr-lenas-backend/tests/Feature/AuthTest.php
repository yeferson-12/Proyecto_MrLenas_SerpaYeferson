<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    // ── Test 1: Login exitoso ──
    public function test_login_exitoso()
    {
        $user = User::factory()->create([
            'email'    => 'test@mrlenas.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'test@mrlenas.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['user', 'token']);
    }

    // ── Test 2: Login con credenciales incorrectas ──
    public function test_login_credenciales_incorrectas()
    {
        User::factory()->create([
            'email'    => 'test@mrlenas.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'test@mrlenas.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422);
    }

    // ── Test 3: Login sin email ──
    public function test_login_sin_email()
    {
        $response = $this->postJson('/api/login', [
            'password' => 'password123',
        ]);

        $response->assertStatus(422);
    }

    // ── Test 4: Login sin password ──
    public function test_login_sin_password()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'test@mrlenas.com',
        ]);

        $response->assertStatus(422);
    }

    // ── Test 5: Logout exitoso ──
    public function test_logout_exitoso()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Sesión cerrada correctamente.']);
    }

    // ── Test 6: Me devuelve usuario autenticado ──
    public function test_me_devuelve_usuario()
    {
        $user  = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->getJson('/api/me');

        $response->assertStatus(200)
                 ->assertJsonFragment(['email' => $user->email]);
    }

    // ── Test 7: Me sin token retorna 401 ──
    public function test_me_sin_token()
    {
        $response = $this->getJson('/api/me');
        $response->assertStatus(401);
    }
}