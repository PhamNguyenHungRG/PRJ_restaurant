<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('table_id');
            $table->foreign('table_id')->references('id')->on('tables');
            $table->enum('status', ['pending', 'sent', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
            $table->boolean('payment_status')->default(false);
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
