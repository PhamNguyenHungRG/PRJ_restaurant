<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // Đăng nhập người dùng và sử dụng session
    public function login(Request $request)
    {
        // Validate dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'staff_code' => 'required',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Kiểm tra mã nhân viên bắt đầu bằng "PV"
        if (substr($request->staff_code, 0, 2) !== 'PV') {
            return response()->json(['message' => 'Bạn không có quyền truy cập'], 403);
        }

        // Tìm user theo staff_code
        $user = User::where('staff_code', $request->staff_code)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Sai mã nhân viên hoặc mật khẩu'], 403);
        }

        // Lưu thông tin người dùng vào session
        session(['user' => $user]);

        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'user' => $user
        ]);
    }

    // Đăng xuất
    public function logout(Request $request)
    {
        $request->session()->forget('user');
        return response()->json(['message' => 'Đăng xuất thành công']);
    }
}