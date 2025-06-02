<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventoryWasteSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('inventory_waste')->insert([
            ['ingredient_id' => 1, 'quantity' => 2.0, 'waste_date' => '2025-01-20 08:00:00', 'reason' => 'Hư hỏng'],
            ['ingredient_id' => 4, 'quantity' => 1.0, 'waste_date' => '2025-02-10 09:30:00', 'reason' => 'Quá hạn sử dụng'],
        ]);
    }
}
