<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
            ['role_code' => 'TN', 'role_name' => 'Thu Ngân'],
            ['role_code' => 'PV', 'role_name' => 'Phục Vụ'],
            ['role_code' => 'BP', 'role_name' => 'Bếp'],
            ['role_code' => 'BR', 'role_name' => 'Bar'],
            ['role_code' => 'QL', 'role_name' => 'Quản Lý'],
            ['role_code' => '', 'role_name' => 'Giám Sát'],
        ]);
    }
}
