<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExtrasAndFoodExtraSeeder extends Seeder
{
    public function run(): void
    {
        // Seed extras
        $extras = [
            ['name' => 'Trứng', 'price' => 15000],
            ['name' => 'Cheese', 'price' => 20000],
            ['name' => 'Bacon', 'price' => 15000],
            ['name' => 'Thịt', 'price' => 25000],
            ['name' => 'Tôm', 'price' => 25000],
        ];

        foreach ($extras as $extra) {
            DB::table('extras')->insert([
                'name' => $extra['name'],
                'price' => $extra['price'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Lấy id các extra vừa insert
        $extraIds = DB::table('extras')->pluck('id', 'name');
        $foodIds = DB::table('foods')->pluck('id', 'name');

        // Gán extras cho burger
        $burgerFoods = [
            'Tower Burger',
            'Crabby Party',
            'Bacon Cheese Burger',
            'Mushroom Burger',
            'BBQ Burger',
        ];

        foreach ($burgerFoods as $foodName) {
            $foodId = $foodIds[$foodName] ?? null;
            if ($foodId) {
                foreach (['Trứng', 'Cheese', 'Bacon'] as $extraName) {
                    DB::table('extra_food')->insert([
                        'food_id' => $foodId,
                        'extra_id' => $extraIds[$extraName],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // Gán extras cho pasta
        $pastaFoods = [
            'Bolognese Pasta',
            'Prawn Fetuccine And Olive',
        ];

        foreach ($pastaFoods as $foodName) {
            $foodId = $foodIds[$foodName] ?? null;
            if ($foodId) {
                foreach (['Tôm'] as $extraName) {
                    DB::table('extra_food')->insert([
                        'food_id' => $foodId,
                        'extra_id' => $extraIds[$extraName],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
