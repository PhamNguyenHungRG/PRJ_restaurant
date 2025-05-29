<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use  App\Models\OrderDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderDetailController extends Controller
{
    public function updateStatus(Request $request, $id)
    {
        $detail = OrderDetail::findOrFail($id);
        $detail->kitchen_status = $request->input('kitchen_status');
        $detail->save();

        return response()->json(['message' => 'Cập nhật trạng thái thành công.']);
    }
    public function toggleServed($id)
    {
        $detail = OrderDetail::findOrFail($id);
        $detail->is_ready = !$detail->is_ready;
        $detail->save();

        return response()->json(['success' => true, 'is_ready' => $detail->is_ready]);
    }
    public function getPendingOrders()
    {
        // $orders = DB::table('order_details')
        //     ->join('orders', 'order_details.order_id', '=', 'orders.id')
        //     ->join('tables', 'orders.table_id', '=', 'tables.id')
        //     ->join('foods', 'order_details.food_id', '=', 'foods.id') // ✅ đúng
        //     ->select(
        //         'order_details.id as detail_id',
        //         'orders.id as order_id',
        //         'tables.table_number',
        //         'foods.name as food_name', // ✅ sửa lại từ food.name
        //         'order_details.quantity',
        //         'order_details.kitchen_status',
        //         'order_details.created_at'
        //     )
        //     ->where('order_details.kitchen_status', '!=', 'đã xong')
        //     ->get();

        // return response()->json($orders);
        $rawOrders = DB::table('order_details')
            ->join('orders', 'order_details.order_id', '=', 'orders.id')
            ->join('tables', 'orders.table_id', '=', 'tables.id')
            ->join('foods', 'order_details.food_id', '=', 'foods.id')
            ->select(
                'order_details.id as detail_id',
                'orders.id as order_id',
                'tables.table_number',
                'foods.name as food_name',
                'order_details.quantity',
                'order_details.kitchen_status',
                'order_details.created_at'
            )
            ->orderBy('orders.id')
            ->orderBy('order_details.created_at')
            ->get();

        // Gom nhóm theo từng đợt món ăn cùng order_id
        $groupedByOrderTime = [];

        foreach ($rawOrders as $item) {
            if ($item->kitchen_status === 'đã làm xong') continue; // bỏ qua món đã xong

            $key = $item->order_id . '|' . $item->created_at; // ghép order_id với thời điểm tạo món
            if (!isset($groupedByOrderTime[$key])) {
                $groupedByOrderTime[$key] = [];
            }
            $groupedByOrderTime[$key][] = $item;
        }

        // Sắp xếp theo thời gian gửi vào bếp
        $sortedGroups = collect($groupedByOrderTime)->sortBy(function ($group) {
            return $group[0]->created_at;
        })->values()->all();

        return response()->json($sortedGroups);
    }

    public function completeItem($id)
    {
        try {
            DB::table('order_details')
                ->where('id', $id)
                ->update([
                    'kitchen_status' => 'đã làm xong'
                ]);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            // Log lỗi và trả về lỗi rõ ràng hơn
            Log::error('Lỗi cập nhật kitchen_status: ' . $e->getMessage());
            return response()->json(['error' => 'Lỗi server nội bộ.'], 500);
        }
    }
    public function getOrderDetailsByOrderId($orderId)
    {
        $details = OrderDetail::with('food')
            ->where('order_id', $orderId)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'food_id' => $item->food_id,
                    'name' => $item->food->name,
                    'price' => $item->food->price,
                    'quantity' => $item->quantity,
                    'is_ready' => $item->is_ready,
                    'is_sent' => $item->sent,
                    'kitchen_status' => $item->kitchen_status,
                ];
            });

        return response()->json($details);
    }
    public function startCooking($id)
    {
        // $detail = OrderDetail::findOrFail($id);
        // $detail->kitchen_status = 'đang làm';
        // $detail->save();

        // return response()->json(['success' => true]);
        try {
            DB::table('order_details')
                ->where('id', $id)
                ->addSelect('order_details.id as detail_id')
                ->update([
                    'kitchen_status' => 'xác nhận làm'
                ]);
                

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            // Log lỗi và trả về lỗi rõ ràng hơn
            Log::error('Lỗi cập nhật kitchen_status: ' . $e->getMessage());
            return response()->json(['error' => 'Lỗi server nội bộ.'], 500);
        }
    }
    public function destroy($id)
    {
        $detail = OrderDetail::findOrFail($id);
        $detail->delete();

        return response()->json(['message' => 'Đã xóa món thành công']);
    }
    public function getPendingReady()
    {
        return OrderDetail::with(['food', 'order.table'])
            ->where('kitchen_status', 'đã làm xong')
            ->where('is_ready', false)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->food->name,
                    'table_number' => $item->order->table->table_number,
                    'kitchen_status' => $item->kitchen_status,
                    'is_ready' => $item->is_ready,
                    'created_at' => Carbon::parse($item->created_at)->timezone('Asia/Ho_Chi_Minh')->toDateTimeString(),
                ];
            });
    }
}
