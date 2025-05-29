<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('inventory_receipt_details', function (Blueprint $table) {
            $table->id(); // Mã chi tiết phiếu nhập kho
            $table->unsignedBigInteger('receipt_id');     // Mã phiếu nhập kho
            $table->unsignedBigInteger('ingredient_id');  // Mã nguyên vật liệu
            $table->decimal('quantity', 10, 2);           // Số lượng
            $table->decimal('unit_price', 10, 2)->nullable(); // Đơn giá nhập (tùy chọn)
            $table->string('unit', 20);                   // Đơn vị

            $table->timestamps();

            // Khóa ngoại
            $table->foreign('receipt_id')
                  ->references('id')->on('inventory_receipts')
                  ->onDelete('cascade');

            $table->foreign('ingredient_id')
                  ->references('id')->on('ingredients')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_receipt_details');
    }
};