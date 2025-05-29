<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['table_id']; // Nếu bạn có trường khác, thêm vào đây

    public function details()
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class)->with('food'); // 👈 đảm bảo có 'food'
    }


}

