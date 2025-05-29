<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('extra_food', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('food_id');
            $table->unsignedBigInteger('extra_id');

            $table->foreign('food_id')->references('id')->on('foods')->onDelete('cascade');
            $table->foreign('extra_id')->references('id')->on('extras')->onDelete('cascade');

            $table->unique(['food_id', 'extra_id']);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('extra_food');
    }
};
