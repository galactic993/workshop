<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * 見積テーブルに見積書ファイルパスカラムを追加
     */
    public function up(): void
    {
        Schema::table('quots', function (Blueprint $table) {
            // 見積書ファイルパス（見積日の次に追加）
            $table->string('quot_doc_path', 255)->nullable()->after('quot_on');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quots', function (Blueprint $table) {
            $table->dropColumn('quot_doc_path');
        });
    }
};
