<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTendersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tenders', function (Blueprint $table) {
            $table->increments('TenderId');
            $table->unsignedBigInteger('UserId');
            $table->index('UserId');
            $table->foreign('UserId')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->text('EndUserCompanyName');
            $table->text('EndUserContactName');
            $table->text('EndUserContactEmail');
            $table->text('EndUserContactPhone');
            $table->text('InstallationCity');
            $table->text('InstallationState');
            $table->text('ClientCountry')->nullable();
            $table->text('ResellerCompanyName');
            $table->text('ResellerContactName');
            $table->text('ResellerEmail');
            $table->text('DistributorCompanyName');
            $table->text('DistributorContactName');
            $table->text('DistributorEmail');
            $table->text('TenderCode')->nullable();
            $table->text('Sector');
            $table->text('Summary')->nullable();
            $table->text('Revenue')->nullable();
            $table->date('PurchasingDecisionDate');
            $table->date('StartDate');
            $table->date('FinishDate');
            $table->text('Status')->nullable();
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
        Schema::dropIfExists('tenders');
    }
}
