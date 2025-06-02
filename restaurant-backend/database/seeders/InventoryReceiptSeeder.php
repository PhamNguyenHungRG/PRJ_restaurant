<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventoryReceiptSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('inventory_receipts')->insert([
            ['users_id' => 1, 'receipt_date' => '2024-12-01 10:00:00', 'note' => 'Nhập hàng tháng 12'],
            ['users_id' => 2, 'receipt_date' => '2025-01-10 14:00:00', 'note' => 'Bổ sung nguyên liệu'],
        ]);
    }
}
