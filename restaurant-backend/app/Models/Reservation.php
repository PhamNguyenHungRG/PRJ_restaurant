<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    public function food()
    {
        return $this->belongsTo(\App\Models\Food::class, 'id_food');
    }

}

