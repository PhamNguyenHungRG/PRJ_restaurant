<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'required|exists:tables,id',
            'items' => 'required|array|min:1',
            'items.*.food_id' => 'required|exists:foods,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $order = Order::where('table_id', $validated['table_id'])
                ->whereIn('status', ['pending', 'sent'])
                ->latest()
                ->first();

            if (!$order) {
                $order = Order::create([
                    'table_id' => $validated['table_id'],
                    'status' => 'pending',
                ]);
            }

            foreach ($validated['items'] as $item) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'food_id' => $item['food_id'],
                    'quantity' => $item['quantity'],
                    'kitchen_status' => 'đang chờ',
                    'is_ready' => false,
                    'sent' => true,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Gửi món thành công',
                'order_id' => $order->id,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi gửi món',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // ✅ API gọi từ ReactJS sau reload để hiển thị lại bill
    public function getOrdersByTable(Request $request)
    {
        $tableId = $request->query('table_id');
        if (!$tableId) {
            return response()->json(['message' => 'table_id is required'], 400);
        }

        $orders = Order::where('table_id', $tableId)
            ->whereIn('status', ['pending', 'sent'])
            ->with('orderDetails.food')
            ->get();

        $orderItems = [];

        foreach ($orders as $order) {
            foreach ($order->orderDetails as $detail) {
                $foodId = $detail->food_id;

                // ✅ Gộp theo food_id + kitchen_status + is_ready
                $groupKey = $foodId . '_' . $detail->kitchen_status . '_' . ($detail->is_ready ? 'ready' : 'notready');

                if (!isset($orderItems[$groupKey])) {
                    $orderItems[$groupKey] = [
                        'id' => $detail->id,
                        'order_id' => $order->id, // ✅ Thêm order_id ở đây
                        'food_id' => $foodId,
                        'name' => $detail->food->name ?? '',
                        'price' => $detail->food->price ?? 0,
                        'quantity' => 0,
                        'is_ready' => $detail->is_ready,
                        'is_sent' => $detail->sent == true,
                        'kitchen_status' => $detail->kitchen_status,
                    ];
                }

                $orderItems[$groupKey]['quantity'] += $detail->quantity;
            }
        }

        return response()->json(array_values($orderItems));
    }

    public function getLatestByTable($table_id)
    {
        $order = Order::with('orderDetails.food')
            ->where('table_id', $table_id)
            ->whereIn('status', ['pending', 'sent'])
            ->latest()
            ->first();

        return response()->json($order);
    }

    // ✅ API xem bill chi tiết
    public function showByTable($table_id)
    {
        $order = Order::where('table_id', $table_id)
            ->whereIn('status', ['pending', 'sent'])
            ->with('orderDetails.food')
            ->latest()
            ->first();

        if (!$order) {
            return response()->json(null, 204);
        }

        return response()->json($order);
    }
    public function changeTable(Request $request)
    {
        $newTableId = $request->input('table_id');
        $orderItems = $request->input('order_items');
        $oldTableId = $request->input('old_table_id');

        DB::beginTransaction();

        try {
            // 🔍 Lấy trạng thái bàn cũ
            $oldStatus = DB::table('tables')
                ->where('id', $oldTableId)
                ->value('status');

            // ✅ Bàn cũ chuyển về trống
            DB::table('tables')
                ->where('id', $oldTableId)
                ->update(['status' => 'trống']);

            // ✅ Gán trạng thái cũ cho bàn mới
            DB::table('tables')
                ->where('id', $newTableId)
                ->update(['status' => $oldStatus]);

            // ✅ Cập nhật đơn hàng và món ăn
            $orderIds = collect($orderItems)->pluck('order_id')->unique();

            DB::table('orders')
                ->whereIn('id', $orderIds)
                ->update(['table_id' => $newTableId]);

            foreach ($orderItems as $item) {
                DB::table('order_details')
                    ->where('id', $item['id'])
                    ->update(['table_id' => $newTableId]);
            }

            DB::commit();
            return response()->json(['message' => 'Chuyển bàn thành công']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Có lỗi xảy ra khi chuyển bàn',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
