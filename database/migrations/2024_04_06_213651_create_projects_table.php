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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('end_user_company_name');
            $table->string('end_user_contact_email');
            $table->string('distributor_contact_name');
            $table->decimal('estimated_revenue', 15, 2)->nullable();
            $table->date('estimated_implementation_finish_date')->nullable();
            $table->text('summary')->nullable();
            $table->string('end_user_contact_name');
            $table->string('end_user_contact_phone');
            $table->string('project_status');
            $table->string('installation_city')->nullable();
            $table->string('installation_state')->nullable();
            $table->string('distributor_email')->nullable();
            $table->date('estimated_business_purchasing_decision_date')->nullable();
            $table->date('estimated_implementation_start_date')->nullable();
            $table->string('sector');
            $table->string('project_code');
            $table->timestamps();
        });
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
