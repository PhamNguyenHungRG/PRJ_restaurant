<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class CashierController extends Controller
{
    // Lấy danh sách hóa đơn chưa thanh toán
    public function index()
    {
        $orders = Order::with(['table', 'orderDetails.food'])
            ->where('payment_status', false)
            ->get();

        return response()->json($orders);
    }

    // Chi tiết một hóa đơn
    public function show($id)
    {
        $order = Order::with(['table', 'orderDetails.food'])->findOrFail($id);
        return response()->json($order);
    }

    // Hoàn tất thanh toán
    public function complete(Request $request, $id)
    {
        $order = Order::with('table')->findOrFail($id);
        $order->payment_status = true;
        $order->status = 'completed';
        $order->save();

        $order->table->status = 'trống';
        $order->table->save();

        return response()->json(['message' => 'Thanh toán thành công']);
    }
}
