<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('projects')) {
            Schema::create('projects', function (Blueprint $table) {
                $table->increments('id');
                $table->text('project_code')->nullable();
                $table->text('project_title')->nullable();
                $table->date('start_date')->nullable();
                $table->date('end_date')->nullable();
                $table->integer('client_id')->nullable();
                $table->integer('partner_id')->nullable();
                $table->text('country')->nullable();
                $table->text('state')->nullable();
                $table->text('city')->nullable();
                $table->text('address')->nullable();
                $table->softdelete();
                $table->timestamps();
                $table->tinyInteger('status')->default(1);
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
        Schema::dropIfExists('projects');
    }
}
