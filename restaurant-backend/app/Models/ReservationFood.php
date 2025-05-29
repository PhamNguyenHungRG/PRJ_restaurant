<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationFood extends Model
{
    protected $fillable = ['reservation_id', 'food_id', 'quantity'];

    public function reservation() {
        return $this->belongsTo(Reservation::class);
    }

    public function food() {
        return $this->belongsTo(Food::class);
    }
}
