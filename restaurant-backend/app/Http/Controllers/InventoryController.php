<?php
namespace App\Http\Controllers;

use App\Models\InventoryReceipt;
use App\Models\InventoryReceiptDetail;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    // Lấy danh sách phiếu nhập kho
    public function index()
    {
        $receipts = InventoryReceipt::with('details.ingredient')->get();
        return response()->json($receipts);
    }

    // Tạo phiếu nhập kho mới
    public function store(Request $request)
    {
        $request->validate([
            'users_id' => 'required|integer',
            'receipt_date' => 'required|date',
            'note' => 'nullable|string',
            'details' => 'required|array|min:1',
            'details.*.ingredient_id' => 'required|integer|exists:ingredients,id',
            'details.*.quantity' => 'required|numeric|min:0',
            'details.*.unit_price' => 'required|numeric|min:0',
            'details.*.unit' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $receipt = InventoryReceipt::create([
                'users_id' => $request->users_id,
                'receipt_date' => $request->receipt_date,
                'note' => $request->note,
            ]);

            foreach ($request->details as $detail) {
                InventoryReceiptDetail::create([
                    'receipt_id' => $receipt->id,
                    'ingredient_id' => $detail['ingredient_id'],
                    'quantity' => $detail['quantity'],
                    'unit_price' => $detail['unit_price'],
                    'unit' => $detail['unit'],
                ]);

                // Cộng tồn kho nguyên liệu
                Ingredient::where('id', $detail['ingredient_id'])
                    ->increment('stock_quantity', $detail['quantity']);
            }

            DB::commit();
            return response()->json(['message' => 'Nhập kho thành công'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Lỗi khi nhập kho: ' . $e->getMessage()], 500);
        }
    }

    // Lấy chi tiết phiếu nhập kho
    public function show($id)
    {
        $receipt = InventoryReceipt::with('details.ingredient')->find($id);
        if (!$receipt) {
            return response()->json(['error' => 'Không tìm thấy phiếu nhập'], 404);
        }
        return response()->json($receipt);
    }

    // Cập nhật phiếu nhập kho (nếu cần)
    public function update(Request $request, $id)
    {
        // Tùy theo logic của bạn, thường phiếu nhập kho ít khi được sửa
        return response()->json(['message' => 'Chức năng cập nhật chưa được hỗ trợ'], 501);
    }

    // Xóa phiếu nhập kho (nếu cần)
    public function destroy($id)
    {
        // Tùy theo nghiệp vụ có cho xóa hay không
        return response()->json(['message' => 'Chức năng xóa chưa được hỗ trợ'], 501);
    }

    // Lấy chi tiết nhập kho theo ngày
    public function getByDate(Request $request)
{
    $date = $request->query('date');

    if (!$date) {
        return response()->json(['error' => 'Thiếu tham số ngày'], 400);
    }

    try {
        // Nếu date có giờ phút giây (vd: "14:30:00 27-05-2025")
        if (preg_match('/^\d{2}:\d{2}:\d{2}  \d{2}-\d{2}-\d{4}$/', $date)) {
             $carbonDate = \Carbon\Carbon::createFromFormat('H:i:s  d-m-Y', $date)->format('Y-m-d H:i:s');
            $details = DB::table('inventory_receipt_details')
                ->join('inventory_receipts', 'inventory_receipt_details.receipt_id', '=', 'inventory_receipts.id')
                ->join('ingredients', 'inventory_receipt_details.ingredient_id', '=', 'ingredients.id')
                ->select(
                    'ingredients.name as ingredient_name',
                    'inventory_receipt_details.quantity',
                    'inventory_receipt_details.unit_price',
                    'inventory_receipt_details.unit',
                    'inventory_receipts.created_at as date'
                )
                ->where('inventory_receipts.created_at', $carbonDate)
                ->get();
        }
        // Nếu date chỉ có ngày (vd: "27-05-2025")
        else if (preg_match('/^\d{2}-\d{2}-\d{4}$/', $date)){
            $carbonDate = \Carbon\Carbon::createFromFormat('d-m-Y', $date)->format('Y-m-d');
            $details = DB::table('inventory_receipt_details')
                ->join('inventory_receipts', 'inventory_receipt_details.receipt_id', '=', 'inventory_receipts.id')
                ->join('ingredients', 'inventory_receipt_details.ingredient_id', '=', 'ingredients.id')
                ->select(
                    'ingredients.name as ingredient_name',
                    'inventory_receipt_details.quantity',
                    'inventory_receipt_details.unit_price',
                    'inventory_receipt_details.unit',
                    'inventory_receipts.created_at as date'
                )
                ->whereDate('inventory_receipts.created_at', $carbonDate)
                ->get();
        }
        else{
            $carbonDate = \Carbon\Carbon::createFromFormat('m-Y', $date);
            $month = $carbonDate->month;
            $year = $carbonDate->year;
            $details = DB::table('inventory_receipt_details')
                ->join('inventory_receipts', 'inventory_receipt_details.receipt_id', '=', 'inventory_receipts.id')
                ->join('ingredients', 'inventory_receipt_details.ingredient_id', '=', 'ingredients.id')
                ->select(
                    'ingredients.name as ingredient_name',
                    'inventory_receipt_details.quantity',
                    'inventory_receipt_details.unit_price',
                    'inventory_receipt_details.unit',
                    'inventory_receipts.created_at as date'
                )
                ->whereMonth('inventory_receipts.created_at', $month)
            ->whereYear('inventory_receipts.created_at', $year)
            ->get();
        }

        return response()->json($details);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Lỗi định dạng ngày: ' . $e->getMessage()], 400);
    }
}

    public function getDisposals(Request $request)
{
    $query = DB::table('ingredient_disposals')
        ->join('ingredients', 'ingredient_disposals.ingredient_id', '=', 'ingredients.id')
        ->select(
            'ingredients.name as ingredient_name',
            'ingredient_disposals.quantity',
            'ingredient_disposals.reason',
            'ingredient_disposals.disposed_at'
        )
        ->orderBy('disposed_at', 'desc');

    // Lọc theo ngày/tháng nếu cần
    if ($request->has('date')) {
        $query->whereDate('disposed_at', $request->query('date'));
    }

    return response()->json($query->get());
}






}
