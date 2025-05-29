<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Area;

class AreaSeeder extends Seeder
{
    public function run(): void
    {
        Area::create(['status' => 'phòng thường']); // id = 1
        Area::create(['status' => 'phòng riêng']);  // id = 2
    }
}
