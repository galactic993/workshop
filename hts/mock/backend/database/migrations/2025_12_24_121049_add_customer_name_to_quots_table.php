<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * 得意先名カラムを追加
     * 得意先が「諸口」(customer_cd: 33900)の場合に実際の得意先名を入力するためのフィールド
     */
    public function up(): void
    {
        Schema::table('quots', function (Blueprint $table) {
            // 得意先名（120文字以内、諸口選択時に使用）
            $table->string('customer_name', 120)->nullable()->after('customer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quots', function (Blueprint $table) {
            $table->dropColumn('customer_name');
        });
    }
};
