<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('clients')) {
            Schema::create('clients', function (Blueprint $table) {
                $table->increments('id');
                $table->text('client_name');
                $table->text('phone');
                $table->text('address');
                $table->text('country');
                $table->text('state');
                $table->text('city');
                $table->integer('partner_id')->nullable();
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
        Schema::dropIfExists('clients');
    }
}
