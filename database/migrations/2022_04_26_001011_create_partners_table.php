<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePartnersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('partners', function (Blueprint $table) {
            
            $table->increments('PartnerId');
            $table->text('CompanyEmail');
            $table->text('CompanyName');
            $table->text('Phone');
            $table->unsignedBigInteger('UserId');
            $table->index('UserId');
            $table->string('Class')->nullable();
            $table->foreign('UserId')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('partners');
    }
}
