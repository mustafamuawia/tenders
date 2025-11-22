<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MakeRfqDetailsColumnsNullable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rfq_details', function (Blueprint $table) {
            $table->integer('unit_price')->nullable()->change();
           
            $table->integer('admin_qty')->nullable()->change();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rfq_details', function (Blueprint $table) {
            //
        });
    }
}
