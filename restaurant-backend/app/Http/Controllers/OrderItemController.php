<?php
namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    public function store(Request $request, $orderId)
    {
        $item = Order::create([
            'order_id' => $orderId,
            'food_id' => $request->food_id,
            'quantity' => $request->quantity,
            'is_ready' => false,
        ]);

        return response()->json($item);
    }

    public function markItemReady($itemId)
    {
        $item = Order::findOrFail($itemId);
        $item->is_ready = true;
        $item->save();

        $allReady = Order::where('order_id', $item->order_id)
                ->where('is_ready', false)
                ->count() === 0;

        if ($allReady) {
            $order = $item->order;
            $order->table->status = 'đã lên món';
            $order->table->save();
        }

        return response()->json(['success' => true]);
    }
}
