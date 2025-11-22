<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuotationDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quotation_details', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('quotation_id');
            $table->integer('item_id');
            $table->decimal('rfq_qty', 18, 2);
            $table->decimal('available_qty', 18, 2);
            $table->integer('unit_id');
            $table->decimal('unit_price',18,2);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quotation_details');
    }
}
