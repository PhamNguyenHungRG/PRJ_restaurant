<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Table;

class TableSeeder extends Seeder
{
    public function run(): void
    {
        $tableNumber = 1;

        // 🔹 40 bàn 2 người (phòng thường)
        foreach (range(1, 40) as $i) {
            Table::create([
                'area_id' => 1,
                'table_number' => 'A' . str_pad($tableNumber++, 1, '0', STR_PAD_LEFT),
                'capacity' => 2,
                'guess_count' => 0,
                'status' => 'trống',
            ]);
        }

        // 🔹 40 bàn 4 người
        foreach (range(1, 40) as $i) {
            Table::create([
                'area_id' => 1,
                'table_number' => 'B' . str_pad($tableNumber++, 1, '0', STR_PAD_LEFT),
                'capacity' => 4,
                'guess_count' => 0,
                'status' => 'trống',
            ]);
        }

        // 🔹 20 bàn 6 người
        foreach (range(1, 20) as $i) {
            Table::create([
                'area_id' => 1,
                'table_number' => 'C' . str_pad($tableNumber++, 1, '0', STR_PAD_LEFT),
                'capacity' => 6,
                'guess_count' => 0,
                'status' => 'trống',
            ]);
        }

        // 🔹 Phòng riêng
        $privateCapacities = [10, 15, 20, 10, 10];
        foreach ($privateCapacities as $capacity) {
            Table::create([
                'area_id' => 2,
                'table_number' => 'P' . str_pad($tableNumber++, 1, '0', STR_PAD_LEFT),
                'capacity' => $capacity,
                'guess_count' => 0,
                'status' => 'trống',
            ]);
        }
    }
}
