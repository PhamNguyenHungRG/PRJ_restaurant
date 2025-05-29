<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;

class FoodController extends Controller
{
    /**
     * Lấy danh sách tất cả món ăn (chỉ món đang hoạt động).
     */
    public function index()
    {
        $foods = Food::where('active', true)->with('category')->get();

        $foods->transform(function ($food) {
            // Nếu image đã có đường dẫn đầy đủ, không thêm prefix
            if (str_starts_with($food->image, 'images/foods/')) {
                $food->image_url = asset($food->image);
            } else {
                $food->image_url = asset('images/foods/' . $food->image);
            }

            return $food;
        });

        return response()->json([
            'success' => true,
            'data' => $foods,
        ]);
    }

    /**
     * Lấy món ăn theo category ID (chỉ món không bị ẩn).
     */
    public function getFoodsByCategory($categoryId)
    {
        $foods = Food::where('category_id', $categoryId)
            ->where('active', true)
            ->get();

        $foods->transform(function ($food) {
            if (str_starts_with($food->image, 'images/foods/')) {
                $food->image_url = asset($food->image);
            } else {
                $food->image_url = asset('images/foods/' . $food->image);
            }

            return $food;
        });

        return response()->json([
            'success' => true,
            'data' => $foods,
        ]);
    }

    /**
     * Lấy món ăn theo tên category (chỉ món không bị ẩn).
     */
    public function getFoodsByCategoryName($categoryName)
    {
        $foods = Food::whereHas('category', function ($query) use ($categoryName) {
            $query->where('name', $categoryName);
        })
            ->where('active', true)
            ->get();

        $foods->transform(function ($food) {
            if (str_starts_with($food->image, 'images/foods/')) {
                $food->image_url = asset($food->image);
            } else {
                $food->image_url = asset('images/foods/' . $food->image);
            }

            return $food;
        });

        return response()->json([
            'success' => true,
            'data' => $foods,
        ]);
    }
}
