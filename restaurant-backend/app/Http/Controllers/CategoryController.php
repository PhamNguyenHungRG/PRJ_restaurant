<?php


namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Lấy danh sách tất cả categories
    public function index()
    {
        return response()->json(Category::all());
    }
}
