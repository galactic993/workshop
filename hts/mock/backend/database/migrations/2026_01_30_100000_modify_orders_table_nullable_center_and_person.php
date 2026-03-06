<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * 主管センターid と 主管担当者id を nullable に変更
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // 主管センターid: NOT NULL → nullable
            $table->bigInteger('center_section_cd_id')->nullable()->change();

            // 主管担当者id: NOT NULL → nullable
            $table->bigInteger('person_in_charge_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * nullable → NOT NULL に戻す（既存データにNULLがある場合は失敗する）
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // 主管センターid: nullable → NOT NULL
            $table->bigInteger('center_section_cd_id')->nullable(false)->change();

            // 主管担当者id: nullable → NOT NULL
            $table->bigInteger('person_in_charge_id')->nullable(false)->change();
        });
    }
};
