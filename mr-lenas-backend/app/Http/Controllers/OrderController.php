<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['items.product', 'user'])
            ->whereNotIn('status', ['entregado'])
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function history()
    {
        $orders = Order::with(['items.product', 'user'])
            ->where('status', 'entregado')
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'table_number'           => 'required|integer|min:1',
            'notes'                  => 'nullable|string',
            'items'                  => 'required|array|min:1',
            'items.*.product_id'     => 'required|exists:products,id',
            'items.*.quantity'       => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id'      => $request->user()->id,
                'table_number' => $request->table_number,
                'status'       => 'pendiente',
                'notes'        => $request->notes,
                'total'        => 0,
            ]);

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $product->id,
                    'quantity'   => $item['quantity'],
                    'unit_price' => $product->price,
                ]);
            }

            $order->load('items');
            $order->recalculateTotal();
            $order->update(['status' => 'en_preparacion']);

            DB::commit();
            return response()->json($order->load('items.product', 'user'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al registrar el pedido.'], 500);
        }
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pendiente,en_preparacion,listo,entregado',
        ]);

        $order->update(['status' => $request->status]);
        return response()->json($order->load('items.product', 'user'));
    }

    public function show(Order $order)
    {
        return response()->json($order->load('items.product', 'user'));
    }
}