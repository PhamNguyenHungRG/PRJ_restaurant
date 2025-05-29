<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    use HasFactory;

    protected $table = 'foods';

    protected $fillable = [
        'name',
        'price',
        'image',
        'menu_type',
        'status',
        'active',
        'category_id',
    ];

    // Thêm thuộc tính ảo
    protected $appends = ['image_url'];

    // Quan hệ: Food thuộc về Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Quan hệ: Food có nhiều OrderDetail
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }

    // Accessor để trả về đường dẫn đầy đủ đến ảnh
    public function getImageUrlAttribute()
    {
        return $this->image ? url('images/foods/' . $this->image) : null;
    }
}
