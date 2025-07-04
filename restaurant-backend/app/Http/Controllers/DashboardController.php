<?php

namespace App\Http\Controllers;

use App\Models\Food;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    // ========== MÓN ĂN ==========
    public function getFoods() {
        return Food::with('category')->get();
    }

    public function createFood(Request $request) {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['name', 'price', 'category_id']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images/foods'), $filename);
            $data['image'] = 'images/foods/' . $filename;
        }

        return Food::create($data);
    }

    public function updateFood(Request $request, $id)
    {
        try {
            Log::info('📥 Dữ liệu nhận được từ frontend:', $request->all());

            $food = Food::findOrFail($id);

            $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'category_id' => 'required|exists:categories,id',
                'image' => 'nullable|image|max:2048',
            ]);

            // Cập nhật thông tin món ăn
            $food->name = $request->name;
            $food->price = $request->price;
            $food->category_id = $request->category_id;

            // Xử lý ảnh mới nếu có
            if ($request->hasFile('image')) {
                // Xóa ảnh cũ nếu có
                if ($food->image && file_exists(public_path($food->image))) {
                    unlink(public_path($food->image));
                }

                // Lưu ảnh mới
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('images/foods'), $filename);
                $food->image = 'images/foods/' . $filename;
            }

            $food->save();

            return response()->json(['message' => '✅ Cập nhật món thành công']);
        } catch (\Throwable $e) {
            Log::error('❌ Lỗi khi cập nhật món ăn:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function toggleFoodStatus($id) {
        $food = Food::findOrFail($id);
        $food->active = !$food->active;
        $food->save();
        return response()->json(['active' => $food->active]);
    }

    // ========== DANH MỤC ==========
    public function getCategories() {
        return Category::all();
    }

    public function createCategory(Request $request) {
        $request->validate([
            'name' => 'required|string',
        ]);
        return Category::create($request->all());
    }

    public function updateCategory(Request $request, $id) {
        $cat = Category::findOrFail($id);
        $cat->update($request->all());
        return $cat;
    }

    public function toggleCategoryStatus($id) {
        $cat = Category::findOrFail($id);
        $cat->active = !$cat->active;
        $cat->save();
        return response()->json(['active' => $cat->active]);
    }

    // ========== NHÂN VIÊN ==========
    public function getUsers() {
        return User::with('role')->get();
    }

    public function createUser(Request $request) {
        $request->validate([
            'name' => 'required|string',
            'staff_code' => 'required|unique:users',
            'password' => 'required|string|min:4',
            'role_id' => 'required|exists:roles,id',
        ]);

        return User::create([
            'name' => $request->name,
            'staff_code' => $request->staff_code,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
        ]);
    }

    public function updateUser(Request $request, $id) {
        $user = User::findOrFail($id);
        $data = $request->only(['name', 'role_id']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);
        return $user;
    }

    public function toggleUserStatus($id) {
        $user = User::findOrFail($id);
        $user->active = !$user->active;
        $user->save();
        return response()->json(['active' => $user->active]);
    }
    public function dashboardData()
    {
        // 1. Tổng doanh thu
        $totalRevenue = OrderDetail::join('orders', 'orders.id', '=', 'order_details.order_id')
            ->join('foods', 'foods.id', '=', 'order_details.food_id')
            ->where('orders.status', '!=', 'cancelled')
            ->sum(DB::raw('order_details.quantity * foods.price'));

        // 2. Top 5 món ăn
        $topFoods = OrderDetail::select('food_id', DB::raw('SUM(quantity) as total_quantity'))
            ->groupBy('food_id')
            ->orderByDesc('total_quantity')
            ->take(5)
            ->with('food') // assuming has relation `food`
            ->get()
            ->map(function($item) {
                return [
                    'name' => $item->food->name,
                    'price' => $item->food->price,
                    'quantity' => $item->total_quantity,
                ];
            });

        // 3. Order theo ngày trong tuần
        $ordersByDay = Order::select(DB::raw('DAYNAME(created_at) as day'), DB::raw('COUNT(*) as count'))
            ->groupBy(DB::raw('DAYNAME(created_at)'))
            ->get();

        // 4. Phân bố thời gian
        $ordersByTime = Order::select(DB::raw('HOUR(created_at) as hour'))
            ->get()
            ->groupBy(function($order) {
                $hour = $order->hour;
                if ($hour >= 6 && $hour < 12) return 'Morning';
                if ($hour >= 12 && $hour < 18) return 'Afternoon';
                return 'Evening';
            })
            ->map->count();

        return response()->json([
            'totalRevenue' => $totalRevenue,
            'topFoods' => $topFoods,
            'ordersByDay' => $ordersByDay,
            'ordersByTime' => $ordersByTime,
        ]);
    }

}