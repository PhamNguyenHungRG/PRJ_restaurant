<?php
namespace App\Http\Controllers;

use App\Models\InventoryWaste;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class WasteController extends Controller
{
    // Lấy danh sách phiếu xuất kho (waste)
    public function index()
    {
        $wastes = InventoryWaste::all();
        return response()->json($wastes);
    }

    // Tạo phiếu xuất kho
    public function store(Request $request)
    {
        $request->validate([
            'users_id' => 'required|integer',
            'waste_date' => 'required|date',
            'note' => 'nullable|string',
            'details' => 'required|array|min:1',
            'details.*.ingredient_id' => 'required|integer|exists:ingredients,id',
            'details.*.quantity' => 'required|numeric|min:0',
            'details.*.unit' => 'required|string',
        ]);

        // Tương tự như nhập kho, bạn có thể thêm chi tiết xử lý tại đây
        // Giảm tồn kho nguyên liệu tương ứng

        // Đơn giản ví dụ:
        try {
            $waste = InventoryWaste::create([
                'users_id' => $request->users_id,
                'waste_date' => $request->waste_date,
                'note' => $request->note,
            ]);

            foreach ($request->details as $detail) {
                $waste->details()->create([
                    'ingredient_id' => $detail['ingredient_id'],
                    'quantity' => $detail['quantity'],
                    'unit' => $detail['unit'],
                ]);

                // Giảm tồn kho
                $ingredient = \App\Models\Ingredient::find($detail['ingredient_id']);
                if ($ingredient) {
                    $ingredient->decrement('stock_quantity', $detail['quantity']);
                }
            }

            return response()->json(['message' => 'Xuất kho thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Lỗi khi xuất kho: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $waste = InventoryWaste::with('details.ingredient')->find($id);
        if (!$waste) {
            return response()->json(['error' => 'Không tìm thấy phiếu xuất kho'], 404);
        }
        return response()->json($waste);
    }

    public function update(Request $request, $id)
    {
        return response()->json(['message' => 'Chức năng cập nhật chưa được hỗ trợ'], 501);
    }

    public function destroy($id)
    {
        return response()->json(['message' => 'Chức năng xóa chưa được hỗ trợ'], 501);
    }

    public function getByDate(Request $request)
{
    $date = $request->query('date');

    if (!$date) {
        return response()->json(['error' => 'Thiếu tham số ngày'], 400);
    }

    try {
        $carbonDate = \Carbon\Carbon::createFromFormat('d-m-Y', $date)->format('Y-m-d');

        $details = DB::table('ingredient_disposals')
            ->join('ingredients', 'ingredient_disposals.ingredient_id', '=', 'ingredients.id')
            ->select(
                'ingredients.name as ingredient_name',
                'ingredient_disposals.quantity',
                'ingredient_disposals.reason',
                'ingredient_disposals.disposed_at'
            )
            ->whereDate('ingredient_disposals.disposed_at', $carbonDate)
            ->get();

        return response()->json($details);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Lỗi định dạng ngày: ' . $e->getMessage()], 400);
    }
}

}
