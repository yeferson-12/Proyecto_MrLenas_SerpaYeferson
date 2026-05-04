<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::active()->orderBy('category')->get());
    }

    public function all()
    {
        return response()->json(Product::orderBy('category')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:100',
            'price'     => 'required|numeric|min:0',
            'category'  => 'required|string|max:50',
            'image_url' => 'nullable|url',
        ]);

        $product = Product::create($data);
        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'      => 'sometimes|string|max:100',
            'price'     => 'sometimes|numeric|min:0',
            'category'  => 'sometimes|string|max:50',
            'is_active' => 'sometimes|boolean',
            'image_url' => 'nullable|url',
        ]);

        $product->update($data);
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->update(['is_active' => false]);
        return response()->json(['message' => 'Producto desactivado.']);
    }
}