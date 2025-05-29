<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;

class ReservationController extends Controller
{
    public function search(Request $request)
    {
        $name = $request->query('name');

        $reservations = Reservation::where('name', 'LIKE', "%$name%")
            ->with('food')
            ->get(['id', 'name', 'phone', 'id_food']);

        return response()->json($reservations);
    }
}
