<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $fillable = ['status'];

    // 1 area có nhiều tables
    public function tables()
    {
        return $this->hasMany(Table::class);
    }
}
