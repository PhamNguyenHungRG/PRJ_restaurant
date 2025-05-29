<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FoodSeeder extends Seeder
{
    public function run(): void
    {
        // Lấy danh sách category_id theo tên
        $categories = DB::table('categories')->pluck('id', 'name');

        // Dữ liệu món ăn có thêm trường 'image'
        $foods = [
            // Khai vị
            ['name' => 'Garlic Bread', 'price' => 55000, 'category' => 'Khai vị', 'image' => 'images/foods/garlic_bread.jpg'],
            ['name' => 'Cheese Garlic Bread', 'price' => 68000, 'category' => 'Khai vị', 'image' => 'images/foods/cheese_garlic_bread.jpg'],
            ['name' => 'Crispy Shrimp Tempura with Mango Salsa (4pcs)', 'price' => 125000, 'category' => 'Khai vị', 'image' => 'images/foods/crispy_shrimp_tempura.jpg'],
            ['name' => 'Grilled Prawn (4pcs)', 'price' => 125000, 'category' => 'Khai vị', 'image' => 'images/foods/grilled_prawn.jpg'],
            ['name' => 'Twister Fries', 'price' => 105000, 'category' => 'Khai vị', 'image' => 'images/foods/twister_fries.jpg'],
            ['name' => 'Guinness Wings (4pcs)', 'price' => 125000, 'category' => 'Khai vị', 'image' => 'images/foods/guinness_wings.jpg'],
            ['name' => 'BBQ Wings (4pcs)', 'price' => 125000, 'category' => 'Khai vị', 'image' => 'images/foods/bbq_wings.jpg'],
            ['name' => 'Buffalo Wings (4pcs)', 'price' => 125000, 'category' => 'Khai vị', 'image' => 'images/foods/buffalo_wings.jpg'],
            ['name' => 'Sashimi', 'price' => 135000, 'category' => 'Khai vị', 'image' => 'images/foods/sashimi.jpg'],
            ['name' => 'Potato Skins', 'price' => 95000, 'category' => 'Khai vị', 'image' => 'images/foods/potato_skins.jpg'],

            // Món ăn kèm
            ['name' => 'Loaded Fries', 'price' => 105000, 'category' => 'Món ăn kèm', 'image' => 'images/foods/loaded_fries.jpg'],
            ['name' => 'Wedges', 'price' => 85000, 'category' => 'Món ăn kèm', 'image' => 'images/foods/wedges.jpg'],
            ['name' => 'Fries', 'price' => 85000, 'category' => 'Món ăn kèm', 'image' => 'images/foods/fries.jpg'],
            ['name' => 'Curry Cheesy Fries', 'price' => 105000, 'category' => 'Món ăn kèm', 'image' => 'images/foods/curry_cheesy_fries.jpg'],
            ['name' => 'Seasonal Steam Veggies', 'price' => 45000, 'category' => 'Món ăn kèm', 'image' => 'images/foods/seasonal_veggies.jpg'],
            ['name' => 'Garden Salad', 'price' => 35000, 'category' => 'Món ăn kèm', 'image' => 'images/foods/garden_salad.jpg'],
            ['name' => 'Mash', 'price' => 75000, 'category' => 'Món ăn kèm', 'image' => 'images/foods/mash.jpg'],

            // Món chính
            ['name' => 'Saffron Chicken Curry On Rice', 'price' => 175000, 'category' => 'Món chính', 'image' => 'images/foods/saffron_chicken_curry.jpg'],
            ['name' => 'Prawn and Scallop Fried Rice', 'price' => 105000, 'category' => 'Món chính', 'image' => 'images/foods/prawn_scallop_fried_rice.jpg'],
            ['name' => 'Bolognese Pasta', 'price' => 165000, 'category' => 'Món chính', 'image' => 'images/foods/bolognese_pasta.jpg'],
            ['name' => 'Creamy Chicken Carbonara Pasta', 'price' => 185000, 'category' => 'Món chính', 'image' => 'images/foods/creamy_chicken_carbonara.jpg'],
            ['name' => 'Prawn Fetuccine And Olive', 'price' => 185000, 'category' => 'Món chính', 'image' => 'images/foods/prawn_fetuccine_olive.jpg'],
            ['name' => 'Pasta Riêu Cua', 'price' => 185000, 'category' => 'Món chính', 'image' => 'images/foods/pasta_rieu_cua.jpg'],
            ['name' => 'Ocean BaoBun', 'price' => 210000, 'category' => 'Món chính', 'image' => 'images/foods/ocean_baobun.jpg'],
            ['name' => 'Pulled Pork Bunzzie', 'price' => 155000, 'category' => 'Món chính', 'image' => 'images/foods/pulled_pork_bunzzie.jpg'],
            ['name' => 'Grilled Salmon', 'price' => 300000, 'category' => 'Món chính', 'image' => 'images/foods/grilled_salmon.jpg'],
            ['name' => 'Chicken Wrapp', 'price' => 155000, 'category' => 'Món chính', 'image' => 'images/foods/chicken_wrapp.jpg'],
            ['name' => 'Grilled Chick Quesadilla', 'price' => 195000, 'category' => 'Món chính', 'image' => 'images/foods/grilled_chick_quesadilla.jpg'],
            ['name' => 'Tower Burger', 'price' => 175000, 'category' => 'Món chính', 'image' => 'images/foods/tower_burger.jpg'],
            ['name' => 'Crabby Party', 'price' => 210000, 'category' => 'Món chính', 'image' => 'images/foods/crabby_party.jpg'],
            ['name' => 'Bacon Cheese Burger', 'price' => 150000, 'category' => 'Món chính', 'image' => 'images/foods/bacon_cheese_burger.jpg'],
            ['name' => 'Mushroom Burger', 'price' => 155000, 'category' => 'Món chính', 'image' => 'images/foods/mushroom_burger.jpg'],
            ['name' => 'BBQ Burger', 'price' => 155000, 'category' => 'Món chính', 'image' => 'images/foods/bbq_burger.jpg'],
            ['name' => 'Jalapenos', 'price' => 155000, 'category' => 'Món chính', 'image' => 'images/foods/jalapenos.jpg'],
            ['name' => 'Chicken Burger', 'price' => 155000, 'category' => 'Món chính', 'image' => 'images/foods/chicken_burger.jpg'],
            ['name' => 'Wagyu', 'price' => 650000, 'category' => 'Món chính', 'image' => 'images/foods/wagyu.jpg'],
            ['name' => 'Black Angus', 'price' => 599000, 'category' => 'Món chính', 'image' => 'images/foods/black_angus.jpg'],
            ['name' => 'Ribs Single', 'price' => 389000, 'category' => 'Món chính', 'image' => 'images/foods/ribs_single.jpg'],
            ['name' => 'Ribs Double', 'price' => 599000, 'category' => 'Món chính', 'image' => 'images/foods/ribs_double.jpg'],
            ['name' => 'Ribs Full', 'price' => 799000, 'category' => 'Món chính', 'image' => 'images/foods/ribs_full.jpg'],

            // Salad
            ['name' => 'Calamari Salad', 'price' => 155000, 'category' => 'Salad', 'image' => 'images/foods/calamari_salad.jpg'],
            ['name' => 'Caesar Salad', 'price' => 135000, 'category' => 'Salad', 'image' => 'images/foods/caesar_salad.jpg'],
            ['name' => 'Tuna Salad', 'price' => 145000, 'category' => 'Salad', 'image' => 'images/foods/tuna_salad.jpg'],
            ['name' => 'Fruit Salad', 'price' => 155000, 'category' => 'Salad', 'image' => 'images/foods/fruit_salad.jpg'],
            ['name' => 'Soft-shell Crab Salad', 'price' => 145000, 'category' => 'Salad', 'image' => 'images/foods/soft_shell_crab_salad.jpg'],

            // Sốt
            ['name' => 'Honey Mustard', 'price' => 25000, 'category' => 'Sốt', 'image' => 'images/foods/honey_mustard.jpg'],
            ['name' => 'Spicy Sauce', 'price' => 25000, 'category' => 'Sốt', 'image' => 'images/foods/spicy_sauce.jpg'],
            ['name' => 'Mayo', 'price' => 25000, 'category' => 'Sốt', 'image' => 'images/foods/mayo.jpg'],
            ['name' => 'Sweet Chilli and Sour Cream', 'price' => 25000, 'category' => 'Sốt', 'image' => 'images/foods/sweet_chilli_sour_cream.jpg'],
            ['name' => 'Black Pepper', 'price' => 25000, 'category' => 'Sốt', 'image' => 'images/foods/black_pepper.jpg'],
            ['name' => 'Mango Salsa', 'price' => 25000, 'category' => 'Sốt', 'image' => 'images/foods/mango_salsa.jpg'],
            ['name' => 'Tartar Sauce', 'price' => 25000, 'category' => 'Sốt', 'image' => 'images/foods/tartar_sauce.jpg'],
            ['name' => 'Beef Gravy', 'price' => 25000, 'category' => 'Sốt', 'image' => 'images/foods/beef_gravy.jpg'],
        ];

        // Thêm các trường còn thiếu
        $foodsToInsert = array_map(function ($food) use ($categories) {
            return [
                'name' => $food['name'],
                'price' => $food['price'],
                'image' => $food['image'] ?? 'images/foods/default.jpg',
                'menu_type' => 'goi_mon',
                'status' => 'con',
                'category_id' => $categories[$food['category']] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $foods);

        // Insert dữ liệu
        DB::table('foods')->insert($foodsToInsert);
    }
}
