<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // KHÔNG DÙNG truncate vì bị ràng buộc FOREIGN KEY
        DB::table('users')->delete();
        DB::statement('ALTER TABLE users AUTO_INCREMENT = 1');

        // Thu Ngân
        DB::table('users')->insert([
            'staff_code' => 'TN001',
            'name' => 'Thu Ngân 1',
            'phone' => '0900000001',
            'password' => Hash::make('password123'),
            'role_id' => 1,
        ]);

        // Phục Vụ
        for ($i = 1; $i <= 20; $i++) {
            DB::table('users')->insert([
                'staff_code' => 'PV' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => 'Phục Vụ ' . $i,
                'phone' => '0900001' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'password' => Hash::make('password123'),
                'role_id' => 2,
            ]);
        }

        // Bếp
        for ($i = 1; $i <= 10; $i++) {
            DB::table('users')->insert([
                'staff_code' => 'BP' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => 'Bếp ' . $i,
                'phone' => '0900010' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'password' => Hash::make('password123'),
                'role_id' => 3,
            ]);
        }

        // Bar
        for ($i = 1; $i <= 2; $i++) {
            DB::table('users')->insert([
                'staff_code' => 'BR' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => 'Bar ' . $i,
                'phone' => '0900020' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'password' => Hash::make('password123'),
                'role_id' => 4,
            ]);
        }

        // Quản Lý
        DB::table('users')->insert([
            'staff_code' => 'QL001',
            'name' => 'Quản Lý 1',
            'phone' => '0900000002',
            'password' => Hash::make('password123'),
            'role_id' => 5,
        ]);

        // Giám Sát
        for ($i = 1; $i <= 2; $i++) {
            DB::table('users')->insert([
                'staff_code' => 'GS' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => 'Giám Sát ' . $i,
                'phone' => '0900030' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'password' => Hash::make('password123'),
                'role_id' => 6,
            ]);
        }
    }
}
