<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryReceiptDetail extends Model
{
    protected $fillable = ['receipt_id', 'ingredient_id', 'quantity', 'unit_price', 'unit'];

    public function receipt()
    {
        return $this->belongsTo(InventoryReceipt::class, 'receipt_id');
    }

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class, 'ingredient_id');
    }
}
