<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'staff_code' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('staff_code', $request->staff_code)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $roleName = $user->role->role_name;

        // Xác định route frontend
        $route = '';
        switch ($roleName) {
            case 'Thu Ngân':
                $route = '/cashier';
                break;
            case 'Phục Vụ':
                $route = '/order';
                break;
            case 'Bếp':
                $route = '/kitchen';
                break;
            case 'Quản Lý':
                $route = '/dashboard';
                break;
            default:
                $route = '/';
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $roleName,
            ],
            'redirect' => $route
        ]);
    }
}
