<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IngredientCategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('ingredient_categories')->insert([
            ['name' => 'Rau củ'],
            ['name' => 'Thịt cá'],
            ['name' => 'Gia vị'],
            ['name' => 'Khác'],
        ]);
    }
}
