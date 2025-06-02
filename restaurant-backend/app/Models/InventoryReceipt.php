<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryReceipt extends Model
{
    protected $fillable = ['users_id', 'receipt_date', 'note'];

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function details()
    {
        return $this->hasMany(InventoryReceiptDetail::class, 'receipt_id');
    }
}
