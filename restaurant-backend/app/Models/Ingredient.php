<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    protected $fillable = ['category_id', 'name', 'unit', 'stock_quantity'];

    public function category()
    {
        return $this->belongsTo(IngredientCategory::class, 'category_id');
    }

    public function receiptDetails()
    {
        return $this->hasMany(InventoryReceiptDetail::class);
    }

    public function wastes()
    {
        return $this->hasMany(InventoryWaste::class);
    }
}
