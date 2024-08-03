<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('items')) {
        Schema::create('items', function (Blueprint $table) {
            $table->increments('id');
            $table->string('item_name');
            $table->string('description')->nullable();
            $table->string('specifications')->nullable();
            $table->string('manufacturer')->nullable();
            $table->string('origin_country')->nullable();
            $table->string('note')->nullable();
            $table->integer('created_by');
            $table->softDeletes();
            $table->timestamps();
            $table->string('status')->default('Not Activated');
        });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('items');
    }
}
