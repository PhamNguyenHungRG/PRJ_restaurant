<?php


namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    /**
     * Lấy danh sách khu vực kèm bàn.
     */
    public function index()
    {
        // Load quan hệ 'tables' trong từng khu vực
        $areas = Area::with('tables')->get();

        return response()->json($areas);
    }
}


