<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    use HasFactory;

    protected $fillable = [
        'area_id',
        'table_number',
        'capacity',
        'guest_count',
        'status',
    ];

    // Table thuộc về 1 Area
    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    // Table có nhiều orders
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
