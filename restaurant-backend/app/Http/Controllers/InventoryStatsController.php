<?php
namespace App\Http\Controllers;

use App\Models\InventoryReceiptDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryStatsController extends Controller
{
    // Thống kê theo ngày
    public function daily(Request $request)
{
    $date = $request->query('date', date('Y-m-d'));

    $stats = InventoryReceiptDetail::select(
        DB::raw('DATE_FORMAT(created_at, "%H:%i:%s  %d-%m-%Y") as date'),
        DB::raw('SUM(quantity) as total_quantity'),
        DB::raw('SUM(quantity * unit_price) as total_value')
    )
    ->whereDate('created_at', $date)
    ->groupBy(DB::raw('DATE_FORMAT(created_at, "%H:%i:%s  %d-%m-%Y")'))
    ->orderBy('date')
    ->get();

    return response()->json($stats);
}

    // Thống kê theo tháng
    public function monthly(Request $request)
    {
        $month = $request->query('month', date('Y-m'));
        $stats = InventoryReceiptDetail::select(
    DB::raw('DATE_FORMAT(created_at, "%d-%m-%Y") as date'),
    DB::raw('SUM(quantity) as total_quantity'),
    DB::raw('SUM(quantity * unit_price) as total_value')
)
->where(DB::raw('DATE_FORMAT(created_at, "%Y-%m")'), $month)
->groupBy(DB::raw('DATE_FORMAT(created_at,"%d-%m-%Y")'))
->orderBy('date')
->get();

return response()->json($stats);

    }

    // Thống kê theo năm
    public function yearly(Request $request)
{
    $year = $request->query('year', date('Y'));

    $stats = InventoryReceiptDetail::select(
        DB::raw('DATE_FORMAT(created_at, "%m-%Y") as date'),
        DB::raw('SUM(quantity) as total_quantity'),
        DB::raw('SUM(quantity * unit_price) as total_value')
    )
    ->whereYear('created_at', $year)
    ->groupBy(DB::raw('DATE_FORMAT(created_at, "%m-%Y")'))
    ->orderBy('date')
    ->get();

    return response()->json($stats);
}

 public function destructionDaily(Request $request)
    {
        $date = $request->query('date');

        if (!$date) {
            return response()->json(['error' => 'Thiếu tham số ngày'], 400);
        }

        $carbonDate = \Carbon\Carbon::createFromFormat('d-m-Y', $date)->format('Y-m-d');

        $stats = DB::table('destroyed_ingredients')
            ->join('ingredients', 'destroyed_ingredients.ingredient_id', '=', 'ingredients.id')
            ->select('ingredients.name', DB::raw('SUM(destroyed_ingredients.quantity) as total_quantity'))
            ->whereDate('disposed_at', $carbonDate)
            ->groupBy('ingredients.name')
            ->get();

        return response()->json($stats);
    }

    public function destructionMonthly(Request $request)
    {
        $month = $request->query('month'); // dạng "mm-yyyy"

        if (!$month) {
            return response()->json(['error' => 'Thiếu tham số tháng'], 400);
        }

        $carbon = \Carbon\Carbon::createFromFormat('m-Y', $month);
        $stats = DB::table('destroyed_ingredients')
            ->join('ingredients', 'destroyed_ingredients.ingredient_id', '=', 'ingredients.id')
            ->select('ingredients.name', DB::raw('SUM(destroyed_ingredients.quantity) as total_quantity'))
            ->whereMonth('disposed_at', $carbon->month)
            ->whereYear('disposed_at', $carbon->year)
            ->groupBy('ingredients.name')
            ->get();

        return response()->json($stats);
    }

    public function destructionYearly(Request $request)
    {
        $year = $request->query('year');

        if (!$year) {
            return response()->json(['error' => 'Thiếu tham số năm'], 400);
        }

        $stats = DB::table('destroyed_ingredients')
            ->join('ingredients', 'destroyed_ingredients.ingredient_id', '=', 'ingredients.id')
            ->select('ingredients.name', DB::raw('SUM(destroyed_ingredients.quantity) as total_quantity'))
            ->whereYear('disposed_at', $year)
            ->groupBy('ingredients.name')
            ->get();

        return response()->json($stats);
    }

}
