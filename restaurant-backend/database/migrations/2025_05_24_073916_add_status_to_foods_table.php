<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_xx_xx_add_status_to_foods_table.php
    public function up()
    {
        Schema::table('foods', function (Blueprint $table) {
            $table->boolean('active')->default(true)->after('price');
        });
    }

    public function down()
    {
        Schema::table('foods', function (Blueprint $table) {
            $table->dropColumn('active');
        });
    }

};
