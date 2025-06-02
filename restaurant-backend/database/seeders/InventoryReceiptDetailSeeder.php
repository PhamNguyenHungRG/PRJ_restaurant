<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventoryReceiptDetailSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('inventory_receipt_details')->insert([
            ['receipt_id' => 1, 'ingredient_id' => 1, 'quantity' => 10, 'unit_price' => 20000, 'unit' => 'kg'],
            ['receipt_id' => 1, 'ingredient_id' => 3, 'quantity' => 5, 'unit_price' => 5000, 'unit' => 'gói'],
            ['receipt_id' => 2, 'ingredient_id' => 2, 'quantity' => 7, 'unit_price' => 120000, 'unit' => 'kg'],
        ]);
    }
}
