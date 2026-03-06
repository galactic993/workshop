<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * 見積テーブルのカラム変更:
     * - status → quot_status (カラム名変更)
     * - quot_date → quot_on (カラム名変更)
     * - reference_doc_path varchar(255) nullable を追加（見積概要の下）
     */
    public function up(): void
    {
        // status → quot_status
        Schema::table('quots', function (Blueprint $table) {
            $table->renameColumn('status', 'quot_status');
        });

        // quot_date → quot_on
        Schema::table('quots', function (Blueprint $table) {
            $table->renameColumn('quot_date', 'quot_on');
        });

        // reference_doc_path を追加（quot_summary の後）
        Schema::table('quots', function (Blueprint $table) {
            $table->string('reference_doc_path', 255)->nullable()->after('quot_summary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // reference_doc_path を削除
        Schema::table('quots', function (Blueprint $table) {
            $table->dropColumn('reference_doc_path');
        });

        // quot_on → quot_date
        Schema::table('quots', function (Blueprint $table) {
            $table->renameColumn('quot_on', 'quot_date');
        });

        // quot_status → status
        Schema::table('quots', function (Blueprint $table) {
            $table->renameColumn('quot_status', 'status');
        });
    }
};
