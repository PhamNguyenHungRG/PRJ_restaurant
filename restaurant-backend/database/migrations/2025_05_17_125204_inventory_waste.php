<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('inventory_waste', function (Blueprint $table) {
            $table->id();  // ID tự tăng
            $table->unsignedBigInteger('ingredient_id'); // Mã nguyên vật liệu bị bỏ
            $table->decimal('quantity', 10, 2);           // Số lượng bị bỏ
            $table->timestamp('waste_date')->useCurrent(); // Thời gian bỏ
            $table->text('reason')->nullable();           // Lý do bỏ

            $table->timestamps();

            $table->foreign('ingredient_id')
                  ->references('id')->on('ingredients')
                  ->onDelete('cascade'); // Xóa nguyên liệu -> xóa cả waste
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_waste');
    }
};