<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    // Các trường có thể được thêm vào thông qua "mass assignment"
    protected $fillable = ['code', 'description', 'discount_percent', 'start_date', 'end_date', 'active'];
}
