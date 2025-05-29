<?php


namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    public function index()
    {
        return Table::with('area')->get(); // nếu bạn có quan hệ area
    }
    public function update(Request $request, $id)
    {
        $table = Table::findOrFail($id);

        // kiểm tra nếu $request không có status sẽ lỗi
        if (!$request->has('status')) {
            return response()->json(['error' => 'Thiếu status'], 422);
        }

        $table->status = $request->input('status');
        $table->save();

        return response()->json(['message' => 'Cập nhật trạng thái bàn thành công']);
    }
    public function show($id)
    {
        return Table::with('area')->findOrFail($id);
    }
    public function getAvailableTables()
    {
        // Lọc bàn có trạng thái "trống"
        $availableTables = Table::where('status', 'trống')->get();

        return response()->json($availableTables);
    }


}
