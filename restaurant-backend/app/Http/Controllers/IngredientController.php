<?php
namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    // Lấy danh sách nguyên liệu
    public function index()
    {
        $ingredients = Ingredient::all();
        return response()->json($ingredients);
    }

    // Tạo nguyên liệu mới
   public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string',
        'unit' => 'required|string',
        'category_id' => 'required|integer', // hoặc required nếu bạn muốn
        'stock_quantity' => 'required|numeric|min:0',
    ]);

    // Nếu không gửi thì mặc định là 0
    if (!isset($validated['stock_quantity'])) {
        $validated['stock_quantity'] = 0;
    }

    $ingredient = Ingredient::create($validated);
    return response()->json($ingredient, 201);
}



    // Lấy nguyên liệu theo id
    public function show($id)
    {
        $ingredient = Ingredient::find($id);
        if (!$ingredient) {
            return response()->json(['error' => 'Nguyên liệu không tồn tại'], 404);
        }
        return response()->json($ingredient);
    }

    // Cập nhật nguyên liệu
    public function update(Request $request, $id)
    {
        $ingredient = Ingredient::find($id);
        if (!$ingredient) {
            return response()->json(['error' => 'Nguyên liệu không tồn tại'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string',
            'category_id' => 'sometimes|required|integer',
            'stock_quantity' => 'sometimes|numeric|min:0',
            'unit' => 'sometimes|required|string',
        ]);

        $ingredient->update($request->all());
        return response()->json($ingredient);
    }

    // Xóa nguyên liệu
    public function destroy($id)
    {
        $ingredient = Ingredient::find($id);
        if (!$ingredient) {
            return response()->json(['error' => 'Nguyên liệu không tồn tại'], 404);
        }
        $ingredient->delete();
        return response()->json(['message' => 'Xóa nguyên liệu thành công']);
    }

    // Lấy nguyên liệu theo category
    public function byCategory($categoryId)
    {
        $ingredients = Ingredient::where('category_id', $categoryId)->get();
        return response()->json($ingredients);
    }
}
