<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IngredientSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('ingredients')->insert([
            ['name' => 'Cà rốt', 'unit' => 'kg', 'stock_quantity' => 50, 'category_id' => 1],
            ['name' => 'Thịt bò', 'unit' => 'kg', 'stock_quantity' => 20, 'category_id' => 2],
            ['name' => 'Muối', 'unit' => 'gói', 'stock_quantity' => 100, 'category_id' => 3],
            ['name' => 'Hành lá', 'unit' => 'bó', 'stock_quantity' => 30, 'category_id' => 1],
        ]);
    }
}
