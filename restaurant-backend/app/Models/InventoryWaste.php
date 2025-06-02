<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryWaste extends Model
{
    protected $fillable = ['ingredient_id', 'quantity', 'unit', 'reason', 'waste_date'];

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class, 'ingredient_id');
    }
}
