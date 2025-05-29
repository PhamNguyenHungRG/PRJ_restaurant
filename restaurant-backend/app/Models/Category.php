<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'status',  'active'];

    // 1 category có nhiều foods
    public function food()
    {
        return $this->hasMany(Food::class);
    }
}
