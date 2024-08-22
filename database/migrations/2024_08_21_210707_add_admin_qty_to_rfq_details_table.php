<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdminQtyToRfqDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rfq_details', function (Blueprint $table) {
            $table->integer('admin_qty')->after('qty')->default(0); // Adding admin_qty after qty
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
            $table->dropColumn('admin_qty');
        });
    }
}
