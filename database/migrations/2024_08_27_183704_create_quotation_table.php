<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuotationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
            Schema::create('quotations', function (Blueprint $table) {
                $table->increments('id');
                $table->unsignedBigInteger('rfq_id');
                $table->date('expire_date');
                $table->softDeletes();
                $table->timestamps();
                $table->tinyInteger('status')->default(1);
            });
    
    }
        /**
         * Reverse the migrations.
         *
         * @return void
         */
        public function down()
        {
            Schema::dropIfExists('quotations');
        }
    }
    