<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DestroyedIngredient extends Model
{
    protected $table = 'destroyed_ingredients';
    protected $fillable = ['ingredient_id', 'quantity', 'unit', 'reason'];
}
