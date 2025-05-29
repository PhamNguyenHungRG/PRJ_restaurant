<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('food_ingredients', function (Blueprint $table) {
            $table->unsignedBigInteger('food_id');          // Mã món ăn
            $table->unsignedBigInteger('ingredient_id');    // Mã nguyên liệu

            $table->decimal('quantity_per_unit', 10, 2);    // Số lượng mỗi đơn vị
            $table->string('unit', 20);                     // Đơn vị

            $table->primary(['food_id', 'ingredient_id']);  // Khóa chính kết hợp

            $table->foreign('food_id')->references('id')->on('foods')->onDelete('cascade');
            $table->foreign('ingredient_id')->references('id')->on('ingredients')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::dropIfExists('food_ingredients');
    }
};
