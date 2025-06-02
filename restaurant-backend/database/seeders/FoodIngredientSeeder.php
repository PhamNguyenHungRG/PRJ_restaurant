<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FoodIngredientSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('food_ingredients')->insert([
            ['food_id' => 1, 'ingredient_id' => 2, 'quantity_per_unit' => 0.2, 'unit' => 'kg'],
            ['food_id' => 2, 'ingredient_id' => 1, 'quantity_per_unit' => 0.1, 'unit' => 'kg'],
            ['food_id' => 2, 'ingredient_id' => 4, 'quantity_per_unit' => 0.05, 'unit' => 'bó'],
        ]);
    }
}
