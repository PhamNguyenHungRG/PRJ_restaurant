<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run()
    {
        DB::table('categories')->insert([
            [
                'name' => 'Món chính',
                'status' => 'đồ ăn',
            ],
            [
                'name' => 'Khai vị',
                'status' => 'đồ ăn',
            ],
            [
                'name' => 'Salad',
                'status' => 'đồ ăn',
            ],
            [
                'name' => 'Soft drink',
                'status' => 'đồ uống',
            ],
            [
                'name' => 'Alcohol',
                'status' => 'đồ uống',
            ],
            [
                'name' => 'Wine',
                'status' => 'đồ uống',
            ],
            [
                'name' => 'Juices',
                'status' => 'đồ uống',
            ],
            [
                'name' => 'Tráng miệng',
                'status' => 'đồ ăn',
            ],
            [
                'name' => 'Món ăn kèm',
                'status' => 'đồ ăn',
            ],
            [
                'name' => 'Sốt',
                'status' => 'đồ ăn',
            ]
        ]);
    }
}
